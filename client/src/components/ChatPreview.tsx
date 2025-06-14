import type { ChatType } from "../utils/types";
import ChatIcon from "./ChatIcon";

interface Props {
	chat: ChatType;
}

const ChatPreview: React.FC<Props> = ({ chat }) => {
	const memberUsernames = chat.members.map((member) => member.user.username);
	const lastMessage = chat.messages[chat.messages.length - 1].content;

	return (
		<>
			<div className="flex justify-start items-center gap-4 rounded-3xl bg-blue-500 w-full h-fit p-4 ">
				<ChatIcon usernames={memberUsernames} />
				<div className="flex flex-col justify-center items-start flex-1 overflow-hidden">
					<span className="text-lg text-slate-100 truncate w-full">{chat.name}</span>
					<span className="text-sm text-gray-400 truncate w-full">{lastMessage}</span>
				</div>
			</div>
			{/*
			<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
				<ChatIcon usernames={memberUsernames} />
				<div className="flex flex-col justify-center items-start flex-1 overflow-hidden">
					<span className="text-lg text-slate-100 truncate w-full">{chat.name}</span>
					<span className="text-sm text-gray-400 truncate w-full">{lastMessage}</span>
				</div>
			</div>
			*/}
		</>
	);
};

export default ChatPreview;
