import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChatContext } from "./useChatContext";
import type { ApiResponse, ChatContextType, ChatType, MessageInterface } from "../utils/types";
import { getUserChats } from "../api/use.api";
import { connectWebSocket, disconnectWebSocket, getStompClient } from "@/api/use.web-socket";
import type { Client, Frame } from "@stomp/stompjs";
import { toast } from "sonner";

interface Props {
	children: ReactNode;
}

export const ChatProvider: React.FC<Props> = ({ children }) => {
	const [activeChat, setActiveChat] = useState<ChatType | null>(null);
	const [chats, setChats] = useState<ChatType[]>([]);
	const [sync, setSync] = useState(false);

	const activeChatRef = useRef<ChatType | null>(null);

	const initializeUserChats = async ({ username }: { username: string }) => {
		console.log("initializing...");
		const retrievedChats = await getUserChats({ username });
		if (retrievedChats && retrievedChats.length > 0) {
			setChats(retrievedChats);

			connectWebSocket(() => {
				const client = getStompClient();

				subscribeToIndividualChats(client, retrievedChats);
				subscribeToUserChats({ client, username });
			});

			const previousActiveChatList = retrievedChats.filter(
				(chat) => chat.id! === activeChat?.id!,
			);
			if (previousActiveChatList.length === 1) {
				setActiveChat(previousActiveChatList[0]);
			} else {
				setActiveChat(null);
			}
		} else {
			setChats([]);
		}
	};

	const subscribeToUserChats = ({ client, username }: { client: Client; username: string }) => {
		client.subscribe(`/topic/chat/${username}`, (frame: Frame) => {
			const wsResponse: ApiResponse<ChatType[]> = JSON.parse(frame.body);

			console.log("User chats response: ", wsResponse);

			if (wsResponse.success) {
				const chats = wsResponse.content;
				console.log("Retrieved chats: ", chats.length, chats);
				console.log("First chat: " + chats[0]);

				setChats(chats);

				const previousActiveChatList = chats.filter(
					(chat) => chat.id! === activeChatRef.current?.id!,
				);
				if (previousActiveChatList.length === 1) {
					setActiveChat(previousActiveChatList[0]);
				} else {
					setActiveChat(null);
				}
			} else {
				toast.error("Something went wrong while retrieving the chats");
				console.error(wsResponse.message);
			}
		});
	};

	const subscribeToIndividualChats = (client: Client, chats: ChatType[]) => {
		chats.forEach((chat) => {
			client.subscribe(`/topic/chat/${chat.id}`, (frame: Frame) => {
				const wsResponse: ApiResponse<MessageInterface | null> = JSON.parse(frame.body);

				console.log("Response: ", wsResponse);

				if (wsResponse.success) {
					const newMessage = wsResponse.content!;
					console.log("📨 Mensaje recibido en chat", chat.id, newMessage);

					setChats((prevState) => {
						const updatedChats = prevState.map((mappedChat) => {
							if (mappedChat.id! == chat.id!) {
								return {
									...mappedChat,
									messages: [...mappedChat.messages, newMessage],
								};
							}

							return mappedChat;
						});

						const previousActiveChatList = updatedChats.filter(
							(chat) => chat.id! === activeChatRef.current?.id!,
						);
						if (previousActiveChatList.length === 1) {
							setActiveChat(previousActiveChatList[0]);
						} else {
							setActiveChat(null);
						}

						return updatedChats;
					});
				} else {
					toast.error("Something went wrong with the message");
					console.error(wsResponse.message);
				}
			});
		});
	};

	useEffect(() => {
		activeChatRef.current = activeChat;
	}, [activeChat]);

	useEffect(() => {
		return () => {
			disconnectWebSocket();
		};
	}, []);

	const contextData: ChatContextType = {
		chats,
		setChats,
		activeChat,
		setActiveChat,
		initializeUserChats,
		sync,
		setSync,
	};

	return <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>;
};

export default ChatContext;
