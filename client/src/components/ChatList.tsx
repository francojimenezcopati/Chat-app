import { useRef, useState } from "react";
import type { AppUser, ChatRequest, ChatType, MessageInterface } from "../utils/types";
import ChatPreview from "./ChatPreview";

import MultipleSelector, {
	type Option,
	type MultipleSelectorRef,
} from "@/components/ui/multiple-selector";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createChat, getAllUsers } from "@/api/use.api";
import { useUsernameContext } from "@/context/useUsernameContext";
import { toast } from "sonner";
import { useChatContext } from "@/context/useChatContext";

// const OPTIONS: Option[] = [
// 	{ label: "Fran", value: "fran" },
// 	{ label: "pepito", value: "Pepito", disable: true },
// 	{ label: "belal", value: "Belal" },
// ];

interface Props {
	chats: ChatType[];
}

const ChatList: React.FC<Props> = ({ chats }) => {
	const { username } = useUsernameContext();
	const { initializeUserChats } = useChatContext();

	const [showModal, setShowModal] = useState(false);
	const [options, setOptions] = useState<Option[]>([]);
	const membersRef = useRef<MultipleSelectorRef>(null);

	const handleCreateChatClick = () => {
		setShowModal(true);
		getAllUsers().then((users) => {
			if (users !== null) {
				let options: Option[] = [];
				users.forEach((user) => {
					options.push({
						label: user.username,
						value: user.username,
						disable: user.username.toLowerCase() == username ? true : false,
					});
				});
				console.log(options);

				setOptions(options);
			} else {
				setShowModal(false);
			}
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const chatName = (document.getElementById("chatName") as HTMLInputElement).value;
		const usernamesSelected = membersRef.current?.selectedValue.map(
			(memberSelected) => memberSelected.value,
		);

		console.log(chatName); // Datos del formulario
		console.log(usernamesSelected);

		if (usernamesSelected !== undefined) {
			const chat: ChatRequest = {
				name: chatName,
				creator: username,
				membersNames: usernamesSelected,
			};

			const res = await createChat({ chat });
			if (res !== null) {
				initializeUserChats({ username });
			}
		} else {
			toast.error("Something went wrong!");
		}
		setShowModal(false);
	};

	return (
		<div className="flex flex-col items-center justify-start gap-10  w-1/3 h-full rounded-xl">
			<div className="w-full flex justify-between items-center">
				<span className="text-2xl text-slate-100">Chats</span>
				<Tooltip>
					<TooltipTrigger>
						<img
							onClick={handleCreateChatClick}
							className="w-6 h-6 hover:cursor-pointer"
							src="create-chat.svg"
						/>
					</TooltipTrigger>
					<TooltipContent>
						<p>New chat</p>
					</TooltipContent>
				</Tooltip>
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
				<div className="absolute w-screen h-screen right-0 top-0 bg-slate-800/80 z-30">
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit bg-gray-900 rounded-2xl p-5 ">
						<div className="relative w-full h-full flex flex-col gap-5 items-center justify-center">
							<form
								method="POST"
								className="flex flex-col items-center justify-center gap-3"
							>
								<span className="text-2xl text-center w-full my-3">
									Create chat
								</span>
								<div className="flex flex-col items-start justify-between gap-1 rounded-lg shadow-lg bg-slate-700 p-4">
									<label
										className="-mt-2 text-gray-300 w-full"
										htmlFor="chatName"
									>
										Chat name
									</label>
									<input
										id="chatName"
										name="chatName"
										placeholder="e.g. 'My chat'"
										className="text-gray-100 focus:outline-none autofill:shadow-inner autofill:bg-slate-600"
										type="text"
									/>
								</div>
								<div className="flex flex-col items-start justify-between gap-1 rounded-lg shadow-lg bg-slate-700 p-4">
									<MultipleSelector
										className=""
										options={options}
										defaultOptions={options}
										placeholder="Add members..."
										ref={membersRef}
										hidePlaceholderWhenSelected
										emptyIndicator={
											<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
												{options.length < 1
													? "Loading..."
													: "Not users found"}
											</p>
										}
									/>
								</div>
								<div className="flex justify-center items-center gap-8">
									<button
										className="bg-red-500 hover:bg-red-500/70 rounded-xl p-2 hover:cursor-pointer"
										onClick={() => setShowModal(false)}
									>
										Cancel
									</button>

									<button
										className="bg-blue-500 hover:bg-blue-500/70 rounded-xl p-2 hover:cursor-pointer"
										onClick={(e) => handleSubmit(e)}
									>
										Create
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

// <label className="-mt-2 text-gray-300 w-full" htmlFor="members">
// 	Members
// </label>
// <input
// 	id="members"
// 	name="members"
// 	className="text-gray-100 focus:outline-none autofill:shadow-inner autofill:bg-slate-600"
// 	type="text"
// />

export default ChatList;
