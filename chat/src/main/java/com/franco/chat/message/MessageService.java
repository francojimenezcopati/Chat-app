package com.franco.chat.message;

import com.franco.chat.ResponseDTO;
import com.franco.chat.appuser.AppUser;
import com.franco.chat.appuser.AppUserRepository;
import com.franco.chat.chat.Chat;
import com.franco.chat.chat.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {
	private final MessageRepository messageRepository;
	private final AppUserRepository appUserRepository;
	private final ChatRepository chatRepository;
	private final MessageDTOMapper messageDTOMapper;

	public ResponseDTO getAll() {
		List<Message> messages = this.messageRepository.findAll();
		List<MessageDTO> messageDTOS = messages.stream().map(this.messageDTOMapper).toList();

		return new ResponseDTO(true, "", messageDTOS, HttpStatus.OK);
	}

	public ResponseDTO createMessage(String content, String username, Long chatId) {
		Optional<AppUser> optionalAppUser = this.appUserRepository.findByUsernameIgnoreCase(username);
		Optional<Chat> optionalChat = this.chatRepository.findById(chatId);
		if (optionalAppUser.isPresent() && optionalChat.isPresent()) {
			AppUser appUser = optionalAppUser.get();
			Chat chat = optionalChat.get();

			Message message = new Message(content, appUser.getUsername(), appUser, chat);
			Message savedMessage = this.messageRepository.save(message);

			MessageDTO messageDTO = this.messageDTOMapper.apply(savedMessage);

			return new ResponseDTO(true, "Message successfully created", messageDTO, HttpStatus.CREATED);
		} else {
			return new ResponseDTO(false, "User or chat not found", null, HttpStatus.NOT_FOUND);
		}
	}

	public ResponseDTO deleteMessage(Long messageId) {
		try {
			Message messageToDelete = this.messageRepository.findById(messageId).orElseThrow();

			this.messageRepository.delete(messageToDelete);

			return new ResponseDTO(true, "Message successfully deleted", null, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseDTO(false, "Message with id: '" + messageId + "' not found", null,
					HttpStatus.NOT_FOUND);
		}
	}

	public ResponseDTO updateMessage(Long messageId, String newContent) {
		try {
			Message messageToUpdate = this.messageRepository.findById(messageId).orElseThrow();

			messageToUpdate.setContent(newContent);

			this.messageRepository.save(messageToUpdate);

			return new ResponseDTO(true, "Message successfully updated", null, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseDTO(false, "Message with id: '" + messageId + "' not found", null,
					HttpStatus.NOT_FOUND);
		}
	}

}
