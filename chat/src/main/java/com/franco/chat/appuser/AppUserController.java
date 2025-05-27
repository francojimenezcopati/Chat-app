package com.franco.chat.appuser;

import com.franco.chat.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "api/v1/user")
public class AppUserController {
	private final AppUserService appUserService;

	@GetMapping
	public ResponseEntity<ResponseDTO> getAll(){
		ResponseDTO responseDTO = this.appUserService.getAll();

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}

	@PostMapping
	public ResponseEntity<ResponseDTO> createUser(@RequestBody AppUserRequest request) {
		ResponseDTO responseDTO = this.appUserService.createAppUser(request.name());

		return new ResponseEntity<>(responseDTO, responseDTO.status());
	}


}
