const ChatPage = ({ username }: { username: string }) => {
	return (
		<div className="h-full w-full flex justify-center items-center">
			<div className="flex justify-center items-center h-[97%] w-11/12 gap-5 p-3">
				{/* Parte de la IZQUIERDA*/}

				<div className="flex flex-col items-center justify-start gap-10  w-1/3 h-full rounded-xl">
					<div className="w-full flex justify-between items-center">
						<span className="text-2xl text-slate-100">Chats</span>
						<img className="w-6 h-6 hover:cursor-pointer" src="create-chat.svg" />
					</div>
					<div className="flex flex-col items-center justify-start gap-3 h-full w-full overflow-y-scroll">
						<div className="flex justify-start items-center gap-4 rounded-3xl bg-blue-500 w-full h-fit p-4 ">
							<img src="sdkfjlas" />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">Los de la nasa</span>
								<span className="text-sm text-gray-400">Fua para loco</span>
							</div>
						</div>
						<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
							<img src="sdkfjlas" />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">Otro grupo</span>
								<span className="text-sm text-gray-400">Another message</span>
							</div>
						</div>
						<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
							<img src="sdkfjlas" />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">Otro grupo</span>
								<span className="text-sm text-gray-400">Another message</span>
							</div>
						</div>
						<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
							<img src="sdkfjlas" />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">Otro grupo</span>
								<span className="text-sm text-gray-400">Another message</span>
							</div>
						</div>
						<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
							<img src="sdkfjlas" />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">Otro grupo</span>
								<span className="text-sm text-gray-400">Another message</span>
							</div>
						</div>
						<div className="flex justify-start items-center gap-4 rounded-3xl bg-slate-700 w-full h-fit p-4 hover:cursor-pointer">
							<img src="sdkfjlas" />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">Otro grupo</span>
								<span className="text-sm text-gray-400">Another message</span>
							</div>
						</div>
					</div>
				</div>

				{/* Parte de la DERECHA */}

				<div className="flex flex-col items-center justify-start gradient-mask bg-gradient-to-t from-[#292C35] via-80% via-[#363742] to-[#25262f] w-2/3 h-full rounded-b-xl">
					<div className="w-full flex justify-between items-center">
						<div className="flex items-center gap-5 ml-3">
							<img src="sdlakfjdklsjf" />
							<div className="flex flex-col justify-center items-start ">
								<span className="text-lg text-slate-100">Los de la nasa</span>
								<span className="text-xs text-slate-400">
									Fran, chali, insa, ...
								</span>
							</div>
						</div>
						<div className="flex items-center justify-end gap-3 mr-3">
							<img className="w-6 h-6 hover:cursor-pointer" src="edit-chat.svg" />
							<img className="w-6 h-6 hover:cursor-pointer" src="add-members.svg" />
							<img className="w-6 h-6 hover:cursor-pointer" src="exit-chat.svg" />
						</div>
					</div>
					<div className="flex flex-col w-full h-full p-10 gap-5">
						<div className=" flex justify-end w-full h-fit">
							<div className="bg-blue-700 text-white flex flex-col p-2 rounded-2xl rounded-br-none">
								<p className="">Hola este es mi mensaje de texto</p>
							</div>
						</div>
						<div className="flex justify-start w-full h-fit">
							<div className="bg-gray-700 text-white flex flex-col p-2 rounded-2xl ">
								<span className="text-purple-400">chali</span>
								<p className="">
									asdklfjsdl kadsjfasdjfaskldf jldksf kasdjf lakdsf
									jalskdfjalsdkfjasdklfjadls kfjadskfjaskl f jals
									kdfjaldksfjasldkf asdlkf jasdlkfjas lkfasd jsd{" "}
								</p>
							</div>
						</div>
						<div className=" flex justify-end w-full h-fit">
							<div className="bg-blue-700 text-white flex flex-col p-2 rounded-2xl rounded-br-none">
								<p className="">Fua para loco</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
