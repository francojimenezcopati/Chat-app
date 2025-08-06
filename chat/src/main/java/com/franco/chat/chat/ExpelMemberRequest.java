package com.franco.chat.chat;

public record ExpelMemberRequest(String adminUsername, Long chatId, String username) {
}
