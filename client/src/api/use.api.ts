import { toast } from "sonner";
import { API_URLS, ContentTypeHeader, METHODS } from "../utils/consts";
import type { ChatType, ChatRequest, ApiResponse, AppUser } from "../utils/types";

export const createUser = async ({ username }: { username: string }): Promise<boolean> => {
	try {
		const rawRes = await fetch(API_URLS.USER, {
			method: METHODS.POST,
			headers: {
				...ContentTypeHeader,
			},
			body: JSON.stringify({ username }),
		});
		const res: ApiResponse<AppUser | null> = await rawRes.json();

		if (res.success && res.content) {
			toast.success("User successfully created");
		} else {
			toast.success("Logged in as '" + username + "'");
		}

		return true;
	} catch (e) {
		console.error((e as Error).message);
		toast.error("Something went wrong!");
		return false;
	}
};

export const createChat = async ({ chat }: { chat: ChatRequest }): Promise<ChatType | null> => {
	try {
		const rawRes = await fetch(API_URLS.CHAT, {
			method: METHODS.POST,
			headers: {
				...ContentTypeHeader,
			},
			body: JSON.stringify(chat),
		});
		const res: ApiResponse<ChatType | null> = await rawRes.json();

		if (res.success && res.content) {
			toast.success(res.message);
		} else {
			toast.error(res.message);
		}

		return res.content;
	} catch (e) {
		console.error((e as Error).message);
		toast.error("Something went wrong!");
		return null;
	}
};

export const getUserChats = async ({
	username,
}: {
	username: string;
}): Promise<ChatType[] | null> => {
	try {
		const rawRes = await fetch(API_URLS.CHAT + "/get-user-chats", {
			method: METHODS.POST,
			headers: {
				...ContentTypeHeader,
			},
			body: JSON.stringify({ username }),
		});
		const res: ApiResponse<ChatType[]> = await rawRes.json();

		if (res.success) {
			return res.content;
		} else {
			console.error(res.message);
			return null;
		}
	} catch (e) {
		console.error((e as Error).message);
		toast.error("Something went wrong!");
		return null;
	}
};

// export const updateTask = async ({
// 	accessToken,
// 	id,
// 	task,
// }: {
// 	accessToken: string;
// 	id: Id;
// 	task: TaskRequest;
// }): Promise<Task | null> => {
// 	try {
// 		const rawRes = await fetch(API_URLS.TASKS + id, {
// 			method: METHODS.PUT,
// 			headers: {
// 				...ContentTypeHeader,
// 				Authorization: "Bearer " + accessToken,
// 			},
// 			body: JSON.stringify(task),
// 		});
// 		const res: ApiResponse<Task | null> = await rawRes.json();
//
// 		if (res.success && res.content) {
// 			toast.success(res.message);
// 		} else {
// 			toast.error(res.message);
// 		}
//
// 		return res.content;
// 	} catch (e) {
// 		toast.error((e as Error).message);
// 		return null;
// 	}
// };
//
// export const deleteTask = async ({
// 	accessToken,
// 	id,
// }: {
// 	accessToken: string;
// 	id: Id;
// }): Promise<boolean> => {
// 	try {
// 		const rawRes = await fetch(API_URLS.TASKS + id, {
// 			method: METHODS.DELETE,
// 			headers: {
// 				...ContentTypeHeader,
// 				Authorization: "Bearer " + accessToken,
// 			},
// 		});
// 		const res: ApiResponse<null> = await rawRes.json();
//
// 		if (res.success) {
// 			toast.success(res.message);
// 		} else {
// 			toast.error(res.message);
// 		}
//
// 		return res.success;
// 	} catch (e) {
// 		toast.error((e as Error).message);
// 		return false;
// 	}
// };
//
// export const deleteAllTasks = async ({
// 	accessToken,
// }: {
// 	accessToken: string;
// }): Promise<boolean> => {
// 	try {
// 		const rawRes = await fetch(API_URLS.TASKS, {
// 			method: METHODS.DELETE,
// 			headers: {
// 				...ContentTypeHeader,
// 				Authorization: "Bearer " + accessToken,
// 			},
// 		});
// 		const res: ApiResponse<null> = await rawRes.json();
//
// 		if (res.success) {
// 			toast.success(res.message);
// 		} else {
// 			toast.error(res.message);
// 		}
//
// 		return res.success;
// 	} catch (e) {
// 		toast.error((e as Error).message);
// 		return false;
// 	}
// };
