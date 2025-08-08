package com.franco.chat.web_socket;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.franco.chat.appuser.AppUser;
import com.franco.chat.chat.ChatDTO;
import com.franco.chat.message.MessageDTO;

import java.util.List;

public sealed interface WebSocketResponse
		permits WebSocketResponse.ChatListUpdated, WebSocketResponse.ErrorResponse, WebSocketResponse.ResyncRequired,
		WebSocketResponse.UserListUpdated {

	String type();

	record ResyncRequired() implements WebSocketResponse {
		@Override
		@JsonProperty("type")
		public String type() {
			return "RESYNC_REQUIRED";
		}
	}

	record UserListUpdated(List<AppUser> payload) implements WebSocketResponse {
		@Override
		@JsonProperty("type")
		public String type() {
			return "USER_LIST_UPDATED";
		}
	}

	record ChatListUpdated(List<ChatDTO> payload) implements WebSocketResponse {
		@Override
		@JsonProperty("type")
		public String type() {
			return "CHAT_LIST_UPDATED";
		}
	}

	record ErrorResponse(String payload) implements WebSocketResponse {
		@Override
		@JsonProperty("type")
		public String type() {
			return "ERROR";
		}
	}
}
