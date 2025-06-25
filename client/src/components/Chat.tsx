// import { useUsernameContext } from "../context/useUsernameContext";
import type { ChatType, MessageInterface, MessageRequest } from "../utils/types";
import Message from "../components/Message";
import ChatIcon from "./ChatIcon";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { addUsersToChat, getAllUsers, sendMessage } from "@/api/use.api";
import { useUsernameContext } from "@/context/useUsernameContext";
import { useEffect, useRef, useState } from "react";

import MultipleSelector, {
	type Option,
	type MultipleSelectorRef,
} from "@/components/ui/multiple-selector";
import { toast } from "sonner";
import Modal from "./Modal";
import { useChatContext } from "@/context/useChatContext";

interface Props {
	chat: ChatType | null;
}

const Chat: React.FC<Props> = ({ chat }) => {
	const { username } = useUsernameContext();
	const [messages, setMessages] = useState<MessageInterface[]>([]);
	const [formattedMemberUsernames, setFormattedMemberUsernames] = useState<string>("");

	const [memberUsernames, setMemberUsernames] = useState<string[]>([]);

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const [showMembersModal, setShowMembersModal] = useState(false);
	const [options, setOptions] = useState<Option[]>([]);
	const membersRef = useRef<MultipleSelectorRef>(null);

	const handleAddMembersClick = () => {
		setShowMembersModal(true);
		getAllUsers().then((users) => {
			if (users !== null) {
				let options: Option[] = [];
				users.forEach((user) => {
					if (!memberUsernames?.includes(user.username)) {
						options.push({
							label: user.username,
							value: user.username,
							disable: user.username.toLowerCase() == username ? true : false,
						});
					}
				});

				setOptions(options);
			} else {
				setShowMembersModal(false);
			}
		});
	};

	const handleConfirmAddMembers = async (e: React.FormEvent) => {
		e.preventDefault();
		const usernamesSelected = membersRef.current?.selectedValue.map(
			(memberSelected) => memberSelected.value,
		);

		if (usernamesSelected !== undefined && usernamesSelected.length > 0) {
			const success = await addUsersToChat({
				chatId: chat!.id!,
				usernames: usernamesSelected,
			});
			if (success) {
				console.log(memberUsernames);

				const newUsernames = [...memberUsernames, ...usernamesSelected];
				setMemberUsernames(newUsernames);

				const newFormattedUsernames = newUsernames.reduce(
					(allUsernames, username, index) => {
						if (index < 6) {
							return allUsernames + ", " + username;
						} else {
							return allUsernames + ", ...";
						}
					},
				);
				setFormattedMemberUsernames(newFormattedUsernames);
			}
		} else {
			toast.error("Something went wrong!");
		}
		setShowMembersModal(false);
	};

	useEffect(() => {
		if (chat) {
			if (chat.messages) {
				setMessages(chat.messages);
			}

			const usernames = chat.members.map((member) => member.user.username);

			setMemberUsernames(usernames);

			setFormattedMemberUsernames(
				usernames.reduce((allUsernames, username, index) => {
					if (index < 6) {
						return allUsernames + ", " + username;
					} else {
						return allUsernames + ", ...";
					}
				}),
			);
		}
	}, [chat]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const onSendMessage = async () => {
		const messageElement = document.getElementById("message") as HTMLInputElement;
		const messageContent = messageElement.value;
		messageElement.value = "";

		const message: MessageRequest = {
			username,
			content: messageContent,
			chatId: chat?.id!,
		};

		const messageDTO = await sendMessage({ message });
		if (messageDTO != null) {
			setMessages((prevState) => [...prevState!, messageDTO]);
		}
	};

	return (
		<div className="relative flex flex-col items-center justify-start bg-gradient-to-t from-[#292C35] via-80% via-[#363742] to-[#25262f] w-2/3 h-full rounded-b-xl">
			{chat != null ? (
				<>
					{/* TOP BAR */}

					<div className="w-full flex justify-between items-center pt-1">
						<div className="flex items-center gap-5 ml-3">
							<ChatIcon usernames={memberUsernames!} />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">{chat.name}</span>
								<span className="text-xs text-slate-400">
									{formattedMemberUsernames}
								</span>
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
										onClick={() => handleAddMembersClick()}
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

					{/* CAJA MENSAJES */}

					<div className="flex flex-col w-full h-full p-5 gap-5 overflow-y-auto  custom-scroll">
						{messages !== undefined &&
							messages.map((message, index) => (
								<Message
									key={index}
									username={message.username}
									content={message.content}
								/>
							))}
						<div ref={messagesEndRef} />
					</div>

					{/* INPUT */}

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
								id="message"
								type="text"
								placeholder="Message..."
								maxLength={200}
								onKeyDown={(e) => (e.key === "Enter" ? onSendMessage() : null)}
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
						<button
							onClick={() => onSendMessage()}
							className="bg-blue-400 hover:bg-blue-400/80 w-10 h-10 rounded-lg text-3xl hover:cursor-pointer flex items-center justify-center"
						>
							<img className="h-6 w-6" src="send.svg" />
						</button>
					</div>
				</>
			) : (
				<div className="flex-1  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl text-gray-400 text-center">
					Select or create a chat to display it here!
				</div>
			)}

			{/* MODAL */}

			{showMembersModal && (
				<Modal
					modalTitle="Add new members to the chat"
					handleConfirmModal={handleConfirmAddMembers}
					setShowModal={setShowMembersModal}
				>
					<div className="flex flex-col items-start justify-between gap-1 rounded-lg shadow-lg bg-slate-700 p-4 max-w-64">
						<MultipleSelector
							className=""
							options={options}
							defaultOptions={options}
							placeholder="Add members..."
							ref={membersRef}
							hidePlaceholderWhenSelected
							emptyIndicator={
								<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
									{options.length < 1 ? "..." : "Not users found"}
								</p>
							}
						/>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default Chat;
