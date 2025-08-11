import { toast } from "sonner";
import { API_URLS, ContentTypeHeader, METHODS } from "../utils/consts";
import type {
	ChatType,
	ChatRequest,
	ApiResponse,
	AppUser,
	EditChatNameRequest,
} from "../utils/types";

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
			console.error(res.message);
			toast.error("Something went wrong!");
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

export const getAllUsers = async (): Promise<AppUser[] | null> => {
	try {
		const rawRes = await fetch(API_URLS.USER);
		const res: ApiResponse<AppUser[]> = await rawRes.json();

		if (res.success) {
			return res.content.sort((a, b) => {
				const aLower = a.username.toLowerCase();
				const bLower = b.username.toLowerCase();

				if (aLower < bLower) return -1;
				if (aLower > bLower) return 1;
				return 0;
			});
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

export const uploadMessageImage = async ({
	imageFile,
}: {
	imageFile: File;
}): Promise<string | null> => {
	try {
		const multipartFormData = new FormData();
		multipartFormData.append("imageFile", imageFile);

		const rawRes = await fetch(API_URLS.MESSAGE + "/upload-image", {
			method: METHODS.POST,
			body: multipartFormData,
		});
		const res: ApiResponse<string | null> = await rawRes.json();

		if (res.success && res.content) {
			console.log(res.message);
		} else {
			console.error(res.message);
			toast.error("Something went wrong whit the message image!");
		}

		return res.content;
	} catch (e) {
		console.error((e as Error).message);
		toast.error("Something went wrong whit the message image!");
		return null;
	}
};
