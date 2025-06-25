package com.franco.chat.chat;

import com.franco.chat.ResponseDTO;
import com.franco.chat.appuser.AppUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1/chat")
public class ChatController {
	private final ChatService chatService;

	@GetMapping
	public ResponseEntity<ResponseDTO> getAll() {
		ResponseDTO responseDTO = this.chatService.getAll();

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PostMapping(path = "get-user-chats")
	public ResponseEntity<ResponseDTO> getAllUserChats(@RequestBody AppUserRequest request) {
		ResponseDTO responseDTO = this.chatService.getUserChats(request.username());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PostMapping
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
	public ResponseEntity<ResponseDTO> giveAdminToUsers(
			@PathVariable("chatId") Long chatId, @RequestBody GiveAdminRequest request) {
		ResponseDTO responseDTO = this.chatService.giveAdminToUsers(chatId, request.usernames());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@DeleteMapping(path = "{chatId}")
	public ResponseEntity<ResponseDTO> deleteChat(@PathVariable("chatId") Long chatId, @RequestBody DeleteChatRequest request) {
		ResponseDTO responseDTO = this.chatService.deleteChat(chatId, request.userWithAdminId());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}
}
