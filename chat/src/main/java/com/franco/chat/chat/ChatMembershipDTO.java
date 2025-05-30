package com.franco.chat.chat;

import com.franco.chat.appuser.AppUserDTO;

public record ChatMembershipDTO(AppUserDTO user, boolean isAdmin) {
}
