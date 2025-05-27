package com.franco.chat.chat;

import com.franco.chat.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1/chat")
public class ChatController {
	private final ChatService chatService;

	@GetMapping
	public ResponseEntity<ResponseDTO> getAll(){
		ResponseDTO responseDTO = this.chatService.getAll();

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PostMapping
	public ResponseEntity<ResponseDTO> createChat(@RequestBody ChatRequest request) {
		ResponseDTO responseDTO = this.chatService.createChat(request.creator(), request.participantsNames());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PutMapping(path = "{chatId}")
	public ResponseEntity<ResponseDTO> addNewUsersToChat(@PathVariable("chatId") Long chatId, @RequestBody AddNewUsersToChatRequest request) {
		ResponseDTO responseDTO = this.chatService.addNewUsers(chatId, request.usernames());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}
}
