interface Props {
	modalTitle: string;
	setShowModal: (value: React.SetStateAction<boolean>) => void;
	handleConfirmModal: (e: React.FormEvent) => void;
	cancelButtonText?: string;
	confirmButtonText?: string;
	children: React.ReactNode;
}

const Modal: React.FC<Props> = ({
	modalTitle,
	setShowModal,
	handleConfirmModal,
	cancelButtonText = "Cancel",
	confirmButtonText = "Confirm",
	children,
}) => {
	return (
		<div className="fixed w-screen h-screen left-0 top-0 bg-slate-800/80 z-40">
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit bg-gray-900 rounded-2xl p-5">
				<div className="relative w-full h-full flex flex-col gap-5 items-center justify-center">
					<form method="POST" className="flex flex-col items-center justify-center gap-3">
						<span className="text-2xl text-center w-full my-3 text-wrap">
							{modalTitle}
						</span>
						{children}
						<div className="flex justify-center items-center gap-8">
							<button
								className="bg-red-500 hover:bg-red-500/70 rounded-xl p-2 hover:cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									setShowModal(false);
								}}
							>
								{cancelButtonText}
							</button>

							<button
								className="bg-blue-500 hover:bg-blue-500/70 rounded-xl p-2 hover:cursor-pointer"
								onClick={(e) => handleConfirmModal(e)}
							>
								{confirmButtonText}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Modal;
