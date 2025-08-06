import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ConfirmModal from "./ConfirmModal";
import type { ChatMembership, ExpelUserRequest, MessageRequest } from "@/utils/types";
import { useState } from "react";
import { useUsernameContext } from "@/context/useUsernameContext";
import { giveAdminToUser, removeMember, sendMessage } from "@/api/use.api";
import { useChatContext } from "@/context/useChatContext";
import { useSpinner } from "@/context/useSpinner";
import { expelUserFromChat } from "@/api/use.web-socket";

interface Props {
	chatMembership: ChatMembership;
}

const ListItem: React.FC<Props> = ({ chatMembership }) => {
	const { username } = useUsernameContext();
	const { activeChat, initializeUserChats, setSync } = useChatContext();
	const { showSpinner } = useSpinner();

	const onGiveAdminClick = async () => {
		chatMembership.isAdmin = true;

		showSpinner(true);

		const success = await giveAdminToUser({
			chatId: activeChat?.id!,
			username: chatMembership.user.username,
		});

		if (success) {
			await initializeUserChats({ username });
			showSpinner(false);
		} else {
			showSpinner(false);
			chatMembership.isAdmin = false;
		}
	};

	const onExpelClick = async () => {
		setShowMyself(false);

		showSpinner(true);

		console.log("Removing " + chatMembership.user.username + "...");

		const expelUserRequest: ExpelUserRequest = {
			username: chatMembership.user.username,
			adminUsername: username,
			chatId: activeChat?.id!,
		};

		expelUserFromChat({ expelUserRequest });

		showSpinner(false);
	};

	const [showMyself, setShowMyself] = useState(true);

	const isChatMembershipMine =
		username.toLowerCase() != chatMembership.user.username.toLowerCase();

	return (
		<>
			{showMyself ? (
				<div className="border-y border-slate-600 w-full p-2 text-lg flex gap-9 justify-between items-center -mb-[1px]">
					<div className="flex items-center gap-3 ">
						<img
							className="h-9 w-9"
							src={
								"https://ui-avatars.com/api/?name=" +
								chatMembership.user.username +
								"&background=random&rounded=true&size=40"
							}
						/>
						<div className="flex items-center justify-start gap-1 max-w-36">
							<span className="truncate max-w-32">
								{chatMembership.user.username}
							</span>
							{chatMembership.isAdmin && (
								<Tooltip>
									<TooltipTrigger className="flex justify-center items-center">
										<img
											src="admin.svg"
											className="w-5 min-w-5 aspect-square"
										/>
									</TooltipTrigger>
									<TooltipContent>
										<p>Admin</p>
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					</div>
					<div className="flex justify-end items-center gap-3 min-w-14">
						{!chatMembership.isAdmin && (
							<Tooltip>
								<ConfirmModal onConfirm={onGiveAdminClick}>
									<TooltipTrigger className="flex justify-center items-center">
										<img
											src="key.svg"
											className="hover:cursor-pointer w-5 h-5"
										/>
									</TooltipTrigger>
								</ConfirmModal>
								<TooltipContent>
									<p>Give admin</p>
								</TooltipContent>
							</Tooltip>
						)}

						{isChatMembershipMine && (
							<Tooltip>
								<ConfirmModal onConfirm={onExpelClick}>
									<TooltipTrigger className="flex justify-center items-center">
										<img
											src="expel.svg"
											className="hover:cursor-pointer w-6 h-6"
										/>
									</TooltipTrigger>
								</ConfirmModal>
								<TooltipContent>
									<p>Kick from chat</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
};

export default ListItem;
