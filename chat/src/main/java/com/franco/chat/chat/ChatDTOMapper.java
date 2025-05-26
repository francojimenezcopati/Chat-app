package com.franco.chat.chat;

import com.franco.chat.appuser.AppUserDTO;
import com.franco.chat.appuser.AppUserDTOMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class ChatDTOMapper implements Function<Chat, ChatDTO> {
	private final AppUserDTOMapper appUserDTOMapper;

	@Override
	public ChatDTO apply(Chat chat) {
		List<AppUserDTO> participantsDTO = chat.getParticipants().stream().map(this.appUserDTOMapper).toList();
		return new ChatDTO(this.appUserDTOMapper.apply(chat.getCreatedBy()), chat.getCreatedAt(), participantsDTO);
	}
}
