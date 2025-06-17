import type { ChatType, MessageInterface } from "../utils/types";
import ChatPreview from "./ChatPreview";

interface Props {
	chats: ChatType[];
}

const ChatList: React.FC<Props> = ({ chats }) => {
	return (
		<div className="flex flex-col items-center justify-start gap-10  w-1/3 h-full rounded-xl">
			<div className="w-full flex justify-between items-center">
				<span className="text-2xl text-slate-100">Chats</span>
				<img
					className="w-6 h-6 hover:cursor-pointer"
					src="create-chat.svg"
					title="New chat"
				/>
			</div>
			<div className="flex flex-col items-center justify-start gap-3 h-full w-full overflow-y-auto custom-scroll">
				{chats && chats.map((chat, index) => <ChatPreview key={index} chat={chat} />)}
				<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
					<img src="sdkfjlas" />
					<div className="flex flex-col justify-center items-start ">
						<span className="text-lg text-slate-100">Otro grupo</span>
						<span className="text-sm text-gray-400">Another message</span>
					</div>
				</div>
				<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
					<img src="sdkfjlas" />
					<div className="flex flex-col justify-center items-start ">
						<span className="text-lg text-slate-100">Otro grupo</span>
						<span className="text-sm text-gray-400">Another message</span>
					</div>
				</div>
				<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
					<img src="sdkfjlas" />
					<div className="flex flex-col justify-center items-start ">
						<span className="text-lg text-slate-100">Otro grupo</span>
						<span className="text-sm text-gray-400">Another message</span>
					</div>
				</div>
				<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
					<img src="sdkfjlas" />
					<div className="flex flex-col justify-center items-start ">
						<span className="text-lg text-slate-100">Otro grupo</span>
						<span className="text-sm text-gray-400">Another message</span>
					</div>
				</div>
				<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
					<img src="sdkfjlas" />
					<div className="flex flex-col justify-center items-start ">
						<span className="text-lg text-slate-100">Otro grupo</span>
						<span className="text-sm text-gray-400">Another message</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatList;
