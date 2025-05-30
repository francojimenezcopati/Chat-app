package com.franco.chat.chat;

import com.franco.chat.appuser.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMembershipRepository extends JpaRepository<ChatMembership, Long> {
	List<ChatMembership> findAllByChat(Chat chat);
	List<ChatMembership> findAllByChatId(Long chatId);
	List<ChatMembership> findAllByAppUser(AppUser appUser);
	Optional<ChatMembership> findByAppUserIdAndChatId(Long appUserId, Long chatId);
}
