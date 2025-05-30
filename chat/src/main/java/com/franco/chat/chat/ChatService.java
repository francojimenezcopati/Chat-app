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
	private final ChatMembershipRepository chatMembershipRepository;

	public ResponseDTO getAll() {
		List<Chat> chats = this.chatRepository.findAll();
		List<ChatDTO> chatDTOS = chats.stream().map(this.chatDTOMapper).toList();

		return new ResponseDTO(true, "", chatDTOS, HttpStatus.OK);
	}

	public ResponseDTO createChat(String creator, List<String> memberNames) {
		Optional<AppUser> optionalCreatedBy = this.appUserRepository.findByUsernameIgnoreCase(creator);
		if (optionalCreatedBy.isPresent()) {
			AppUser createdBy = optionalCreatedBy.get();

			try {
				List<Optional<AppUser>> optionalMembers = memberNames.stream()
						.map(this.appUserRepository::findByUsernameIgnoreCase)
						.toList();

				List<AppUser> members = optionalMembers.stream().map(Optional::orElseThrow).toList();

				Chat chat = new Chat(createdBy);

				Chat savedChat = this.chatRepository.save(chat);

				List<ChatMembership> chatMemberships = members.stream()
						.map(p -> new ChatMembership(p, savedChat, false))
						.toList();

				ChatMembership adminMembership = new ChatMembership(createdBy, savedChat, true);

				this.chatMembershipRepository.saveAll(chatMemberships);
				this.chatMembershipRepository.save(adminMembership);

				ChatDTO chatDTO = this.chatDTOMapper.apply(savedChat);

				return new ResponseDTO(true, "Chat successfully created", chatDTO, HttpStatus.CREATED);
			} catch (Exception e) {
				System.out.println(e.getMessage());
				return new ResponseDTO(false, "One or more of the members not found", null, HttpStatus.NOT_FOUND);
			}
		} else {
			return new ResponseDTO(false, "Creator not found", null, HttpStatus.NOT_FOUND);
		}
	}

	public ResponseDTO addNewUsers(Long chatId, List<String> usernames) {
		try {
			List<AppUser> newUsers = usernames.stream()
					.map(this.appUserRepository::findByUsernameIgnoreCase)
					.map(Optional::orElseThrow)
					.toList();

			Optional<Chat> optionalChat = this.chatRepository.findById(chatId);
			if (optionalChat.isPresent()) {
				Chat chat = optionalChat.get();

				List<ChatMembership> newChatMemberships = newUsers.stream()
						.map(user -> new ChatMembership(user, chat, false))
						.toList();

				this.chatMembershipRepository.saveAll(newChatMemberships);

				return new ResponseDTO(true, "Users successfully added", null, HttpStatus.OK);
			} else {
				return new ResponseDTO(false, "Chat not found", null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseDTO(false, "One or more of the users not found", null, HttpStatus.NOT_FOUND);
		}
	}

	public ResponseDTO deleteChat(Long chatId, Long userWithAdminId) {
		Optional<Chat> optionalChat = this.chatRepository.findById(chatId);
		try {
			if (optionalChat.isPresent()) {
				ChatMembership membership = this.chatMembershipRepository.findByAppUserIdAndChatId(
						userWithAdminId,
						chatId
				).orElseThrow();

				if (membership.isAdmin()) {
					this.chatRepository.deleteById(chatId);

					//Esto vvvvv no hace falta porque agregue CASCADE_TYPE.ALL en la clase "Chat"
					//				List<ChatMembership> chatMemberships = this.chatMembershipRepository
					//				.findAllByChatId(chatId);
					//				this.chatMembershipRepository.deleteAll(chatMemberships);

					return new ResponseDTO(true, "Chat successfully deleted", null, HttpStatus.OK);
				} else {
					return new ResponseDTO(false, "Only admins are able to delete chats", null,
							HttpStatus.BAD_REQUEST);
				}
			} else {
				return new ResponseDTO(false, "Chat not found", null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return new ResponseDTO(
					false,
					"Something went wrong while deleting the chat",
					null,
					HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	public ResponseDTO giveAdminToUsers(Long chatId, List<Long> userIds) {
		Optional<Chat> optionalChat = this.chatRepository.findById(chatId);
		try {
			if (optionalChat.isPresent()) {
				List<ChatMembership> chatMemberships = userIds.stream()
						.map(id -> this.chatMembershipRepository.findByAppUserIdAndChatId(id, chatId))
						.map(Optional::orElseThrow)
						.toList();

				List<ChatMembership> newAdminsMemberships = chatMemberships.stream()
						.peek(membership -> membership.setAdmin(true))
						.toList();

				this.chatMembershipRepository.saveAll(newAdminsMemberships);

				return new ResponseDTO(true, "Users successfully converted to admins", null, HttpStatus.OK);
			} else {
				return new ResponseDTO(false, "Chat not found", null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseDTO(false, "One or more of the users not found", null, HttpStatus.NOT_FOUND);
		}
	}

	public ResponseDTO getUserChats(String username) {
		try {
			Optional<AppUser> optionalAppUser = this.appUserRepository.findByUsernameIgnoreCase(username);
			if (optionalAppUser.isPresent()) {
				AppUser appUser = optionalAppUser.get();

				List<ChatMembership> userMemberships = this.chatMembershipRepository.findAllByAppUser(appUser);

				List<Chat> userChats = userMemberships.stream().map(ChatMembership::getChat).toList();

				List<ChatDTO> userChatDTOs = userChats.stream().map(this.chatDTOMapper).toList();

				return new ResponseDTO(true, "", userChatDTOs, HttpStatus.OK);
			} else {
				return new ResponseDTO(false, "User not found", null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseDTO(false, "One or more of the users not found", null, HttpStatus.NOT_FOUND);
		}
	}
}
