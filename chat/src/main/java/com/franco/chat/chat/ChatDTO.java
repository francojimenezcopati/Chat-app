package com.franco.chat.chat;

import com.franco.chat.appuser.AppUserDTO;
import com.franco.chat.message.MessageDTO;

import java.time.LocalDate;
import java.util.List;

public record ChatDTO(Long id, String name, AppUserDTO createdBy, LocalDate createdAt, List<ChatMembershipDTO> members,
					  List<MessageDTO> messages) {
}
