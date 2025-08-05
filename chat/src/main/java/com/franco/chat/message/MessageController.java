package com.franco.chat.message;

import com.franco.chat.ResponseDTO;
import com.franco.chat.SupabaseService;
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
	private final SupabaseService supabaseService;

	@PostMapping(path = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDTO> uploadMessageImage(
			@RequestPart("imageFile") MultipartFile imageFile
	) {
		System.out.println("\n\n"+ imageFile +"\n\n");
		ResponseDTO res = this.supabaseService.uploadImage(
				imageFile
		);

		return new ResponseEntity<>(res, res.status());
	}

//	@PutMapping(path = "/{messageId}")
//	public ResponseEntity<ResponseDTO> updateMessage(
//			@PathVariable("messageId") Long messageId,
//			UpdateMessageRequest request
//	) {
//		ResponseDTO res = this.messageService.updateMessage(messageId, request.content());
//
//		return new ResponseEntity<>(res, res.status());
//	}
//
//	@DeleteMapping(path = "/{messageId}")
//	public ResponseEntity<ResponseDTO> deleteMessage(@PathVariable("messageId") Long messageId) {
//		ResponseDTO res = this.messageService.deleteMessage(messageId);
//
//		return new ResponseEntity<>(res, res.status());
//	}
}
