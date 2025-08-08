package com.franco.chat.appuser;

import com.franco.chat.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "api/v1/user")
public class AppUserController {
	private final AppUserService appUserService;
	private final SimpMessagingTemplate messagingTemplate;

	@GetMapping
	public ResponseEntity<ResponseDTO> getAll() {
		ResponseDTO responseDTO = this.appUserService.getAll();

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PostMapping
	public ResponseEntity<ResponseDTO> createUser(@RequestBody AppUserRequest request) {
		ResponseDTO responseDTO = this.appUserService.createAppUser(request.username());

		ResponseDTO wsResponse = this.appUserService.getAll();

		// 🔥 BROADCAST a todos los usuarios en el chat
		String destination = "/topic/users-list";
		messagingTemplate.convertAndSend(destination, wsResponse);

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}
}
