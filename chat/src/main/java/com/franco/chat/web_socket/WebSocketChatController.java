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

@Controller
@RequiredArgsConstructor
public class WebSocketChatController {
	private final ChatService chatService;
	private final SimpMessagingTemplate messagingTemplate;

	@MessageMapping("/chat/create-chat")
	//	@SendTo("/topic/chat")
	public ResponseEntity<ResponseDTO> createChat(@RequestBody ChatRequest request) {
		ResponseDTO responseDTO = this.chatService.createChat(
				request.name(),
				request.creator(),
				request.membersNames()
		);

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@MessageMapping("/chat/get-user-chats")
	public void getAllUserChats(@Payload AppUserRequest request) {
		ResponseDTO responseDTO = this.chatService.getUserChats(request.username());

		System.out.println("\n\n"+ "All user chats getted" +"\n\n");

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = "/topic/chat/" + request.username();
		messagingTemplate.convertAndSend(destination, responseDTO);
	}

	@MessageMapping("/chat/add-users")
	public void addNewUsersToChat(
			@Payload AddNewUsersToChatRequest request
	) {
		ResponseDTO responseDTO = this.chatService.addNewUsers(request.chatId(), request.usernames(), request.adminUsername());

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = "/topic/chat/" + request.chatId();
		messagingTemplate.convertAndSend(destination, responseDTO);
	}

	@MessageMapping("/chat/expel-user")
	public void expelMemberFromChat(
			@Payload ExpelMemberRequest request
	) {
		System.out.println("\n\n"+ request +"\n\n");
		ResponseDTO responseDTO = this.chatService.removeMember(request.adminUsername(), request.chatId(), request.username());

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
	//	@DeleteMapping(path = "{chatId}/remove-member")
	//	public ResponseEntity<ResponseDTO> removeMember(
	//			@PathVariable("chatId") Long chatId, @RequestBody AppUserRequest request) {
	//		ResponseDTO responseDTO = this.chatService.removeMember(chatId, request.username());
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
