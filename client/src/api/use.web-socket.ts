import { CONNECT_WEB_SOCKET_URL } from "@/utils/consts";
import type {
	AddMembersRequest,
	ExpelUserRequest,
	MessageRequest,
	MessageWithImageUrlRequest,
} from "@/utils/types";
import { Client } from "@stomp/stompjs";

interface PendingSubscription {
	destination: string;
	callback: (wsResponse: any) => void;
}

let stompClient: Client;

const pendingSubscriptions: PendingSubscription[] = [];

export const getStompClient = () => stompClient;

export const connectWebSocket = (onConnected: () => void) => {
	console.log("trying to connect...");
	if (stompClient == undefined) {
		stompClient = new Client({
			brokerURL: CONNECT_WEB_SOCKET_URL,
			reconnectDelay: 0,
			onConnect: () => {
				console.log("✅ WebSocket connected");

				pendingSubscriptions.forEach(({ destination, callback }) => {
					subscribeToChannel(destination, callback);
				});
				pendingSubscriptions.length = 0;

				onConnected();
			},
		});

		stompClient.activate();
	}
};

export const subscribeToChannel = (destination: string, callback: (wsResponse: any) => void) => {
	if (stompClient && stompClient.connected) {
		// Si ya está conectado, nos suscribimos de una
		stompClient.subscribe(destination, (frame) => callback(JSON.parse(frame.body)));
	} else {
		// Si todavía no está conectado, lo guardamos para después
		pendingSubscriptions.push({ destination, callback });
	}
};

export const disconnectWebSocket = () => {
	if (stompClient && stompClient.connected) {
		stompClient.deactivate();
		console.log("🔌 WebSocket disconnected");
	}
};

export const sendMessageViaWS = ({ message }: { message: MessageRequest }) => {
	stompClient.publish({
		destination: "/app/chat/send-message",
		body: JSON.stringify(message),
	});
};

export const sendMessageWithImageUrl = ({
	messageWithImageUrl,
}: {
	messageWithImageUrl: MessageWithImageUrlRequest;
}) => {
	stompClient.publish({
		destination: "/app/chat/send-message/with-image",
		body: JSON.stringify(messageWithImageUrl),
	});
};

export const addMembersToChat = ({
	addMembersRequest,
}: {
	addMembersRequest: AddMembersRequest;
}) => {
	stompClient.publish({
		destination: "/app/chat/add-users",
		body: JSON.stringify(addMembersRequest),
	});
};

export const expelUserFromChat = ({ expelUserRequest }: { expelUserRequest: ExpelUserRequest }) => {
	stompClient.publish({
		destination: "/app/chat/expel-user",
		body: JSON.stringify(expelUserRequest),
	});
};

export const getUserChatsViaWS = ({ username }: { username: string }) => {
	stompClient.publish({
		destination: "/app/chat/get-user-chats",
		body: JSON.stringify({ username }),
	});
};

export const getAllUsersViaWS = () => {
	stompClient.publish({
		destination: "/app/user/get-all",
	});
};
