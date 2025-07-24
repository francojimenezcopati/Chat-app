import { CONNECT_WEB_SOCKET_URL } from "@/utils/consts";
import type { MessageRequest, MessageWithImageUrlRequest } from "@/utils/types";
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

export const getStompClient = () => stompClient;
