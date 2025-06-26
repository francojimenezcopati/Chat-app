export interface MessageInterface {
	content: string;
	username: string;
	createdAt: Date;
}

export interface MessageRequest {
	content: string;
	username: string;
	chatId: number;
}

export interface UsernameContextType {
	username: string;
	setUsername: (username: string) => void;
}

export interface ChatContextType {
	chats: ChatType[];
	setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
	activeChat: ChatType | null;
	setActiveChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
	initializeUserChats: ({ username }: { username: string }) => Promise<void>;
}

export interface SpinnerContextType {
	showSpinner: (show: boolean) => void;
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
	name: string;
	creator: string;
	membersNames: string[];
}

export interface AddMembersRequest {
	usernames: string[];
	chatId: number;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	content: T;
	status: HttpStatusString;
}
