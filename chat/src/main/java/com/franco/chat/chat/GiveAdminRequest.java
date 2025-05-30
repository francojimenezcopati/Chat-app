package com.franco.chat.chat;

import java.util.List;

public record GiveAdminRequest(List<Long> userIds) {
}
