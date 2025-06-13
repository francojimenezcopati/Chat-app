import { useState, type ReactNode } from "react";
import { UsernameContext } from "./useUsernameContext";
import type { UsernameContextType } from "../utils/types";

interface Props {
	children: ReactNode;
}

export const UsernameProvider: React.FC<Props> = ({ children }) => {
	const [username, setUsername] = useState<string>("");

	const contextData: UsernameContextType = {
		username,
		setUsername,
	};

	return <UsernameContext.Provider value={contextData}>{children}</UsernameContext.Provider>;
};

export default UsernameContext;
