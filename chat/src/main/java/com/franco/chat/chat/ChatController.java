package com.franco.chat.chat;

import com.franco.chat.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1/chat")
public class ChatController {
	private final ChatService chatService;

	@PostMapping
	public ResponseEntity<ResponseDTO> createChat(@RequestBody ChatRequest request) {
		ResponseDTO responseDTO = this.chatService.createChat(request.creator(), request.participantsNames());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}
}
