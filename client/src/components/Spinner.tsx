import { useState } from "react";

const Spinner = () => {
	const [visibilityClassName, setVisibilityClassName] = useState<"hidden" | "block">("hidden");

	export const showSpinner = (show: boolean) => {
		setVisibilityClassName(show ? "block" : "hidden");
	};

	return (
		<div
			className={
				"fixed left-0 top-0 w-screen h-screen z-50 bg-slate-800/80" + visibilityClassName
			}
		>
			<div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
		</div>
	);
};

export default Spinner;
