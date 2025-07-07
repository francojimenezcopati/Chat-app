import type { MessageInterface, MessageType } from "@/utils/types";
import { useUsernameContext } from "../context/useUsernameContext";

type MessageProps = {
	message: MessageInterface;
};

const Message = ({ message }: MessageProps) => {
	const { username: myUsername } = useUsernameContext();
	const messageDate = new Date(message.createdAt);
	let messageTime = messageDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	if (messageTime[0] === "0") {
		messageTime = messageTime.slice(1);
	}

	return (
		<div className="">
			{message.type === "GENERAL" ? (
				<div className="flex justify-center w-full h-fit">
					<div className="bg-gray-600 text-white max-w-8/12 text-center flex justify-center items-center px-2 py-1 rounded-sm ">
						<p className="text-center">{message.content}</p>
					</div>
				</div>
			) : (
				<>
					{myUsername == message.username.toLowerCase() ? (
						<div className="flex flex-col justify-center items-end w-full h-fit">
							<div className="bg-blue-700 text-white text-center flex justify-center items-center p-2 rounded-2xl rounded-br-none">
								<p className="text-center">{message.content}</p>
							</div>
							<span className="text-sm text-gray-300 text-end -mb-3">
								{messageTime}
							</span>
						</div>
					) : (
						<div className="flex justify-start items-start w-full h-fit gap-1">
							<img
								src={
									"https://ui-avatars.com/api/?name=" +
									message.username +
									"&background=random&rounded=true&size=40"
								}
							/>
							<div className="flex flex-col justify-start">
								<span className="text-lg text-slate-300 translate-x-1">
									{message.username}
								</span>
								<div className="bg-gray-700 text-white flex items-center justify-center  p-2 rounded-2xl ">
									<p className="text-center w-full">{message.content}</p>
								</div>
								<span className="text-sm text-gray-300 text-start -mb-3 translate-x-1">
									{messageTime}
								</span>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Message;
