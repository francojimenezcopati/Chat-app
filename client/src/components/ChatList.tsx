import { useState } from "react";
import type { ChatType, MessageInterface } from "../utils/types";
import ChatPreview from "./ChatPreview";

interface Props {
	chats: ChatType[];
}

const ChatList: React.FC<Props> = ({ chats }) => {
	const [showModal, setShowModal] = useState(false);

	const handleCreateChatClick = () => {
		console.log("clicked");
		setShowModal(true);
	};

	return (
		<div className="flex flex-col items-center justify-start gap-10  w-1/3 h-full rounded-xl">
			<div className="w-full flex justify-between items-center">
				<span className="text-2xl text-slate-100">Chats</span>
				<img
					onClick={handleCreateChatClick}
					className="w-6 h-6 hover:cursor-pointer"
					src="create-chat.svg"
					title="New chat"
				/>
			</div>
			<div className="flex flex-col items-center justify-start gap-3 h-full w-full overflow-y-auto custom-scroll">
				{chats.length > 0 ? (
					chats.map((chat, index) => <ChatPreview key={index} chat={chat} />)
				) : (
					<div className="flex items-center justify-center text-gray-400 text-center">
						Create a new chat to begin!
					</div>
				)}
			</div>

			{showModal && (
				<div
					className="absolute w-screen h-screen right-0 top-0 bg-slate-800/80 z-30"
					onClick={() => setShowModal(false)}
				>
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/5 bg-red-500 rounded-2xl ">
						<div className="relative w-full h-full flex items-center justify-center">
							<form>
								<span className="text-xl">Modal a hacer</span>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatList;
