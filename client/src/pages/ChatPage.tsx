import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import type { ChatType, MessageInterface } from "../utils/types";
import "./ChatPage.css";
import { useChatContext } from "../context/useChatContext";
import { useSpinner } from "@/context/useSpinner";

interface Props {
	username: string;
}

const ChatPage: React.FC<Props> = ({ username }) => {
	const { initializeUserChats, activeChat, chats } = useChatContext();
	const { showSpinner } = useSpinner();

	// Para ver si se usa en pantallas chicas vvvvvvv
	const [isWideScreen, setIsWideScreen] = useState<boolean>(window.innerWidth > 640);

	useEffect(() => {
		const handleResize = () => {
			setIsWideScreen(window.innerWidth > 640);
		};

		window.addEventListener("resize", handleResize);

		// Limpieza del event listener al desmontar el componente
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const asyncUseEffectFn = async () => {
		showSpinner(true);
		await initializeUserChats({ username });
		showSpinner(false);
	};

	useEffect(() => {
		asyncUseEffectFn();
	}, []);

	return (
		<div className="h-full w-full flex justify-center items-center">
			<div className="flex justify-center items-center h-[97%] w-11/12 gap-5 p-3">
				{isWideScreen ? (
					<>
						<ChatList chats={chats} />
						<Chat chat={activeChat} />
					</>
				) : (
					<>{activeChat ? <Chat chat={activeChat} /> : <ChatList chats={chats} />}</>
				)}
			</div>
		</div>
	);
};

export default ChatPage;
