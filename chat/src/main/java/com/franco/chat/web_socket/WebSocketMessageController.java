package com.franco.chat.web_socket;

import com.franco.chat.ResponseDTO;
import com.franco.chat.message.MessageDTO;
import com.franco.chat.message.MessageRequest;
import com.franco.chat.message.MessageService;
import com.franco.chat.message.UpdateMessageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequiredArgsConstructor
public class WebSocketMessageController {
	private final MessageService messageService;
	private final SimpMessagingTemplate messagingTemplate;

	@MessageMapping("/chat/send-message")
	public void handleSendMessage(MessageRequest request) {
		ResponseDTO response = messageService.createMessage(
				request.content(),
				request.username(),
				request.chatId(),
				request.type()
		);

		if (response.success()) {
			MessageDTO messageDTO = (MessageDTO) response.content();

			// 🔥 BROADCAST a todos los usuarios en el chat
			String destination = "/topic/chat/" + request.chatId();
			messagingTemplate.convertAndSend(destination, messageDTO);
		}
	}

	@MessageMapping("/message/send/with-image")
	@SendTo("/topic/messages")
	public ResponseEntity<ResponseDTO> createMessageWithImage(
			@RequestPart("message") MessageRequest request,
			@RequestPart("imageFile") MultipartFile imageFile
	) {
		ResponseDTO res = this.messageService.createMessageWithImage(
				request.content(),
				request.username(),
				request.chatId(),
				request.type(),
				imageFile
		);

		return new ResponseEntity<>(res, res.status());
	}

	//	@MessageMapping("/message/update")
	//	public ResponseEntity<ResponseDTO> updateMessage(
	//			@PathVariable("messageId") Long messageId,
	//			UpdateMessageRequest request
	//	) {
	//		ResponseDTO res = this.messageService.updateMessage(messageId, request.content());
	//
	//		return new ResponseEntity<>(res, res.status());
	//	}
	//
	//	@MessageMapping("/message/update/delete")
	//	public ResponseEntity<ResponseDTO> deleteMessage(@PathVariable("messageId") Long messageId) {
	//		ResponseDTO res = this.messageService.deleteMessage(messageId);
	//
	//		return new ResponseEntity<>(res, res.status());
	//	}
}
