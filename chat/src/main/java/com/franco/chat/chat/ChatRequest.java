package com.franco.chat.chat;

import java.util.List;

public record ChatRequest(String name, String creator, List<String> membersNames) {
}

