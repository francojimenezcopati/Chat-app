package com.franco.chat.appuser;

import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class AppUserDTOMapper implements Function<AppUser, AppUserDTO> {
	@Override
	public AppUserDTO apply(AppUser appUser) {
		return new AppUserDTO(appUser.getId(), appUser.getUsername(), appUser.getCreatedAt());
	}
}
