package com.franco.chat.chat;

import com.franco.chat.appuser.AppUserDTO;
import com.franco.chat.appuser.AppUserDTOMapper;
import com.franco.chat.message.MessageDTO;
import com.franco.chat.message.MessageDTOMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class ChatDTOMapper implements Function<Chat, ChatDTO> {
	private final AppUserDTOMapper appUserDTOMapper;
	private final MessageDTOMapper messageDTOMapper;

	@Override
	public ChatDTO apply(Chat chat) {
		List<AppUserDTO> participantsDTO = chat.getParticipants().stream().map(this.appUserDTOMapper).toList();
		List<MessageDTO> messageDTO = chat.getMessages().stream().map(this.messageDTOMapper).toList();
		return new ChatDTO(chat.getId(), this.appUserDTOMapper.apply(chat.getCreatedBy()), chat.getCreatedAt(), participantsDTO,
				messageDTO);
	}
}
