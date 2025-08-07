package com.franco.chat.chat;

import com.franco.chat.appuser.AppUser;
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
	private final ChatMembershipRepository chatMembershipRepository;
	private final ChatMembershipDTOMapper chatMembershipDTOMapper;

	@Override
	public ChatDTO apply(Chat chat) {
		try {
			List<ChatMembership> chatMemberships = this.chatMembershipRepository.findAllByChat(chat);
			List<ChatMembershipDTO> membersDTO = chatMemberships.stream().map(this.chatMembershipDTOMapper).toList();
			List<MessageDTO> messagesDTO = chat.getMessages().stream().map(this.messageDTOMapper).toList();

			return new ChatDTO(
					chat.getId(),
					chat.getName(),
					this.appUserDTOMapper.apply(chat.getCreatedBy()),
					chat.getCreatedAt(),
					membersDTO,
					messagesDTO
			);
		} catch (Exception e) {
			System.out.println("\n\n" + "---- ERRORRRRR -------- ----" + e.getMessage());
			throw new RuntimeException(e);
		}
	}
}
