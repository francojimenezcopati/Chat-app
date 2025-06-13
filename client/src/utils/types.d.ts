export interface MessageInterface {
	content: string;
	username: string;
}

export interface UsernameContextType {
	username: string;
	setUsername: (username: string) => void;
}
