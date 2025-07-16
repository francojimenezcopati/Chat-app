const BASE_URL = `${import.meta.env.VITE_API_URL}` as const;
export const CONNECT_WEB_SOCKET_URL = `${import.meta.env.VITE_WEB_SOCKET_URL}` as const;

export const API_URLS = {
	CHAT: BASE_URL + "chat",
	MESSAGE: BASE_URL + "message",
	USER: BASE_URL + "user",
} as const;

export const ContentTypeHeader = { "Content-Type": "application/json" } as const;

export const METHODS = {
	POST: "POST",
	GET: "GET",
	PUT: "PUT",
	DELETE: "DELETE",
};
