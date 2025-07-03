import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ConfirmModal from "./ConfirmModal";
import type { ChatMembership, ChatType } from "@/utils/types";
import { useState } from "react";
import { useUsernameContext } from "@/context/useUsernameContext";

interface Props {
	chatMembership: ChatMembership;
}

const ListItem: React.FC<Props> = ({ chatMembership }) => {
	const { username } = useUsernameContext();

	const onGiveAdminClick = () => {
		console.log("give admin to " + chatMembership.user.username);
	};

	const onExpelClick = () => {
		console.log("Kick from chat: " + chatMembership.user.username);

		setShowMyself(false);
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
						<div className="flex items-center justify-start gap-1">
							{chatMembership.user.username}
							{chatMembership.isAdmin && (
								<Tooltip>
									<TooltipTrigger className="flex justify-center items-center">
										<img src="admin.svg" className="w-5 h-5" />
									</TooltipTrigger>
									<TooltipContent>
										<p>Admin</p>
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					</div>
					<div className="flex justify-end items-center gap-3">
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
