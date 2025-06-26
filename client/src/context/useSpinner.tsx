import type { SpinnerContextType } from "@/utils/types";
import { createContext, useContext } from "react";

export const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const useSpinner = (): SpinnerContextType => {
	const context = useContext(SpinnerContext);
	if (!context) {
		throw new Error("useSpinner must be used within a AuthProvider");
	}
	return context;
};
