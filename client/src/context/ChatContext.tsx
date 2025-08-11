import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChatContext } from "./useChatContext";
import type { ApiResponse, ChatContextType, ChatType, MessageInterface } from "../utils/types";
import { getUserChats } from "../api/use.api";
import {
	connectWebSocket,
	disconnectWebSocket,
	getAllUsersViaWS,
	subscribeToChannel,
} from "@/api/use.web-socket";
import { toast } from "sonner";
import { useSpinner } from "./useSpinner";

interface Props {
	children: ReactNode;
}

export const ChatProvider: React.FC<Props> = ({ children }) => {
	const { showSpinner } = useSpinner();

	const [activeChat, setActiveChat] = useState<ChatType | null>(null);
	const [chats, setChats] = useState<ChatType[]>([]);

	const activeChatRef = useRef<ChatType | null>(null);

	const initializeUserChats = async ({ username }: { username: string }) => {
		console.log("initializing...");
		const retrievedChats = await getUserChats({ username });
		if (retrievedChats && retrievedChats.length > 0) {
			setChats(retrievedChats);

			const previousActiveChatList = retrievedChats.filter(
				(chat) => chat.id! === activeChat?.id!,
			);
			if (previousActiveChatList.length === 1) {
				setActiveChat(previousActiveChatList[0]);
			} else {
				setActiveChat(null);
			}

			return retrievedChats;
		} else {
			setChats([]);

			return [];
		}
	};

	const connectWebSocketAndSubscribe = ({
		chatsToSubscribe,
		username,
	}: {
		chatsToSubscribe: ChatType[];
		username: string;
	}) => {
		showSpinner(true);

		connectWebSocket(() => {
			showSpinner(false);

			chatsToSubscribe.forEach((chat) => {
				subscribeToIndividualChat(chat);
				subscribeToAdminsUpdates(chat);
			});
			subscribeToUserChats(username);

			getAllUsersViaWS();
		});
	};

	const subscribeToAdminsUpdates = (chat: ChatType) => {
		subscribeToChannel(
			`/topic/chat/${chat.id!}/admins-updates`,
			(wsResponse: ApiResponse<null>) => {
				console.log("Admin update: ", wsResponse);

				if (wsResponse.success) {
					toast.success(wsResponse.message);
				} else {
					toast.error("Something went wrong");
					console.error(wsResponse.message);
				}
			},
		);
	};

	const subscribeToUserChats = (username: string) => {
		subscribeToChannel(`/topic/chat/${username}`, (wsResponse: ApiResponse<ChatType[]>) => {
			console.log("User chats response: ", wsResponse);

			if (wsResponse.success) {
				const chats = wsResponse.content;
				console.log("📨 Retrieved chats: ", chats.length, chats);

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

	const subscribeToIndividualChat = (chat: ChatType) => {
		subscribeToChannel(
			`/topic/chat/${chat.id}`,
			(wsResponse: ApiResponse<MessageInterface | null>) => {
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
			},
		);
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
		connectWebSocketAndSubscribe,
	};

	return <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>;
};

export default ChatContext;
