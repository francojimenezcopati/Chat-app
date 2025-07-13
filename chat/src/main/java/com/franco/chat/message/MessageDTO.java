package com.franco.chat.message;

import java.util.Date;

public record MessageDTO(String content, String username, Date createdAt, MessageType type, String imageUrl) {
}
