import { useEffect, useState } from "react";
import { useChatContext } from "../context/useChatContext";
import type { ChatType } from "../utils/types";
import ChatIcon from "./ChatIcon";

interface Props {
	chat: ChatType;
}

const ChatPreview: React.FC<Props> = ({ chat }) => {
	const { activeChat, setActiveChat } = useChatContext();

	chat.members.sort((left, right) => (left.isAdmin && !right.isAdmin ? -1 : 1));
	const memberUsernames = chat.members.map((member) => member.user.username);

	let lastMessage;
	if (chat.messages.length > 0) {
		lastMessage = chat.messages[chat.messages.length - 1].content;
	} else {
		lastMessage = "Start chatting!";
	}

	const [isActiveChat, setIsActiveChat] = useState(activeChat?.id == chat.id);

	useEffect(() => {
		console.log("Chat Preview: ");
		console.log("Chat: ", chat);
		console.log("active Chat: ", activeChat);
		console.log("activeChat?.id == chat.id", activeChat?.id == chat.id);
		setIsActiveChat(activeChat?.id == chat.id);
	}, [activeChat, chat]);

	const handleClick = () => {
		if (!isActiveChat) {
			setActiveChat(chat);
		}
	};

	return (
		<>
			<div
				className={
					(isActiveChat ? "bg-blue-500" : "bg-slate-700 hover:cursor-pointer") +
					" flex justify-start items-center gap-4 rounded-3xl  w-full h-fit p-4 "
				}
				onClick={handleClick}
			>
				<ChatIcon usernames={memberUsernames} />
				<div className="flex flex-col justify-center items-start flex-1 overflow-hidden">
					<span className="text-lg text-slate-100 truncate w-full">{chat.name}</span>
					<span className="text-sm text-gray-400 truncate w-full">{lastMessage}</span>
				</div>
			</div>
		</>
	);
};

export default ChatPreview;
