import { createContext, useContext } from "react";
import type { UsernameContextType } from "../utils/types";

export const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

export const useUsernameContext = (): UsernameContextType => {
	const context = useContext(UsernameContext);
	if (!context) {
		throw new Error("useUsernameContext must be used within a AuthProvider");
	}
	return context;
};
