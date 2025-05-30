package com.franco.chat.chat;


import com.franco.chat.appuser.AppUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chats_memberships")
public class ChatMembership {
	@SequenceGenerator(
			name = "chat_membership_sequence_generator",
			sequenceName = "chat_membership_id_sequence",
			allocationSize = 1
	)
	@GeneratedValue(
			strategy = GenerationType.SEQUENCE,
			generator = "chat_membership_sequence_generator"
	)
	@Id
	private Long id;

	@ManyToOne
	private AppUser appUser;

	@ManyToOne
	private Chat chat;

	private boolean isAdmin;

	public ChatMembership(AppUser appUser, Chat chat, boolean isAdmin) {
		this.appUser = appUser;
		this.chat = chat;
		this.isAdmin = isAdmin;
	}
}
