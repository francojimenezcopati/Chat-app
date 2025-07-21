import { CONNECT_WEB_SOCKET_URL } from "@/utils/consts";
import { Client } from "@stomp/stompjs";

let stompClient: Client;

export const connectWebSocket = (onConnected: () => void) => {
	console.log("trying to connect...");
	stompClient = new Client({
		brokerURL: CONNECT_WEB_SOCKET_URL,
		onConnect: () => {
			console.log("✅ WebSocket connected");
			onConnected();
		},
		reconnectDelay: 0,
	});

	stompClient.activate();

	// const socket = new SockJS("ws://localhost:8080/ws");
	// stompClient = Stomp.overWS("ws://localhost:8080/ws");

	// const socket = new SockJS("http://localhost:8080/ws");
	// stompClient = Stomp.over(socket);
	//
	// stompClient.connect(
	// 	{},
	// 	() => {
	// 		console.log("✅ WebSocket connected");
	// 		onConnected();
	// 	},
	// );

	// const socket = new WebSocket("http://localhost:8080/ws");
	// socket.onopen = () => {
	// 	console.log("✅ WebSocket connected");
	// 	onConnected();
	// };
};

export const getStompClient = () => stompClient;
