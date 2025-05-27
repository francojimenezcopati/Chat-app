package com.franco.chat.appuser;

import com.franco.chat.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService {
	private final AppUserRepository appUserRepository;
	private final AppUserDTOMapper appUserDTOMapper;

	public ResponseDTO createAppUser(String name) {
		boolean isTitleNotUnique = this.appUserRepository.existsByUsernameIgnoreCase(name);

		if (isTitleNotUnique) {
			return new ResponseDTO(false, "Username already taken", null, HttpStatus.IM_USED);
		}

		AppUser appUser = new AppUser(name);
		AppUser savedUser = this.appUserRepository.save(appUser);

		AppUserDTO appUserDTO = this.appUserDTOMapper.apply(savedUser);

		return new ResponseDTO(true, "User successfully created", appUserDTO, HttpStatus.CREATED);
	}

	public ResponseDTO getAll() {
		List<AppUser> appUsers = this.appUserRepository.findAll();

		List<AppUserDTO> appUserDTOS = appUsers.stream().map(this.appUserDTOMapper).toList();

		return new ResponseDTO(true, "", appUserDTOS, HttpStatus.OK);
	}
}
