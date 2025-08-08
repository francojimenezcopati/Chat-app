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
	private static final String DESTINATION_PREFIX = "/topic/user/";

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
	public void createMessageWithImage(
			@Payload MessageWithImageUrlRequest request
	) {
		ResponseDTO res = this.messageService.createMessageWithImage(
				request.content(),
				request.username(),
				request.chatId(),
				request.type(),
				request.imageUrl()
		);

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = "/topic/chat/" + request.chatId();
		messagingTemplate.convertAndSend(destination, res);
	}
}
