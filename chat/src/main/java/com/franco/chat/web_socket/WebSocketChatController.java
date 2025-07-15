package com.franco.chat.web_socket;


import com.franco.chat.ResponseDTO;
import com.franco.chat.appuser.AppUserRequest;
import com.franco.chat.chat.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class WebSocketChatController {
	private final ChatService chatService;

	@MessageMapping("/chat/get-user-chats")
	@SendTo("/topic/chat")
	public ResponseEntity<ResponseDTO> getAllUserChats(@RequestBody AppUserRequest request) {
		ResponseDTO responseDTO = this.chatService.getUserChats(request.username());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@MessageMapping("/chat/create-chat")
//	@SendTo("/topic/chat")
	public ResponseEntity<ResponseDTO> createChat(@RequestBody ChatRequest request) {
		ResponseDTO responseDTO = this.chatService.createChat(request.name(), request.creator(), request.membersNames());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PutMapping(path = "{chatId}/add-users")
	public ResponseEntity<ResponseDTO> addNewUsersToChat(
			@PathVariable("chatId") Long chatId, @RequestBody AddNewUsersToChatRequest request) {
		ResponseDTO responseDTO = this.chatService.addNewUsers(chatId, request.usernames());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PutMapping(path = "{chatId}/give-admin")
	public ResponseEntity<ResponseDTO> giveAdminToUser(
			@PathVariable("chatId") Long chatId, @RequestBody GiveAdminRequest request) {
		ResponseDTO responseDTO = this.chatService.giveAdminToUser(chatId, request.username());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@DeleteMapping(path = "{chatId}/remove-member")
	public ResponseEntity<ResponseDTO> removeMember(
			@PathVariable("chatId") Long chatId, @RequestBody AppUserRequest request) {
		ResponseDTO responseDTO = this.chatService.removeMember(chatId, request.username());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PutMapping(path = "{chatId}/edit-name")
	public ResponseEntity<ResponseDTO> editChatName(
			@PathVariable("chatId") Long chatId, @RequestBody EditChatNameRequest request) {
		ResponseDTO responseDTO = this.chatService.editChatName(chatId, request.name());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}
}
