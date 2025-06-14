import { useUsernameContext } from "../context/useUsernameContext";

type MessageProps = {
	username: string;
	content: string;
	image?: File; // ← Prop opcional
};

const Message = ({ username, content, image }: MessageProps) => {
	const { username: myUsername } = useUsernameContext();
	return (
		<div className="">
			{myUsername == username ? (
				<div className="flex justify-end w-full h-fit">
					<div className="bg-blue-700 text-white flex flex-col justify-start p-2 rounded-2xl rounded-br-none">
						<p className="">{content}</p>
					</div>
				</div>
			) : (
				<div className="flex justify-start items-start w-full h-fit gap-1">
					<img
						src={
							"https://ui-avatars.com/api/?name=" +
							username +
							"&background=random&rounded=true&size=40"
						}
					/>
					<div className="flex flex-col justify-start">
						<span className="text-lg text-slate-300 translate-x-3">{username}</span>
						<div className="bg-gray-700 text-white flex items-center justify-start  p-2 rounded-2xl ">
							<p className="">{content}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Message;
