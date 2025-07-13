import { toast } from "sonner";
import { API_URLS, ContentTypeHeader, METHODS } from "../utils/consts";
import type {
	ChatType,
	ChatRequest,
	ApiResponse,
	AppUser,
	MessageRequest,
	MessageInterface,
	AddMembersRequest,
	MakeAdminRequest,
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

export const sendMessage = async ({
	message,
}: {
	message: MessageRequest;
}): Promise<MessageInterface | null> => {
	try {
		const rawRes = await fetch(API_URLS.MESSAGE, {
			method: METHODS.POST,
			headers: {
				...ContentTypeHeader,
			},
			body: JSON.stringify(message),
		});
		const res: ApiResponse<MessageInterface | null> = await rawRes.json();

		if (res.success && res.content) {
			console.log(res.message);
		} else {
			console.error(res.message);
			toast.error("Something went wrong whit the message!");
		}

		return res.content;
	} catch (e) {
		console.error((e as Error).message);
		toast.error("Something went wrong whit the message!");
		return null;
	}
};

export const addUsersToChat = async ({
	usernames,
	chatId,
}: AddMembersRequest): Promise<boolean> => {
	try {
		const rawRes = await fetch(API_URLS.CHAT + `/${chatId}/add-users`, {
			method: METHODS.PUT,
			headers: {
				...ContentTypeHeader,
			},
			body: JSON.stringify({ usernames }),
		});
		const res: ApiResponse<null> = await rawRes.json();

		if (res.success) {
			toast.success(res.message);
		} else {
			console.error(res.message);
			toast.error("Something went wrong!");
		}

		return res.success;
	} catch (e) {
		console.error((e as Error).message);
		toast.error("Something went wrong!");
		return false;
	}
};

export const giveAdminToUser = async ({ username, chatId }: MakeAdminRequest): Promise<boolean> => {
	try {
		const rawRes = await fetch(API_URLS.CHAT + `/${chatId}/give-admin`, {
			method: METHODS.PUT,
			headers: {
				...ContentTypeHeader,
			},
			body: JSON.stringify({ username }),
		});
		const res: ApiResponse<null> = await rawRes.json();

		if (res.success) {
			toast.success(res.message);
		} else {
			console.error(res.message);
			toast.error("Something went wrong!");
		}

		return res.success;
	} catch (e) {
		console.error((e as Error).message);
		toast.error("Something went wrong!");
		return false;
	}
};

export const removeMember = async ({ username, chatId }: MakeAdminRequest): Promise<boolean> => {
	try {
		const rawRes = await fetch(API_URLS.CHAT + `/${chatId}/remove-member`, {
			method: METHODS.DELETE,
			headers: {
				...ContentTypeHeader,
			},
			body: JSON.stringify({ username }),
		});
		const res: ApiResponse<null> = await rawRes.json();

		if (res.success) {
			toast.success("Action completed");
		} else {
			console.error(res.message);
			toast.error("Something went wrong!");
		}

		return res.success;
	} catch (e) {
		console.error((e as Error).message);
		toast.error("Something went wrong!");
		return false;
	}
};

export const editChatName = async ({ name, chatId }: EditChatNameRequest): Promise<boolean> => {
	try {
		const rawRes = await fetch(API_URLS.CHAT + `/${chatId}/edit-name`, {
			method: METHODS.PUT,
			headers: {
				...ContentTypeHeader,
			},
			body: JSON.stringify({ name }),
		});
		const res: ApiResponse<null> = await rawRes.json();

		if (res.success) {
			toast.success(res.message);
		} else {
			console.error(res.message);
			toast.error("Something went wrong!");
		}

		return res.success;
	} catch (e) {
		console.error((e as Error).message);
		toast.error("Something went wrong!");
		return false;
	}
};

export const sendMessageWithAnImage = async ({
	message,
	imageFile,
}: {
	message: MessageRequest;
	imageFile: File;
}): Promise<MessageInterface | null> => {
	const multipartFormData = new FormData();
	multipartFormData.append("imageFile", imageFile);
	multipartFormData.append(
		"message",
		new Blob([JSON.stringify(message)], { type: "application/json" }),
	);

	try {
		const rawRes = await fetch(API_URLS.MESSAGE + "/with-image", {
			method: METHODS.POST,
			body: multipartFormData,
		});
		const res: ApiResponse<MessageInterface | null> = await rawRes.json();

		if (res.success && res.content) {
			console.log(res.message);
		} else {
			console.error(res.message);
			toast.error("Something went wrong whit the message!");
		}

		return res.content;
	} catch (e) {
		console.error((e as Error).message);
		console.error(e);
		toast.error("Something went wrong whit the message!");
		return null;
	}
};
