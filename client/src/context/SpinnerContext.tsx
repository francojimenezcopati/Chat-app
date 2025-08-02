import { useState } from "react";
import { SpinnerContext } from "./useSpinner";

export const SpinnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [visible, setVisible] = useState(false);

	const showSpinner = (show: boolean) => {
		setVisible(show);
	};

	return (
		<SpinnerContext.Provider value={{ showSpinner }}>
			{children}
			{visible && (
				<div className="fixed left-0 top-0 w-screen h-screen z-[70] bg-slate-800/80 flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
				</div>
			)}
		</SpinnerContext.Provider>
	);
};

export default SpinnerContext;
