import { useState, type ReactNode } from "react";
import { UsernameContext } from "./useUsernameContext";
import type { UsernameContextType } from "../utils/types";
import { getStompClient } from "@/api/use.web-socket";

interface Props {
	children: ReactNode;
}

export const UsernameProvider: React.FC<Props> = ({ children }) => {
	const [username, setUsername] = useState<string>("");

	const client = getStompClient();

	if (client && client.active) {
		console.log("----- ACTIVE DETECTED from USERNAME CONTEZXT -------");
	}

	const contextData: UsernameContextType = {
		username,
		setUsername,
	};

	return <UsernameContext.Provider value={contextData}>{children}</UsernameContext.Provider>;
};

export default UsernameContext;
