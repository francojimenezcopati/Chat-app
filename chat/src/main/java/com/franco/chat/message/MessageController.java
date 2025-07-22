package com.franco.chat.message;

import com.franco.chat.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1/message")
public class MessageController {
	private final MessageService messageService;

	@GetMapping
	public ResponseEntity<ResponseDTO> getAll() {
		ResponseDTO responseDTO = this.messageService.getAll();

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PostMapping
	public ResponseEntity<ResponseDTO> createMessage(@RequestBody MessageRequest request) {
		ResponseDTO res = this.messageService.createMessage(
				request.content(),
				request.username(),
				request.chatId(),
				request.type()
		);

		return new ResponseEntity<>(res, res.status());
	}

//	@PostMapping(path = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//	public ResponseEntity<ResponseDTO> createMessageWithImage(
//			@RequestPart("message") MessageRequest request,
//			@RequestPart("imageFile") MultipartFile imageFile
//	) {
//		ResponseDTO res = this.messageService.createMessageWithImage(
//				request.content(),
//				request.username(),
//				request.chatId(),
//				request.type(),
//				imageFile
//		);
//
//		return new ResponseEntity<>(res, res.status());
//	}

	@PutMapping(path = "/{messageId}")
	public ResponseEntity<ResponseDTO> updateMessage(
			@PathVariable("messageId") Long messageId,
			UpdateMessageRequest request
	) {
		ResponseDTO res = this.messageService.updateMessage(messageId, request.content());

		return new ResponseEntity<>(res, res.status());
	}

	@DeleteMapping(path = "/{messageId}")
	public ResponseEntity<ResponseDTO> deleteMessage(@PathVariable("messageId") Long messageId) {
		ResponseDTO res = this.messageService.deleteMessage(messageId);

		return new ResponseEntity<>(res, res.status());
	}
}
