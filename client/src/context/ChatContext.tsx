import { useState, type ReactNode } from "react";
import { ChatContext } from "./useChatContext";
import type { ChatContextType, ChatType } from "../utils/types";

interface Props {
	children: ReactNode;
}

export const ChatProvider: React.FC<Props> = ({ children }) => {
	const userChats: ChatType[] = [
		{
			id: 1,
			name: "Los de la nasa",
			createdAt: new Date(),
			createdBy: {
				createdAt: new Date(),
				username: "fran",
			},
			members: [
				{
					user: {
						createdAt: new Date(),
						username: "fran",
					},
					isAdmin: true,
				},
				{
					user: {
						createdAt: new Date(),
						username: "chali",
					},
					isAdmin: false,
				},
				{
					user: {
						createdAt: new Date(),
						username: "insa",
					},
					isAdmin: false,
				},
				{
					user: {
						createdAt: new Date(),
						username: "insa",
					},
					isAdmin: false,
				},
				{
					user: {
						createdAt: new Date(),
						username: "insa",
					},
					isAdmin: false,
				},
				{
					user: {
						createdAt: new Date(),
						username: "prev",
					},
					isAdmin: false,
				},
				{
					user: {
						createdAt: new Date(),
						username: "test",
					},
					isAdmin: false,
				},
			],
			messages: [
				{
					content: "Hola este es mi mensaje de texto",
					username: "fran",
					createdAt: new Date(),
				},
				{
					username: "chali",
					content:
						"asdklfjsdl kadsjfasdjfaskldf jldksf kasdjf lakdsf jalskdfjalsdkfjasdklfjadls kfjadskfjaskl f jals kdfjaldksfjasldkf asdlkf jasdlkfjas lkfasd jsd",
					createdAt: new Date(),
				},
				{
					content: "Fua para loco",
					username: "fran",
					createdAt: new Date(),
				},
			],
		},
		{
			id: 2,
			name: "Mentes brillantes",
			createdAt: new Date(),
			createdBy: {
				username: "luqui",
				createdAt: new Date(),
			},
			members: [
				{
					user: {
						username: "luqui",
						createdAt: new Date(),
					},
					isAdmin: true,
				},
				{
					user: {
						username: "marce",
						createdAt: new Date(),
					},
					isAdmin: false,
				},
			],
			messages: [
				{
					username: "luqui",
					content: "Che, se viene el hackaton o no?",
					createdAt: new Date(),
				},
				{
					username: "marce",
					content: "Estoy meta café preparando los endpoints",
					createdAt: new Date(),
				},
				{
					username: "luqui",
					content: "Dale que esta vez ganamos sí o sí",
					createdAt: new Date(),
				},
			],
		},
		{
			id: 3,
			name: "Proyecto Final",
			createdAt: new Date(),
			createdBy: {
				username: "mili",
				createdAt: new Date(),
			},
			members: [
				{
					user: {
						username: "mili",
						createdAt: new Date(),
					},
					isAdmin: true,
				},
				{
					user: {
						username: "tomi",
						createdAt: new Date(),
					},
					isAdmin: false,
				},
				{
					user: {
						username: "fran",
						createdAt: new Date(),
					},
					isAdmin: false,
				},
			],
			messages: [
				{
					username: "mili",
					content: "Necesitamos definir bien las stories para esta semana.",
					createdAt: new Date(),
				},
				{
					username: "tomi",
					content: "Yo ya terminé la parte del login!",
					createdAt: new Date(),
				},
				{
					username: "fran",
					content: "Voy a armar el sistema de notificaciones hoy.",
					createdAt: new Date(),
				},
			],
		},
	];

	const [activeChat, setActiveChat] = useState<ChatType>(userChats[0]);
	const [chats, setChats] = useState<ChatType[]>(userChats);

	const contextData: ChatContextType = {
		chats,
		setChats,
		activeChat,
		setActiveChat,
	};

	return <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>;
};

export default ChatContext;
