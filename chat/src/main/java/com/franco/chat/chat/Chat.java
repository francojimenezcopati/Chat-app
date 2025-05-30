package com.franco.chat.chat;

import com.franco.chat.appuser.AppUser;
import com.franco.chat.message.Message;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chats")
public class Chat {
	@SequenceGenerator(
			name = "chat_sequence_generator",
			sequenceName = "chat_id_sequence",
			allocationSize = 1
	)
	@GeneratedValue(
			strategy = GenerationType.SEQUENCE,
			generator = "chat_sequence_generator"
	)
	@Id
	private Long id;
	private LocalDate createdAt;
	@ManyToOne
	@JoinColumn(name = "created_by_user_id")
	private AppUser createdBy;

	@OneToMany(
			mappedBy = "chat",
			cascade = CascadeType.ALL,
			orphanRemoval = true
	)
	private List<Message> messages;

	@OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
	private List<ChatMembership> chatMemberships;

//	@ManyToMany
//	@JoinTable(
//			name = "app_user_chat",
//			joinColumns = @JoinColumn(name = "chat_id"),
//			inverseJoinColumns = @JoinColumn(name = "app_user_id")
//	)
//	private List<AppUser> participants;

	public Chat(AppUser creator) {
		this.createdBy = creator;
		this.messages = new ArrayList<>();
		this.createdAt = LocalDate.now();
	}
}
