package com.franco.chat.chat;

import java.util.List;

public record AddNewUsersToChatRequest(String adminUsername, List<String> usernames, Long chatId){}
