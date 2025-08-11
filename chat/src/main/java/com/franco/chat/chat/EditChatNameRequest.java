package com.franco.chat.chat;

public record EditChatNameRequest(Long chatId, String adminUsername, String name) {
}
