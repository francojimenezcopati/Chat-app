// import { useUsernameContext } from "../context/useUsernameContext";
import type { ChatType, MessageInterface } from "../utils/types";
import Message from "../components/Message";
import ChatIcon from "./ChatIcon";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
	chat: ChatType | null;
}

const Chat: React.FC<Props> = ({ chat }) => {
	const memberUsernames = chat?.members.map((member) => member.user.username);
	const formatedMembers = memberUsernames?.reduce((allUsernames, username, index) => {
		if (index < 6) {
			return allUsernames + ", " + username;
		} else {
			return allUsernames + "...";
		}
	});

	return (
		<div className="relative flex flex-col items-center justify-start gradient-mask bg-gradient-to-t from-[#292C35] via-80% via-[#363742] to-[#25262f] w-2/3 h-full rounded-b-xl">
			{chat != null ? (
				<>
					<div className="w-full flex justify-between items-center pt-1">
						<div className="flex items-center gap-5 ml-3">
							<ChatIcon usernames={memberUsernames!} />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">{chat.name}</span>
								<span className="text-xs text-slate-400">{formatedMembers}</span>
							</div>
						</div>
						<div className="flex items-center justify-end gap-3 mr-3">
							<Tooltip>
								<TooltipTrigger>
									<img
										className="w-6 h-6 hover:cursor-pointer"
										src="edit-chat.svg"
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>Edit chat</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger>
									<img
										className="w-6 h-6 hover:cursor-pointer"
										src="add-members.svg"
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>Add members</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger>
									<img
										className="w-6 h-6 hover:cursor-pointer"
										src="exit-chat.svg"
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>Exit chat</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>

					<div className="flex flex-col w-full h-full p-5 gap-5 overflow-y-auto  custom-scroll">
						{chat.messages &&
							chat.messages.map((message, index) => (
								<Message
									key={index}
									username={message.username}
									content={message.content}
								/>
							))}
					</div>

					<div className="flex items-center w-full h-fit px-7 pb-6 gap-2">
						<div
							className="w-11/12 h-10 rounded-lg flex items-center justify-between p-2 gap-2 
							focus-within:outline-2
							focus-within:outline-blue-400
							outline-1
							outline-blue-300
							shadow-xs
							shadow-blue-300
							"
						>
							<input
								className="flex-1 w-full p-1 rounded focus:outline-none text-lg text-wrap h-fit "
								type="text"
								placeholder="Message..."
								maxLength={200}
							/>
							<Tooltip>
								<TooltipTrigger>
									<img
										className="w-6 h-6 hover:cursor-pointer"
										src="attach-image.svg"
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>Attach image</p>
								</TooltipContent>
							</Tooltip>
						</div>
						<button className="bg-blue-400 hover:bg-blue-400/80 w-10 h-10 rounded-lg text-3xl hover:cursor-pointer flex items-center justify-center">
							<img className="h-6 w-6" src="send.svg" />
						</button>
					</div>
				</>
			) : (
				<div className="flex-1  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl text-gray-400 text-center">
					Select or create a chat to display it here!
				</div>
			)}
		</div>
	);
};

export default Chat;
