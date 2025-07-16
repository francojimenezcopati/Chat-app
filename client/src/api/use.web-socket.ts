import { CONNECT_WEB_SOCKET_URL } from "@/utils/consts";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient: Stomp.Client;

export const connectWebSocket = (onConnected: () => void) => {
	const socket = new SockJS(CONNECT_WEB_SOCKET_URL);
	stompClient = Stomp.over(socket);

	stompClient.connect({}, () => {
		console.log("✅ WebSocket connected");
		onConnected();
	});
};

export const getStompClient = () => stompClient;
