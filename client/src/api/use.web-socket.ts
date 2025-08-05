import { CONNECT_WEB_SOCKET_URL } from "@/utils/consts";
import type { AddMembersRequest, MessageRequest, MessageWithImageUrlRequest } from "@/utils/types";
import { Client } from "@stomp/stompjs";

let stompClient: Client;

export const connectWebSocket = (onConnected: () => void) => {
	console.log("trying to connect...");
	if (stompClient == undefined) {
		stompClient = new Client({
			brokerURL: CONNECT_WEB_SOCKET_URL,
			onConnect: () => {
				console.log("✅ WebSocket connected");
				onConnected();
			},
			reconnectDelay: 0,
		});

		stompClient.activate();
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

export const getUserChats = ({ username }: { username: string }) => {
	stompClient.publish({
		destination: "/app/chat/get-user-chats",
		body: JSON.stringify({ username }),
	});
};

export const getStompClient = () => stompClient;
