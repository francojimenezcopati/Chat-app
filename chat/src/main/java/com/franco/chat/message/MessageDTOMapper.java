package com.franco.chat.message;

import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class MessageDTOMapper implements Function<Message, MessageDTO> {
	@Override
	public MessageDTO apply(Message message) {
		return new MessageDTO(
				message.getContent(),
				message.getUsername(),
				message.getCreatedAt(),
				message.getType(),
				message.getImageUrl()
		);
	}
}
