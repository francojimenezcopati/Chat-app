package com.franco.chat.message;

import com.franco.chat.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1/message")
public class MessageController {
	private final MessageService messageService;

	@GetMapping
	public ResponseEntity<ResponseDTO> getAll(){
		ResponseDTO responseDTO = this.messageService.getAll();

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PostMapping
	public ResponseEntity<ResponseDTO> createMessage(@RequestBody MessageRequest request){
		ResponseDTO res = this.messageService.createMessage(request.content(), request.username(), request.chatId());

		return new ResponseEntity<>(res, res.status());
	}

	@PutMapping(path = "/{messageId}")
	public ResponseEntity<ResponseDTO> updateMessage(@PathVariable("messageId") Long messageId, UpdateMessageRequest request){
		ResponseDTO res = this.messageService.updateMessage(messageId, request.content());

		return new ResponseEntity<>(res, res.status());
	}

	@DeleteMapping(path = "/{messageId}")
	public ResponseEntity<ResponseDTO> deleteMessage(@PathVariable("messageId") Long messageId){
		ResponseDTO res = this.messageService.deleteMessage(messageId);

		return new ResponseEntity<>(res, res.status());
	}

}
