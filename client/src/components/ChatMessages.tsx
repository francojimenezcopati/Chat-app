import type {
	ChatType,
	GroupedMessages,
	MessageInterface,
	MessageRequest,
	MessageWithImage64Request,
	MessageWithImageUrlRequest,
} from "../utils/types";
import Message from "../components/Message";

import { useUsernameContext } from "@/context/useUsernameContext";
import { useEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { sendMessage, sendMessageWithAnImage, uploadMessageImage } from "@/api/use.api";
import React from "react";
import { getStompClient, sendMessageViaWS, sendMessageWithImageUrl } from "@/api/use.web-socket";
import { useSpinner } from "@/context/useSpinner";

interface Props {
	chat: ChatType | null;
}

const ChatMessages: React.FC<Props> = ({ chat }) => {
	const { username } = useUsernameContext();
	const { showSpinner } = useSpinner();

	const [groupedMessages, setGroupedMessages] = useState<GroupedMessages[] | undefined>(
		chat ? groupMessagesByDate(chat.messages) : [],
	);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (chat) {
			setGroupedMessages(groupMessagesByDate(chat.messages));
		}
	}, [chat]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
	}, [groupedMessages]);

	const [previousActiveChat, setPreviousActiveChat] = useState<ChatType | null>(null);
	useEffect(() => {
		if (chat != null && chat != previousActiveChat) {
			showImagePreview(false);
			// console.log("CAMBIO el CHAT");
			// console.log("Estado previo: ", previousActiveChat);
			// console.log("Estado actual: ", chat);
			setPreviousActiveChat(chat);
		}
	}, [chat]);

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

	const sendMessage = () => {
		const messageElement = document.getElementById("message") as HTMLInputElement;
		const messageContent = messageElement.value;

		const message: MessageRequest = {
			username,
			content: messageContent,
			chatId: chat?.id!,
			type: "PERSONAL",
		};

		const imageFile = retrieveImageFile();
		if (imageFile != null) {
			console.log("with image via ws");
			messageElement.value = "";
			sendMessageWithImage({ imageFile, message });
			return;
		}

		if (messageContent == "") return;
		messageElement.value = "";

		console.log("sending message via ws...");

		sendMessageViaWS({ message });
	};

	const sendMessageWithImage = async ({
		imageFile,
		message,
	}: {
		imageFile: File;
		message: MessageRequest;
	}) => {
		showSpinner(true);
		const imageUrl = await uploadMessageImage({ imageFile });
		showSpinner(false);

		if (imageUrl) {
			const messageWithImageUrl: MessageWithImageUrlRequest = {
				...message,
				imageUrl,
			};

			sendMessageWithImageUrl({ messageWithImageUrl });
		}

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
		console.log("image change");
		const imageFile = retrieveImageFile();
		if (imageFile == null) return;
		console.log(imageFile.name);

		const imgPreviewElement = document.getElementById("imgPreview") as HTMLImageElement;
		imgPreviewElement.src = URL.createObjectURL(imageFile);
		console.log(imgPreviewElement.src);

		showImagePreview(true);
	};

	const showImagePreview = (show: boolean) => {
		const imgPreviewDiv = document.getElementById("imgPreviewDiv") as HTMLDivElement;
		if (show) {
			imgPreviewDiv.classList.remove("hidden");
		} else {
			const imageInput = document.getElementById("imageFile") as HTMLInputElement;
			imageInput.value = "";
			imageInput.src = "nothing";

			imgPreviewDiv.classList.add("hidden");
		}
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<>
			{/* CAJA MENSAJES */}

			<div className="flex flex-col w-full h-full p-5 gap-5 overflow-y-auto  custom-scroll">
				{groupedMessages !== undefined &&
					groupedMessages.map((group, i) => (
						<React.Fragment key={i}>
							<div className="flex justify-center w-full h-fit">
								<div className="bg-gray-600 text-white max-w-8/12 text-center flex justify-center items-center px-2 py-1 rounded-sm ">
									<p className="text-center">{group.date}</p>
								</div>
							</div>

							<>
								{group.messages.map((message, index) => (
									<Message key={index} message={message} />
								))}
							</>
						</React.Fragment>
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
							onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
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
						onClick={() => sendMessage()}
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
