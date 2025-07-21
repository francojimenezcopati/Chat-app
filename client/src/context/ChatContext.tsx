import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChatContext } from "./useChatContext";
import type { ChatContextType, ChatType, MessageInterface } from "../utils/types";
import { getUserChats } from "../api/use.api";
import { connectWebSocket, getStompClient } from "@/api/use.web-socket";
import type { Frame } from "@stomp/stompjs";

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

			subscribeToChatViaWebSockets(retrievedChats);

			console.log("Active chat: ", activeChat);
			const previousActiveChatList = retrievedChats.filter(
				(chat) => chat.id! === activeChat?.id!,
			);
			console.log("previousActiveChatList", previousActiveChatList);
			if (previousActiveChatList.length === 1) {
				setActiveChat(previousActiveChatList[0]);
			} else {
				console.log("setting Active chat to NULL...");
				setActiveChat(null);
			}
		} else {
			setChats([]);
		}
	};

	const subscribeToChatViaWebSockets = (chats: ChatType[]) => {
		connectWebSocket(() => {
			const client = getStompClient();

			chats.forEach((chat) => {
				client.subscribe(`/topic/chat/${chat.id}`, (msg: Frame) => {
					const newMessage: MessageInterface = JSON.parse(msg.body);
					console.log("📨 Mensaje recibido en chat", chat.id, newMessage);

					console.log("Active chat in subscribe: ", activeChatRef.current);

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
						console.log("Previous active chat list", previousActiveChatList);
						if (previousActiveChatList.length === 1) {
							setActiveChat(previousActiveChatList[0]);
						} else {
							console.log("setting Active chat to NULL...");
							setActiveChat(null);
						}

						return updatedChats;
					});
				});
			});
		});
	};

	useEffect(() => {
		activeChatRef.current = activeChat;
	}, [activeChat]);

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
