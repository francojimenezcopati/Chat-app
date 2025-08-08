package com.franco.chat.web_socket;


import com.franco.chat.ResponseDTO;
import com.franco.chat.appuser.AppUserRequest;
import com.franco.chat.chat.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class WebSocketChatController {
	private final ChatService chatService;
	private final SimpMessagingTemplate messagingTemplate;
	private static final String DESTINATION_PREFIX = "/topic/user/";

	@MessageMapping("/chat/get-user-chats")
	public void getAllUserChats(@Payload AppUserRequest request) {
		ResponseDTO responseDTO = this.chatService.getUserChats(request.username());

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = DESTINATION_PREFIX + request.username();

		WebSocketResponse response;
		if (responseDTO.success()) {
			response = new WebSocketResponse.ChatListUpdated((List<ChatDTO>) responseDTO.content());
		} else {
			response = new WebSocketResponse.ErrorResponse(responseDTO.message());
		}

		messagingTemplate.convertAndSend(destination, response);
	}

	@MessageMapping("/chat/add-users")
	public void addNewUsersToChat(
			@Payload AddNewUsersToChatRequest request
	) {
		ResponseDTO responseDTO = this.chatService.addNewUsers(
				request.chatId(),
				request.usernames(),
				request.adminUsername()
		);

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = "/topic/chat/" + request.chatId();
		messagingTemplate.convertAndSend(destination, responseDTO);
	}

	@MessageMapping("/chat/expel-user")
	public void expelMemberFromChat(
			@Payload ExpelMemberRequest request
	) {
		System.out.println("\n\n" + request + "\n\n");
		ResponseDTO responseDTO = this.chatService.removeMember(
				request.adminUsername(),
				request.chatId(),
				request.username()
		);

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = "/topic/chat/" + request.chatId();
		messagingTemplate.convertAndSend(destination, responseDTO);
	}
	//
	//	@PutMapping(path = "{chatId}/give-admin")
	//	public ResponseEntity<ResponseDTO> giveAdminToUser(
	//			@PathVariable("chatId") Long chatId, @RequestBody GiveAdminRequest request) {
	//		ResponseDTO responseDTO = this.chatService.giveAdminToUser(chatId, request.username());
	//
	//		return new ResponseEntity<>(responseDTO, responseDTO.status());
	//	}
	//
	//	@PutMapping(path = "{chatId}/edit-name")
	//	public ResponseEntity<ResponseDTO> editChatName(
	//			@PathVariable("chatId") Long chatId, @RequestBody EditChatNameRequest request) {
	//		ResponseDTO responseDTO = this.chatService.editChatName(chatId, request.name());
	//
	//		return new ResponseEntity<>(responseDTO, responseDTO.status());
	//	}
}
