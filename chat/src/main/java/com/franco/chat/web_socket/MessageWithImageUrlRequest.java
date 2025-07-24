package com.franco.chat.web_socket;

import com.franco.chat.message.MessageType;

public record MessageWithImageUrlRequest(String content, String username, Long chatId, MessageType type, String imageUrl) {
}
