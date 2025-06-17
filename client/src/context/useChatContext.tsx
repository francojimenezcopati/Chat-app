import { createContext, useContext } from "react";
import type { ChatContextType } from "../utils/types";

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = (): ChatContextType => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChatContext must be used within a AuthProvider");
	}
	return context;
};
