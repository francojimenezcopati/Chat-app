package com.franco.chat.chat;

import com.franco.chat.appuser.AppUser;
import com.franco.chat.message.Message;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chats")
public class Chat {
	@SequenceGenerator(name = "chat_sequence_generator", sequenceName = "chat_id_sequence", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chat_sequence_generator")
	@Id
	private Long id;
	private String name;
	private LocalDate createdAt;
	@ManyToOne
	@JoinColumn(name = "created_by_user_id")
	private AppUser createdBy;

	@OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Message> messages;

	@OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
	private List<ChatMembership> chatMemberships;

	public Chat(String name, AppUser creator) {
		this.name = name;
		this.createdBy = creator;
		this.messages = new ArrayList<>();
		this.createdAt = LocalDate.now();
	}

	@Override
	public String toString() {
		return "Chat={id=" + id + ", name=" + name + ", createdAt=" + createdAt + ", messages(length)=" + messages.size() + ", members(length)=" + chatMemberships.size() + "}";
	}
}
