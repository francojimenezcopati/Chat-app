import { useEffect, useState, type ReactNode } from "react";
import { UsernameContext } from "./useUsernameContext";
import type { ApiResponse, AppUser, UsernameContextType } from "../utils/types";
import { subscribeToChannel } from "@/api/use.web-socket";
import { toast } from "sonner";

interface Props {
	children: ReactNode;
}

export const UsernameProvider: React.FC<Props> = ({ children }) => {
	const [username, setUsername] = useState<string>("");

	useEffect(() => {
		if (username) {
			subscribeToChannel(`/topic/users-list`, (wsResponse: ApiResponse<AppUser[]>) => {
				console.log("📩 Users list from username context:", wsResponse);

				if (wsResponse.success) {
					const users = wsResponse.content;

					console.log("Users", users);
				} else {
					toast.error("Something went wrong while retrieving the chats");
					console.error(wsResponse.message);
				}
			});
		}
	}, [username]);

	const contextData: UsernameContextType = {
		username,
		setUsername,
	};

	return <UsernameContext.Provider value={contextData}>{children}</UsernameContext.Provider>;
};

export default UsernameContext;
