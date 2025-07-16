package com.franco.chat.web_socket;

import org.springframework.http.HttpStatus;

public record WebSocketResponse(boolean success, String message, Object content, String username) {
}
