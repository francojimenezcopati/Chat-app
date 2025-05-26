package com.franco.chat;

import org.springframework.http.HttpStatus;

public record ResponseDTO(
		boolean success,
		String message,
		Object content,
		HttpStatus status
) {
}