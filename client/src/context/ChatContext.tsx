import { useState, type ReactNode } from "react";
import { ChatContext } from "./useChatContext";
import type { ChatContextType, ChatType, MessageInterface } from "../utils/types";
import { getUserChats } from "../api/use.api";
import { connectWebSocket, getStompClient } from "@/api/use.web-socket";

interface Props {
	children: ReactNode;
}

export const ChatProvider: React.FC<Props> = ({ children }) => {
	const [activeChat, setActiveChat] = useState<ChatType | null>(null);
	const [chats, setChats] = useState<ChatType[]>([]);
	const [sync, setSync] = useState(false);

	const initializeUserChats = async ({ username }: { username: string }) => {
		console.log("initializing...");
		const chats = await getUserChats({ username });
		if (chats && chats.length > 0) {
			setChats(chats);

			const previousActiveChatList = chats.filter((chat) => chat.id! === activeChat?.id!);
			if (previousActiveChatList.length === 1) {
				setActiveChat(previousActiveChatList[0]);
			} else {
				setActiveChat(null);
			}

			subscribeToChatViaWebSockets(chats);
		} else {
			setChats([]);
		}
	};

	const subscribeToChatViaWebSockets = (chats: ChatType[]) => {
		connectWebSocket(() => {
			const client = getStompClient();

			chats.forEach((chat) => {
				client.subscribe(`/topic/chat/${chat.id}`, (msg) => {
					const newMessage: MessageInterface = JSON.parse(msg.body);
					console.log("📨 Mensaje recibido en chat", chat.id, newMessage);

					// acá podrías actualizar `chats` o `activeChat` si coincide
					// podrías usar `setChats()` para actualizar los mensajes del chat correspondiente

					setChats((prevState) =>
						prevState.map((mappedChat) => {
							if (mappedChat.id! == chat.id!) {
								return {
									...mappedChat,
									messages: [...mappedChat.messages, newMessage],
								};
							}

							return mappedChat;
						}),
					);
				});
			});
		});
	};

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
