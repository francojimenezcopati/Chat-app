import type { ChatType, GroupedMessages, MessageInterface, MessageRequest } from "../utils/types";
import Message from "../components/Message";

import { useUsernameContext } from "@/context/useUsernameContext";
import { useEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { sendMessage } from "@/api/use.api";

interface Props {
	chat: ChatType | null;
}

const ChatMessages: React.FC<Props> = ({ chat }) => {
	const { username } = useUsernameContext();

	const [groupedMessages, setGroupedMessages] = useState<GroupedMessages[] | undefined>(
		chat ? groupMessagesByDate(chat.messages) : [],
	);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (chat) {
			setGroupedMessages(groupMessagesByDate(chat.messages));
			console.log(groupedMessages);
		}
	}, [chat]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [groupedMessages]);

	function groupMessagesByDate(messages: MessageInterface[]) {
		const grouped: GroupedMessages[] = [];

		messages.forEach((message) => {
			const messageDate = new Date(message.createdAt);
			const formattedDate = getFormattedDate(messageDate);

			// Busca si ya existe un grupo con la misma fecha
			const group = grouped.find((g) => g.date === formattedDate);
			if (group) {
				group.messages.push(message);
			} else {
				grouped.push({ date: formattedDate, messages: [message] });
			}
		});

		const groupedMessages = grouped;

		return groupedMessages;
	}

	function getFormattedDate(date: Date): string {
		const today = new Date();
		const yesterday = new Date();
		const twoDaysAgo = new Date();

		yesterday.setDate(today.getDate() - 1);
		twoDaysAgo.setDate(today.getDate() - 2);

		// Comparar solo día, mes, y año (ignorando la hora)
		if (isSameDay(date, today)) {
			return "Hoy";
		} else if (isSameDay(date, yesterday)) {
			return "Ayer";
		} else if (isSameDay(date, twoDaysAgo)) {
			return "Anteayer";
		} else if (date.getFullYear() === today.getFullYear()) {
			return formatDateWithoutYear(date);
		} else {
			return formatDateWithYear(date);
		}
	}

	function isSameDay(date1: Date, date2: Date): boolean {
		return (
			date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear()
		);
	}

	function formatDateWithoutYear(date: Date): string {
		const months = [
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre",
		];
		return `${date.getDate()} de ${months[date.getMonth()]}`;
	}

	function formatDateWithYear(date: Date): string {
		const months = [
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre",
		];
		return `${date.getDate()} de ${months[date.getMonth()]} del ${date.getFullYear()}`;
	}

	const onSendMessage = async () => {
		const imageFile = retrieveImageFile();

		if (imageFile != null) {
			sendMessageWithImage({ imageFile });
		}

		const messageElement = document.getElementById("message") as HTMLInputElement;
		const messageContent = messageElement.value;
		if (messageContent == "") return;
		messageElement.value = "";

		const message: MessageRequest = {
			username,
			content: messageContent,
			chatId: chat?.id!,
			type: "PERSONAL",
		};

		const provisionalMessage: MessageInterface = {
			fake: true,
			content: messageContent,
			username,
			createdAt: new Date().toString(),
			type: "PERSONAL",
		};

		setGroupedMessages((prevState) =>
			prevState!.map((group) => ({
				...group,
				messages:
					group.date === getFormattedDate(new Date())
						? [...group.messages, provisionalMessage]
						: group.messages,
			})),
		);

		const messageDTO = await sendMessage({ message });

		if (messageDTO != null) {
			setGroupedMessages((prevState) => {
				return prevState!.map((group) => {
					if (group.date === getFormattedDate(new Date())) {
						const todayMessages: MessageInterface[] = group.messages;

						const provisionalMessageIndex = todayMessages.findIndex(
							(msg) => msg.content == messageContent && msg.fake == true,
						);

						const updatedMessages = [
							...todayMessages.slice(0, provisionalMessageIndex),
							messageDTO,
							...todayMessages.slice(provisionalMessageIndex + 1),
						];

						return { ...group, messages: updatedMessages };
					}
					return group;
				});
			});
			chat?.messages.push(messageDTO);
		} else {
			setGroupedMessages((prevState) =>
				prevState!.map((group) => {
					if (group.date === getFormattedDate(new Date())) {
						const todayMessages: MessageInterface[] = group.messages;

						const rollBackMessages = todayMessages.filter(
							(msg) => msg.content != messageContent || msg.fake != true,
						);
						return {
							...group,
							messages: rollBackMessages,
						};
					}
					return group;
				}),
			);
		}
	};

	const sendMessageWithImage = async ({ imageFile }: { imageFile: File }) => {
		const messageElement = document.getElementById("message") as HTMLInputElement;
		const messageContent = messageElement.value;
		console.log(messageContent);
		console.log("send with image: " + imageFile.name);

		messageElement.value = "";
		showImagePreview(false);
	};

	const retrieveImageFile = (): File | null => {
		const imageInput = document.getElementById("imageFile") as HTMLInputElement;
		if (!imageInput.files || imageInput.files?.length === 0) {
			showImagePreview(false);
			return null;
		}

		const imageFile = imageInput.files[0];
		if (!imageFile.type.startsWith("image")) return null;

		return imageFile;
	};

	const onImageChange = () => {
		const imageFile = retrieveImageFile();
		if (imageFile == null) return;

		const imgPreviewElement = document.getElementById("imgPreview") as HTMLImageElement;
		imgPreviewElement.src = URL.createObjectURL(imageFile);

		showImagePreview(true);
	};

	const showImagePreview = (show: boolean) => {
		const imgPreviewDiv = document.getElementById("imgPreviewDiv") as HTMLDivElement;
		if (show) {
			imgPreviewDiv.className = imgPreviewDiv.className.replace("hidden", "");
		} else {
			const imageInput = document.getElementById("imageFile") as HTMLInputElement;
			imageInput.value = "";
			imageInput.src = "nothing";

			imgPreviewDiv.className = imgPreviewDiv.className + " hidden";
		}
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<>
			{/* CAJA MENSAJES */}

			<div className="flex flex-col w-full h-full p-5 gap-5 overflow-y-auto  custom-scroll">
				{groupedMessages !== undefined &&
					groupedMessages.map((group, index) => (
						<>
							<div className="flex justify-center w-full h-fit" key={index}>
								<div className="bg-gray-600 text-white max-w-8/12 text-center flex justify-center items-center px-2 py-1 rounded-sm ">
									<p className="text-center">{group.date}</p>
								</div>
							</div>

							<>
								{group.messages.map((message, index) => (
									<Message key={index} message={message} />
								))}
							</>
						</>
					))}
				<div ref={messagesEndRef} />
			</div>

			{/* INPUT */}

			<div className="flex flex-col items-center justify-center w-full h-fit">
				{/* Image Preview */}

				<div
					id="imgPreviewDiv"
					className="hidden w-full h-72 p-6 flex justify-center items-center border-t border-slate-700"
				>
					<div className="w-full h-full flex justify-center items-center border border-slate-500 rounded-xl p-2">
						<img className="max-w-full max-h-full" src="nothing" id="imgPreview" />
					</div>
				</div>

				<div className="flex items-center w-full h-fit px-7 pb-6 gap-2">
					<div
						className="w-11/12 h-10 rounded-lg flex items-center justify-between p-2 gap-2 
							focus-within:outline-2
							focus-within:outline-blue-400
							outline-1
							outline-blue-300
							shadow-xs
							shadow-blue-300
							"
					>
						<input
							className="flex-1 w-full p-1 rounded focus:outline-none text-lg text-wrap h-fit "
							id="message"
							type="text"
							placeholder="Message..."
							maxLength={200}
							onKeyDown={(e) => (e.key === "Enter" ? onSendMessage() : null)}
						/>

						<label
							className="relative text-gray-700 font-semibold flex justify-center items-center"
							htmlFor="imageFile"
						>
							<Tooltip>
								<TooltipTrigger asChild>
									<img
										className="w-6 h-6 hover:cursor-pointer"
										src="attach-image.svg"
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>Attach image</p>
								</TooltipContent>
							</Tooltip>
						</label>
						<input
							id="imageFile"
							type="file"
							accept="image/*"
							name="imageFile"
							className="absolute -z-20"
							onChange={onImageChange}
						/>
					</div>
					<button
						onClick={() => onSendMessage()}
						className={
							"bg-blue-400 hover:bg-blue-400/80 w-10 h-10 rounded-lg text-3xl hover:cursor-pointer flex items-center justify-center"
						}
					>
						<img className="h-6 w-6" src="send.svg" />
					</button>
				</div>
			</div>
		</>
	);
};

export default ChatMessages;
