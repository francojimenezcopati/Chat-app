import { toast } from "sonner";
import { API_URLS, ContentTypeHeader, METHODS } from "../utils/consts";

export const createTask = async ({
	task,
} {
	task: TaskRequest;
}): Promise<Task | null> => {
try {
		const rawRes = await fetch(API_URLS.TASKS, {
			method: METHODS.POST,
			headers: {
				...ContentTypeHeader,
				Authorization: "Bearer " + accessToken,
			},
			body: JSON.stringify(task),
		});
		const res: ApiResponse<Task | null> = await rawRes.json();

		if (res.success && res.content) {
			toast.success(res.message);
		} else {
			toast.error(res.message);
		}

		return res.content;
	} catch (e) {
		toast.error((e as Error).message);
		return null;
	}
};

export const getTasks = async ({
	accessToken,
}: {
	accessToken: string;
}): Promise<Task[] | null> => {
	try {
		const rawRes = await fetch(API_URLS.TASKS, {
			method: METHODS.GET,
			headers: {
				...ContentTypeHeader,
				Authorization: "Bearer " + accessToken,
			},
		});
		const res: ApiResponse<Task[]> = await rawRes.json();

		if (res.success) {
			return res.content;
		} else {
			console.error(res.message);
			return null;
		}
	} catch (e) {
		console.error((e as Error).message);
		return null;
	}
};

export const updateTask = async ({
	accessToken,
	id,
	task,
}: {
	accessToken: string;
	id: Id;
	task: TaskRequest;
}): Promise<Task | null> => {
	try {
		const rawRes = await fetch(API_URLS.TASKS + id, {
			method: METHODS.PUT,
			headers: {
				...ContentTypeHeader,
				Authorization: "Bearer " + accessToken,
			},
			body: JSON.stringify(task),
		});
		const res: ApiResponse<Task | null> = await rawRes.json();

		if (res.success && res.content) {
			toast.success(res.message);
		} else {
			toast.error(res.message);
		}

		return res.content;
	} catch (e) {
		toast.error((e as Error).message);
		return null;
	}
};

export const deleteTask = async ({
	accessToken,
	id,
}: {
	accessToken: string;
	id: Id;
}): Promise<boolean> => {
	try {
		const rawRes = await fetch(API_URLS.TASKS + id, {
			method: METHODS.DELETE,
			headers: {
				...ContentTypeHeader,
				Authorization: "Bearer " + accessToken,
			},
		});
		const res: ApiResponse<null> = await rawRes.json();

		if (res.success) {
			toast.success(res.message);
		} else {
			toast.error(res.message);
		}

		return res.success;
	} catch (e) {
		toast.error((e as Error).message);
		return false;
	}
};

export const deleteAllTasks = async ({
	accessToken,
}: {
	accessToken: string;
}): Promise<boolean> => {
	try {
		const rawRes = await fetch(API_URLS.TASKS, {
			method: METHODS.DELETE,
			headers: {
				...ContentTypeHeader,
				Authorization: "Bearer " + accessToken,
			},
		});
		const res: ApiResponse<null> = await rawRes.json();

		if (res.success) {
			toast.success(res.message);
		} else {
			toast.error(res.message);
		}

		return res.success;
	} catch (e) {
		toast.error((e as Error).message);
		return false;
	}
};
