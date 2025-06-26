import { useState, type ReactNode } from "react";
import { ChatContext } from "./useChatContext";
import type { ChatContextType, ChatType } from "../utils/types";
import { getUserChats } from "../api/use.api";

interface Props {
	children: ReactNode;
}

export const ChatProvider: React.FC<Props> = ({ children }) => {
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
		} else {
			setChats([]);
		}
	};

	const [activeChat, setActiveChat] = useState<ChatType | null>(null);
	const [chats, setChats] = useState<ChatType[]>([]);

	const contextData: ChatContextType = {
		chats,
		setChats,
		activeChat,
		setActiveChat,
		initializeUserChats,
	};

	return <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>;
};

export default ChatContext;
