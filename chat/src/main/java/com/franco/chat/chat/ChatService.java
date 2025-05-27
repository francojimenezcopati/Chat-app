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

	public ResponseDTO getAll() {
		List<Chat> chats = this.chatRepository.findAll();
		List<ChatDTO> chatDTOS = chats.stream().map(this.chatDTOMapper).toList();

		return new ResponseDTO(true, "", chatDTOS, HttpStatus.OK);
	}

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

	public ResponseDTO addNewUsers(Long chatId, List<String> usernames) {
		try {
			List<AppUser> newUsers = usernames.stream().map(this.appUserRepository::findByUsernameIgnoreCase).map(Optional::orElseThrow).toList();

			Optional<Chat> optionalChat = this.chatRepository.findById(chatId);
			if(optionalChat.isPresent()){
				Chat chat = optionalChat.get();

				chat.getParticipants().addAll(newUsers);

				this.chatRepository.save(chat);

				return new ResponseDTO(true, "Users successfully added", null, HttpStatus.OK);
			}else{
				return new ResponseDTO(false, "Chat not found", null, HttpStatus.NOT_FOUND);
			}
		}catch (Exception e){
			return new ResponseDTO(false, "One or more of the users not found", null, HttpStatus.NOT_FOUND);
		}

	}
}
