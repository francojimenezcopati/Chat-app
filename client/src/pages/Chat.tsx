import { useUsernameContext } from "../context/useUsernameContext";
import type { MessageInterface } from "../utils/types";
import Message from "./Message";

const Chat = () => {
	const { username } = useUsernameContext();

	const messages: MessageInterface[] = [
		{
			content: "Hola este es mi mensaje de texto",
			username: "fran",
		},
		{
			username: "chali",
			content:
				"asdklfjsdl kadsjfasdjfaskldf jldksf kasdjf lakdsf jalskdfjalsdkfjasdklfjadls kfjadskfjaskl f jals kdfjaldksfjasldkf asdlkf jasdlkfjas lkfasd jsd",
		},
		{
			content: "Fua para loco",
			username: "fran",
		},
	];

	return (
		<div className="flex flex-col items-center justify-start gradient-mask bg-gradient-to-t from-[#292C35] via-80% via-[#363742] to-[#25262f] w-2/3 h-full rounded-b-xl">
			{/* TOP BAR */}

			<div className="w-full flex justify-between items-center">
				<div className="flex items-center gap-5 ml-3">
					<img src="sdlakfjdklsjf" />
					<div className="flex flex-col justify-center items-start ">
						<span className="text-lg text-slate-100">Los de la nasa</span>
						<span className="text-xs text-slate-400">Fran, chali, insa, ...</span>
					</div>
				</div>
				<div className="flex items-center justify-end gap-3 mr-3">
					<img
						className="w-6 h-6 hover:cursor-pointer"
						src="edit-chat.svg"
						title="Edit chat"
					/>
					<img
						className="w-6 h-6 hover:cursor-pointer"
						src="add-members.svg"
						title="Add members"
					/>
					<img
						className="w-6 h-6 hover:cursor-pointer"
						src="exit-chat.svg"
						title="Exit chat"
					/>
				</div>
			</div>

			{/* Chat space */}

			<div className="flex flex-col w-full h-full p-5 gap-5 overflow-y-auto  custom-scroll">
				{messages &&
					messages.map((message, index) => (
						<Message
							key={index}
							username={message.username}
							content={message.content}
						/>
					))}
			</div>

			{/* Input message */}

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
					<img
						className="w-6 h-6 hover:cursor-pointer"
						src="attach-image.svg"
						title="Attach image"
					/>
				</div>
				<button className="bg-blue-400 hover:bg-blue-400/80 w-1/12 h-10 rounded-lg text-3xl hover:cursor-pointer flex items-center justify-center">
					<img className="h-6 w-6" src="send.svg" />
				</button>
			</div>
		</div>
	);
};

export default Chat;
