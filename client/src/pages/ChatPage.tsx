import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import type { ChatType, MessageInterface } from "../utils/types";
import "./ChatPage.css";
import { useChatContext } from "../context/useChatContext";

interface Props {
	username: string;
}

const ChatPage: React.FC<Props> = ({ username }) => {
	const { chats, activeChat, initializeUserChats } = useChatContext();

	useEffect(() => {
		initializeUserChats({ username });
	}, []);

	return (
		<div className="h-full w-full flex justify-center items-center">
			<div className="flex justify-center items-center h-[97%] w-11/12 gap-5 p-3">
				<ChatList chats={chats} />
				<Chat chat={activeChat} />
			</div>
		</div>
	);
};

export default ChatPage;
