package com.franco.chat.appuser;

import java.time.LocalDate;

public record AppUserDTO(Long id, String username, LocalDate createdAt) {
}
