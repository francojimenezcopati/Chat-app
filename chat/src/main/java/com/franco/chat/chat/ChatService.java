package com.franco.chat.chat;

import com.franco.chat.ResponseDTO;
import com.franco.chat.appuser.AppUser;
import com.franco.chat.appuser.AppUserRepository;
import com.franco.chat.message.MessageService;
import com.franco.chat.message.MessageType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {
	private final ChatDTOMapper chatDTOMapper;
	private final ChatRepository chatRepository;
	private final AppUserRepository appUserRepository;
	private final ChatMembershipRepository chatMembershipRepository;
	private final MessageService messageService;

	public ResponseDTO getAll() {
		List<Chat> chats = this.chatRepository.findAll();
		List<ChatDTO> chatDTOS = chats.stream().map(this.chatDTOMapper).toList();

		return new ResponseDTO(true, "", chatDTOS, HttpStatus.OK);
	}

	public ResponseDTO createChat(String name, String creator, List<String> memberNames) {
		Optional<AppUser> optionalCreatedBy = this.appUserRepository.findByUsernameIgnoreCase(creator);
		if (optionalCreatedBy.isPresent()) {
			AppUser createdBy = optionalCreatedBy.get();

			try {
				List<Optional<AppUser>> optionalMembers = memberNames.stream()
						.map(this.appUserRepository::findByUsernameIgnoreCase)
						.toList();

				List<AppUser> members = optionalMembers.stream().map(Optional::orElseThrow).toList();

				Chat chat = new Chat(name, createdBy);

				Chat savedChat = this.chatRepository.save(chat);

				List<ChatMembership> chatMemberships = members.stream()
						.map(member -> new ChatMembership(member, savedChat, false))
						.toList();

				ChatMembership adminMembership = new ChatMembership(createdBy, savedChat, true);

				this.chatMembershipRepository.save(adminMembership);
				this.chatMembershipRepository.saveAll(chatMemberships);

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

	@Transactional
	public ResponseDTO getUserChats(String username) {
		try {
			Optional<AppUser> optionalAppUser = this.appUserRepository.findByUsernameIgnoreCase(username);
			if (optionalAppUser.isPresent()) {
				AppUser appUser = optionalAppUser.get();

				System.out.println("\n\n" + "Username :" + username + "\n\n");

				List<Chat> userChats = this.chatMembershipRepository.findChatsWithMessagesAndMembersByAppUser(appUser);

				List<ChatDTO> userChatDTOs = userChats.stream().map(this.chatDTOMapper).toList();

				System.out.println("\n\n" + "User chats length: \n" + userChatDTOs.size() + "\n\n");

				return new ResponseDTO(true, "", userChatDTOs, HttpStatus.OK);
			} else {
				return new ResponseDTO(false, "User not found", null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseDTO(false, "Error: " + e.getMessage(), null, HttpStatus.NOT_FOUND);
		}
	}

	private String formatUsernames(List<String> usernames) {
		StringBuilder formattedUsernames = new StringBuilder();
		int length = usernames.size();
		for (int i = 0; i < length; i++) {
			String username = usernames.get(i);

			if (i > 0) {

				if (i < length - 1) {
					formattedUsernames.append(", ").append(username);
				} else {
					formattedUsernames.append(" & ").append(username);
				}
			} else {
				// Si es el primer elemento, para que no empieze con ", "
				formattedUsernames.append(username);
			}
		}

		return formattedUsernames.toString();
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

	public ResponseDTO giveAdminToUser(Long chatId, String username) {
		Optional<Chat> optionalChat = this.chatRepository.findById(chatId);
		try {
			if (optionalChat.isPresent()) {

				AppUser userToBeAdmin = this.appUserRepository.findByUsernameIgnoreCase(username).orElseThrow();

				ChatMembership chatMembership = this.chatMembershipRepository.findByAppUserIdAndChatId(
						userToBeAdmin.getId(),
						chatId
				).orElseThrow();

				chatMembership.setAdmin(true);

				this.chatMembershipRepository.save(chatMembership);

				return new ResponseDTO(true, "User successfully converted to admin", null, HttpStatus.OK);
			} else {
				return new ResponseDTO(false, "Chat not found", null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseDTO(false, "user not found", null, HttpStatus.NOT_FOUND);
		}
	}

	public ResponseDTO addNewUsers(Long chatId, List<String> usernames, String adminUsername) {
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

				String formattedUsernames = formatUsernames(usernames);
				String formattedGeneralMessage = adminUsername + " added " + formattedUsernames;
				ResponseDTO generalMessageResponse = this.messageService.createMessage(
						formattedGeneralMessage,
						adminUsername,
						chatId,
						MessageType.GENERAL
				);

				return new ResponseDTO(
						true,
						"User/s successfully added",
						generalMessageResponse.content(),
						HttpStatus.OK
				);
			} else {
				return new ResponseDTO(false, "Chat not found", null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseDTO(false, "One or more of the users not found", null, HttpStatus.NOT_FOUND);
		}
	}

	@Transactional
	public ResponseDTO removeMember(String adminUsername, Long chatId, String username) {
		Optional<Chat> optionalChat = this.chatRepository.findById(chatId);
		try {
			if (optionalChat.isPresent()) {
				Optional<AppUser> optionalAppUser = this.appUserRepository.findByUsernameIgnoreCase(username);
				if (optionalAppUser.isPresent()) {
					AppUser userToRemove = optionalAppUser.get();

					this.chatMembershipRepository.deleteByAppUserIdAndChatId(userToRemove.getId(), chatId);

					String generalMessageContent;
					if (Objects.equals(adminUsername, username)) {
						generalMessageContent = username + " left the chat";
					} else {
						generalMessageContent = adminUsername + " expelled " + username;
					}

					ResponseDTO generalMessageResponse = this.messageService.createMessage(
							generalMessageContent,
							adminUsername,
							chatId,
							MessageType.GENERAL
					);

					return new ResponseDTO(
							true,
							"User successfully removed from chat",
							generalMessageResponse.content(),
							HttpStatus.OK
					);
				} else {
					return new ResponseDTO(false, "User not found", null, HttpStatus.NOT_FOUND);
				}
			} else {
				return new ResponseDTO(false, "Chat not found", null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return new ResponseDTO(
					false,
					"Something went wrong while expeling " + username,
					null,
					HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	public ResponseDTO editChatName(Long chatId, String name) {
		Optional<Chat> optionalChat = this.chatRepository.findById(chatId);
		try {
			if (optionalChat.isPresent()) {
				Chat chat = optionalChat.get();

				chat.setName(name);

				this.chatRepository.save(chat);

				return new ResponseDTO(true, "Chat name changed", null, HttpStatus.OK);
			} else {
				return new ResponseDTO(false, "Chat not found", null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return new ResponseDTO(
					false,
					"Something went wrong while editing the chat",
					null,
					HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
}
