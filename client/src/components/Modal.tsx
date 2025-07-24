import { useRef } from "react";

interface Props {
	modalTitle: string;
	setShowModal: (value: React.SetStateAction<boolean>) => void;
	handleConfirmModal: (e: React.FormEvent) => void;
	cancelButtonText?: string;
	confirmButtonText?: string;
	onlyCloseButton?: boolean;
	children: React.ReactNode;
}

const Modal: React.FC<Props> = ({
	modalTitle,
	setShowModal,
	handleConfirmModal,
	cancelButtonText = "Cancel",
	confirmButtonText = "Confirm",
	onlyCloseButton = false,
	children,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
		const clickedNode = e.target as Node;

		if (!modalRef.current?.contains(clickedNode)) {
			const confirmModal = document.getElementById("confirmModal");
			if (confirmModal && confirmModal.contains(clickedNode)) {
				return;
			}

			setShowModal(false);
		}
	};

	return (
		<div
			className="fixed min-w-screen min-h-screen left-0 top-0 bg-slate-800/80 z-20 "
			onClick={(e) => handleClickOutside(e)}
		>
			<div
				ref={modalRef}
				className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100vh-6vh)] w-fit h-fit bg-gray-900 rounded-2xl p-5 ring ring-slate-600/40"
			>
				<div className="relative w-full h-full flex flex-col gap-5 items-center justify-center">
					<form method="POST" className="flex flex-col items-center justify-center gap-3">
						<span className="text-2xl text-center w-full my-3 text-wrap">
							{modalTitle}
						</span>
						{children}
						{!onlyCloseButton && (
							<div className="flex justify-center items-center gap-8 mt-2 ">
								<button
									className="p-2 hover:cursor-pointer 
								inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3"
									onClick={(e) => {
										e.preventDefault();
										setShowModal(false);
									}}
								>
									{cancelButtonText}
								</button>

								<button
									className="p-2 hover:cursor-pointer 
								inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3"
									onClick={(e) => handleConfirmModal(e)}
								>
									{confirmButtonText}
								</button>
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default Modal;
