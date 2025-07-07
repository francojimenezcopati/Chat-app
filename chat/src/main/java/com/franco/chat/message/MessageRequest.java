package com.franco.chat.message;

public record MessageRequest(String content, String username, Long chatId, MessageType type) {
}
