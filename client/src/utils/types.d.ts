export interface MessageInterface {
	content: string;
	username: string;
	createdAt: Date;
}

export interface UsernameContextType {
	username: string;
	setUsername: (username: string) => void;
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
