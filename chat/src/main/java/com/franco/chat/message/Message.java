package com.franco.chat.message;

import com.franco.chat.appuser.AppUser;
import com.franco.chat.chat.Chat;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class Message {
	@SequenceGenerator(
			name = "message_sequence_generator",
			sequenceName = "message_id_sequence",
			allocationSize = 1
	)
	@GeneratedValue(
			strategy = GenerationType.SEQUENCE,
			generator = "message_sequence_generator"
	)
	@Id
	private Long id;
	private String content;
	private Date createdAt;
	private String username;
	@Enumerated(EnumType.STRING)
	private MessageType type;
	@Nullable
	private String imageURL;

	@ManyToOne
	private AppUser appUser;
	@ManyToOne
	private Chat chat;

	public Message(String content, String username, AppUser appUser, Chat chat, MessageType type) {
		this.content = content;
		this.createdAt = new Date();
		this.username = username;
		this.appUser = appUser;
		this.chat = chat;
		this.type = type;
		this.imageURL = null;
	}

	public Message(String content, String username, AppUser appUser, Chat chat, MessageType type, String imageURL) {
		this(content, username, appUser, chat, type);
		this.imageURL=imageURL;
	}

}
