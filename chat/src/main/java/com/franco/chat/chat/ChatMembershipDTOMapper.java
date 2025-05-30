package com.franco.chat.chat;

import com.franco.chat.appuser.AppUserDTOMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class ChatMembershipDTOMapper implements Function<ChatMembership, ChatMembershipDTO> {
	private final AppUserDTOMapper appUserDTOMapper;

	@Override
	public ChatMembershipDTO apply(ChatMembership chatMembership) {
		return new ChatMembershipDTO(
				this.appUserDTOMapper.apply(chatMembership.getAppUser()),
				chatMembership.isAdmin()
		);
	}
}
