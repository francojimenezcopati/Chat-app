package com.franco.chat.chat;

import java.util.List;

public record ChatRequest(String creator, List<String> participantsNames) {
}

