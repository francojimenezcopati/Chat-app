package com.franco.chat.web_socket;

import com.franco.chat.ResponseDTO;
import com.franco.chat.appuser.AppUserRequest;
import com.franco.chat.appuser.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketUserController {
	private final AppUserService appUserService;
	private final SimpMessagingTemplate messagingTemplate;

	@MessageMapping("/user/get-all")
	public void getAllUserChats() {
		ResponseDTO responseDTO = this.appUserService.getAll();

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = "/topic/users-list";
		messagingTemplate.convertAndSend(destination, responseDTO);
	}
}