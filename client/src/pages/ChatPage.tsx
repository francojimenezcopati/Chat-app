import Chat from "./Chat";
import ChatList from "./ChatList";
import "./ChatPage.css";

const ChatPage = ({ username }: { username: string }) => {
	return (
		<div className="h-full w-full flex justify-center items-center">
			<div className="flex justify-center items-center h-[97%] w-11/12 gap-5 p-3">
				<ChatList />
				<Chat />
			</div>
		</div>
	);
};

export default ChatPage;
