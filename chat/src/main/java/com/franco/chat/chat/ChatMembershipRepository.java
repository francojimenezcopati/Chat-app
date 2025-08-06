package com.franco.chat.chat;

import com.franco.chat.appuser.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMembershipRepository extends JpaRepository<ChatMembership, Long> {
	List<ChatMembership> findAllByChat(Chat chat);

	List<ChatMembership> findAllByChatId(Long chatId);

	List<ChatMembership> findAllByAppUser(AppUser appUser);

	Optional<ChatMembership> findByAppUserIdAndChatId(Long appUserId, Long chatId);

	void deleteByAppUserIdAndChatId(Long appUserId, Long chatId);

	/**
	 * Seleccionamos los chats no repetidos en los que participa el usuario (Distinct y Where).
	 * Cargamos anticipadamente los mensajes y miembros del chat para evitar lazy loading (los 2 Join Fetch).
	 */
	@Query("""
			    SELECT DISTINCT cm.chat
			    FROM ChatMembership cm
			    JOIN FETCH cm.chat.messages
			    WHERE cm.appUser = :appUser
			""")
	List<Chat> findChatsWithMessagesAndMembersByAppUser(@Param("appUser") AppUser appUser);
}
