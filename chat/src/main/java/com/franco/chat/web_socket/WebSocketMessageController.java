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
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

@Controller
@RequiredArgsConstructor
public class WebSocketMessageController {
	private final MessageService messageService;
	private final SimpMessagingTemplate messagingTemplate;


	@MessageMapping("/chat/send-message")
	public void handleSendMessage(@Payload MessageRequest request) {
		ResponseDTO response = messageService.createMessage(
				request.content(),
				request.username(),
				request.chatId(),
				request.type()
		);

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = "/topic/chat/" + request.chatId();
		messagingTemplate.convertAndSend(destination, response);
	}

	@MessageMapping("/chat/send-message/with-image")
	@SendTo("/topic/messages")
	public void createMessageWithImage(
			@Payload WSMessageWithImage64Request request
	) {
		System.out.println("\n\n\n");
		System.out.println(request);
		System.out.println("\n\n\n");
		String base64 = request.image64();

		// Extraer metadata (tipo mime y data)
		String[] parts = base64.split(",");
		String data = parts[1];     // la imagen en sí

		byte[] imageBytes = Base64.getDecoder().decode(data);

		ResponseDTO res = this.messageService.createMessageWithImage(
				request.content(),
				request.username(),
				request.chatId(),
				request.type(),
				imageBytes
		);

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = "/topic/chat/" + request.chatId();
		messagingTemplate.convertAndSend(destination, res);
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
