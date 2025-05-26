package com.franco.chat.chat;

import com.franco.chat.appuser.AppUserDTO;

import java.time.LocalDate;
import java.util.List;

public record ChatDTO(AppUserDTO createdBy, LocalDate createdAt, List<AppUserDTO> participants) {
}
