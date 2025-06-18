export interface MessageInterface {
	content: string;
	username: string;
	createdAt: Date;
}

export interface UsernameContextType {
	username: string;
	setUsername: (username: string) => void;
}

export interface ChatContextType {
	chats: ChatType[];
	setChats: (chats: ChatType[]) => void;
	activeChat: ChatType | null;
	setActiveChat: (chat: ChatType) => void;
	initializeUserChats: ({ username }: { username: string }) => Promise<void>;
}

interface AppUser {
	id?: number;
	username: string;
	createdAt: Date;
}

interface ChatMembership {
	user: AppUser;
	isAdmin: boolean;
}

export interface ChatType {
	id?: number;
	name: string;
	createdBy: AppUser;
	createdAt: Date;
	members: ChatMembership[];
	messages: MessageInterface[];
}

export interface ChatRequest {
	creator: string;
	membersNames: string[];
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	content: T;
	status: HttpStatusString;
}
