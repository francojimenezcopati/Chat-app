// import { useUsernameContext } from "../context/useUsernameContext";
import type { ChatType, MessageInterface, MessageRequest } from "../utils/types";
import Message from "../components/Message";
import ChatIcon from "./ChatIcon";

import { addUsersToChat, getAllUsers, sendMessage } from "@/api/use.api";
import { useUsernameContext } from "@/context/useUsernameContext";
import { useEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MultipleSelector, {
	type Option,
	type MultipleSelectorRef,
} from "@/components/ui/multiple-selector";

import { toast } from "sonner";
import Modal from "./Modal";
import { useChatContext } from "@/context/useChatContext";
import { useSpinner } from "@/context/useSpinner";
import ConfirmModal from "./ConfirmModal";
import ListItem from "./ListItem";
import { profile } from "console";

interface Props {
	chat: ChatType | null;
}

const Chat: React.FC<Props> = ({ chat }) => {
	// console.log("--- chat.tsx comp ---");
	// console.log(chat);
	const { initializeUserChats, sync, setSync } = useChatContext();
	const { username } = useUsernameContext();
	const { showSpinner } = useSpinner();

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const [showManageMembersModal, setShowManageMembersModal] = useState(false);
	const [showMembersModal, setShowMembersModal] = useState(false);
	const [showEditChatModal, setShowEditChatModal] = useState(false);

	const [options, setOptions] = useState<Option[]>([]);
	const membersRef = useRef<MultipleSelectorRef>(null);

	const [messages, setMessages] = useState<MessageInterface[] | undefined>(chat?.messages);

	const memberUsernames = chat?.members.map((member) => member.user.username);
	const formattedMemberUsernames = memberUsernames?.reduce((allUsernames, username, index) => {
		if (index < 6) {
			return allUsernames + ", " + username;
		} else if (index === 6) {
			return allUsernames + ", ...";
		} else {
			return allUsernames;
		}
	});

	const isCurrentUserChatAdmin = chat?.members.some(
		(membership) =>
			membership.isAdmin && membership.user.username.toLowerCase() == username.toLowerCase(),
	);

	useEffect(() => {
		if (chat) {
			chat.members.sort((left, right) => (left.isAdmin && !right.isAdmin ? -1 : 1));

			setMessages(chat.messages);
		}
	}, [chat]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (sync && !showManageMembersModal) {
			showSpinner(true);
			initializeUserChats({ username }).then(() => showSpinner(false));

			setSync(false);
		}
	}, [sync, showManageMembersModal]);

	const handleManageMembersClick = () => {
		let options: Option[] = [];
		memberUsernames?.forEach((memberUsername) => {
			options.push({
				label: memberUsername,
				value: memberUsername,
				disable: memberUsername.toLowerCase() == username ? true : false,
			});
		});

		setOptions(options);

		setShowManageMembersModal(true);
	};

	const handleEditChatNameClick = () => {
		setShowEditChatModal(true);
	};

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

	const handleConfirmEditChatName = async (e: React.FormEvent) => {
		e.preventDefault();
		const newChatName = (document.getElementById("chatName") as HTMLInputElement).value;

		console.log(newChatName);

		setShowEditChatModal(false);
	};

	const handleConfirmAddMembers = async (e: React.FormEvent) => {
		e.preventDefault();
		const usernamesSelected = membersRef.current?.selectedValue.map(
			(memberSelected) => memberSelected.value,
		);

		if (usernamesSelected !== undefined && usernamesSelected.length > 0) {
			showSpinner(true);
			const success = await addUsersToChat({
				chatId: chat!.id!,
				usernames: usernamesSelected,
			});
			showSpinner(false);
			if (success) {
				initializeUserChats({ username });
			}
		} else {
			toast.error("Something went wrong!");
		}
		setShowMembersModal(false);
	};

	const onSendMessage = async () => {
		const messageElement = document.getElementById("message") as HTMLInputElement;
		const messageContent = messageElement.value;
		messageElement.value = "";

		const message: MessageRequest = {
			username,
			content: messageContent,
			chatId: chat?.id!,
		};

		const provisionalMessage: MessageInterface = {
			fake: true,
			content: messageContent,
			username,
			createdAt: new Date(),
		};

		setMessages((prevState) => [...prevState!, provisionalMessage]);

		const messageDTO = await sendMessage({ message });

		if (messageDTO != null) {
			setMessages((prevState) => {
				const provisionalMessageIndex = prevState!.findIndex(
					(msg) => msg.content == messageContent && msg.fake == true,
				);
				prevState![provisionalMessageIndex] = messageDTO;
				const newState = [...prevState!];

				return newState;
			});
			chat?.messages.push(messageDTO);
		} else {
			setMessages((prevState) => {
				const newState = prevState!.filter(
					(msg) => msg.content != messageContent || msg.fake != true,
				);
				return [...newState];
			});
		}
	};

	return (
		<div className="relative flex flex-col items-center justify-start bg-gradient-to-t from-[#292C35] via-80% via-[#363742] to-[#25262f] w-2/3 h-full rounded-b-xl">
			{chat != null ? (
				<>
					{/* TOP BAR */}

					<div className="w-full flex justify-between items-center pt-1">
						<div className="flex items-center gap-5 ml-3 ">
							<ChatIcon usernames={memberUsernames!} />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">{chat.name}</span>
								<span className="text-xs text-slate-400">
									{formattedMemberUsernames}
								</span>
							</div>
						</div>
						<div className="flex items-center justify-end gap-3 mr-3 min-w-[140px]">
							{isCurrentUserChatAdmin && (
								<>
									<Tooltip>
										<TooltipTrigger>
											<img
												className="w-6 h-6 hover:cursor-pointer"
												src="edit-chat.svg"
												onClick={handleEditChatNameClick}
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p>Edit chat name</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger>
											<img
												className="w-6 h-6 hover:cursor-pointer"
												src="manage-members.svg"
												onClick={handleManageMembersClick}
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p>Manage members</p>
										</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger>
											<img
												className="w-6 h-6 hover:cursor-pointer"
												src="add-members.svg"
												onClick={handleAddMembersClick}
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p>Add members</p>
										</TooltipContent>
									</Tooltip>
								</>
							)}
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
				<>
					<div className="flex-1  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl text-gray-400 text-center">
						Select or create a chat to display it here!
					</div>
				</>
			)}

			{/* MODALS */}

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

			{showEditChatModal && (
				<Modal
					modalTitle="Edit chat name"
					handleConfirmModal={handleConfirmEditChatName}
					setShowModal={setShowEditChatModal}
				>
					<>
						<div className="flex flex-col items-start justify-between gap-1 rounded-lg shadow-lg bg-slate-700 p-4 w-4/5">
							<label className="-mt-2 text-gray-300 w-full" htmlFor="chatName">
								Chat name
							</label>
							<input
								id="chatName"
								name="chatName"
								placeholder="New chat name..."
								defaultValue={chat?.name}
								className="text-gray-100 focus:outline-none autofill:shadow-inner autofill:bg-slate-600"
								type="text"
							/>
						</div>
					</>
				</Modal>
			)}

			{showManageMembersModal && (
				<Modal
					modalTitle="Manage members"
					handleConfirmModal={() => null}
					setShowModal={setShowManageMembersModal}
					onlyCloseButton
				>
					<>
						<div className="bg-gray-800 rounded-xl border  h-full max-h-[70vh] min-w-96 flex flex-col items-center justify-start p-2 overflow-y-auto custom-scroll">
							{chat?.members.map((membership, index) => (
								<ListItem chatMembership={membership} key={index} />
							))}
						</div>
					</>
				</Modal>
			)}
		</div>
	);
};

export default Chat;
