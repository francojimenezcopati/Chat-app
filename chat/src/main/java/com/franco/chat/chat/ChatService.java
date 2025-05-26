package com.franco.chat.chat;

import com.franco.chat.ResponseDTO;
import com.franco.chat.appuser.AppUser;
import com.franco.chat.appuser.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {
	private final ChatDTOMapper chatDTOMapper;
	private final ChatRepository chatRepository;
	private final AppUserRepository appUserRepository;

	public ResponseDTO createChat(String creator, List<String> participantsNames) {
		Optional<AppUser> optionalCreatedBy = this.appUserRepository.findByUsernameIgnoreCase(creator);
		if (optionalCreatedBy.isPresent()) {
			AppUser createdBy = optionalCreatedBy.get();

			try {
				List<Optional<AppUser>> optionalParticipants = participantsNames.stream()
						.map(this.appUserRepository::findByUsernameIgnoreCase)
						.toList();

				System.out.println(optionalParticipants);

				List<AppUser> participants = optionalParticipants.stream()
						.map(Optional::orElseThrow)
						.toList();

				Chat chat = new Chat(createdBy, participants);

				Chat createdChat = this.chatRepository.save(chat);

				ChatDTO chatDTO = this.chatDTOMapper.apply(createdChat);

				return new ResponseDTO(true, "Chat successfully created", chatDTO, HttpStatus.CREATED);
			} catch (Exception e) {
				return new ResponseDTO(false, "One or more of the participants not found", null, HttpStatus.NOT_FOUND);
			}
		} else {
			return new ResponseDTO(false, "Creator not found", null, HttpStatus.NOT_FOUND);
		}
	}
}
