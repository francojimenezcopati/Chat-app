import type { ChatType, MessageRequest } from "../utils/types";
import ChatIcon from "./ChatIcon";

import {
	addUsersToChat,
	editChatName,
	getAllUsers,
	removeMember,
	sendMessage,
} from "@/api/use.api";
import { useUsernameContext } from "@/context/useUsernameContext";
import { useEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MultipleSelector, {
	type Option,
	type MultipleSelectorRef,
} from "@/components/ui/multiple-selector";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import Modal from "./Modal";
import { useChatContext } from "@/context/useChatContext";
import { useSpinner } from "@/context/useSpinner";
import ListItem from "./ListItem";
import ConfirmModal from "./ConfirmModal";
import ChatMessages from "./ChatMessages";

interface Props {
	chat: ChatType | null;
}

const Chat: React.FC<Props> = ({ chat }) => {
	const { initializeUserChats, sync, setSync, setActiveChat } = useChatContext();
	const { username } = useUsernameContext();
	const { showSpinner } = useSpinner();

	const [showManageMembersModal, setShowManageMembersModal] = useState(false);
	const [showMembersModal, setShowMembersModal] = useState(false);
	const [showEditChatModal, setShowEditChatModal] = useState(false);

	const [options, setOptions] = useState<Option[]>([]);
	const membersRef = useRef<MultipleSelectorRef>(null);

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
		}
	}, [chat]);

	const asyncUseEffect = async () => {
		showSpinner(true);

		await initializeUserChats({ username });

		showSpinner(false);
		setSync(false);
	};

	useEffect(() => {
		if (sync && !showManageMembersModal) {
			asyncUseEffect();
		}
	}, [sync, showManageMembersModal]);

	// Click en TRIGGERS de MODALES vvv

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

	// Click en Confirmar de MODALES vvv

	const handleConfirmExitChat = async () => {
		showSpinner(true);
		const success = await removeMember({ username, chatId: chat!.id! });
		if (success) {
			await initializeUserChats({ username });

			const generalMessage: MessageRequest = {
				username,
				content: `${username} left the group`,
				chatId: chat?.id!,
				type: "GENERAL",
			};

			await sendMessage({ message: generalMessage });

			setActiveChat(null);
		}
		showSpinner(false);
	};

	const handleConfirmEditChatName = async (e: React.FormEvent) => {
		e.preventDefault();
		const newChatName = (document.getElementById("chatName") as HTMLInputElement).value;

		showSpinner(true);

		console.log(newChatName);

		const success = await editChatName({ name: newChatName, chatId: chat!.id! });

		if (success) {
			await initializeUserChats({ username });
		}

		showSpinner(false);
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
			if (success) {
				const formattedContent = usernamesSelected.reduce(
					(prevValue, currentValue, index) => {
						if (index < usernamesSelected.length - 1) {
							return prevValue + ", " + currentValue;
						} else {
							return prevValue + " & " + currentValue;
						}
					},
				);

				const generalMessage: MessageRequest = {
					username,
					content: `${username} added ${formattedContent}`,
					chatId: chat?.id!,
					type: "GENERAL",
				};

				await sendMessage({ message: generalMessage });

				await initializeUserChats({ username });
			}
			showSpinner(false);
		} else {
			toast.error("Something went wrong!");
		}
		setShowMembersModal(false);
	};

	return (
		<div className="w-full sm:w-2/3 relative flex flex-col items-center justify-start bg-gradient-to-t from-[#292C35] via-80% via-[#363742] to-[#25262f]  h-full rounded-b-xl">
			{chat != null ? (
				<>
					{/* TOP BAR */}

					<div className="w-full flex justify-between items-center py-2 drop-shadow-xl drop-shadow-gray-700 shadow-sm shadow-gray-800/50">
						<div className="ml-3 mr-2 sm:hidden min-w-6">
							<Tooltip>
								<TooltipTrigger>
									<img
										className="w-9 h-9 hover:cursor-pointer"
										src="back-arrow.svg"
										onClick={() => console.log("go back")}
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>Go to chats</p>
								</TooltipContent>
							</Tooltip>
						</div>
						<div className="flex items-center gap-4 ml-3 ">
							<ChatIcon usernames={memberUsernames!} />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">{chat.name}</span>
								<span className="text-xs text-slate-400">
									{formattedMemberUsernames}
								</span>
							</div>
						</div>

						<div className="sm:hidden flex items-center justify-end mr-3 min-w-fit">
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger>Open</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										className="hover:cursor-pointer"
										onClick={handleEditChatNameClick}
									>
										<img
											className="w-6 h-6 hover:cursor-pointer"
											src="edit-chat.svg"
										/>
										Edit chat name
									</DropdownMenuItem>
									<DropdownMenuItem
										className="hover:cursor-pointer"
										onClick={handleManageMembersClick}
									>
										<img
											className="w-6 h-6 hover:cursor-pointer"
											src="manage-members.svg"
										/>
										Manage members
									</DropdownMenuItem>
									<DropdownMenuItem
										className="hover:cursor-pointer"
										onClick={handleAddMembersClick}
									>
										<img
											className="w-6 h-6 hover:cursor-pointer"
											src="add-members.svg"
										/>
										Add new members
									</DropdownMenuItem>
									<ConfirmModal onConfirm={handleConfirmExitChat}>
										<DropdownMenuItem
											className="hover:cursor-pointer"
											// onClick={(e) => {
											// 	e.stopPropagation();
											// }}
										>
											<img
												className="w-6 h-6 hover:cursor-pointer"
												src="exit-chat.svg"
											/>
											Exit chat
										</DropdownMenuItem>
									</ConfirmModal>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div className="hidden sm:flex items-center justify-end gap-3 mr-3 min-w-[140px]">
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
								<ConfirmModal onConfirm={handleConfirmExitChat}>
									<TooltipTrigger>
										<img
											className="w-6 h-6 hover:cursor-pointer"
											src="exit-chat.svg"
										/>
									</TooltipTrigger>
								</ConfirmModal>
								<TooltipContent>
									<p>Exit chat</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>

					<ChatMessages chat={chat} />
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
						<div className="bg-gray-800 rounded-xl border  h-full max-h-[70vh]  flex flex-col items-center justify-start p-2 overflow-y-auto custom-scroll">
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
