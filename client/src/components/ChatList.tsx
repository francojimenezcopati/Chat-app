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
import Modal from "./Modal";
import { useSpinner } from "@/context/useSpinner";
import { connectWebSocket, getStompClient } from "@/api/use.web-socket";

interface Props {
	chats: ChatType[];
}

const ChatList: React.FC<Props> = ({ chats }) => {
	const { username } = useUsernameContext();
	const { initializeUserChats } = useChatContext();
	const { showSpinner } = useSpinner();

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

		if (usernamesSelected !== undefined) {
			const chat: ChatRequest = {
				name: chatName,
				creator: username,
				membersNames: usernamesSelected,
			};

			showSpinner(true);

			const res = await createChat({ chat });
			if (res !== null) {
				initializeUserChats({ username });
			}

			showSpinner(false);
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
					chats.map((chat) => <ChatPreview key={chat.id!} chat={chat} />)
				) : (
					<div className="flex items-center justify-center text-gray-400 text-center">
						Create a new chat to begin!
					</div>
				)}
			</div>

			{showModal && (
				<Modal
					modalTitle="Create chat"
					handleConfirmModal={handleSubmit}
					setShowModal={setShowModal}
				>
					<>
						<div className="flex flex-col items-start justify-between gap-1 rounded-lg shadow-lg bg-slate-700 p-4">
							<label className="-mt-2 text-gray-300 w-full" htmlFor="chatName">
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
										{options.length < 1 ? "Loading..." : "Not users found"}
									</p>
								}
							/>
						</div>
					</>
				</Modal>
			)}
		</div>
	);
};

export default ChatList;
