package com.franco.chat.appuser;

import com.franco.chat.chat.Chat;
import com.franco.chat.chat.ChatMembership;
import com.franco.chat.message.Message;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "app_users")
public class AppUser {
	@SequenceGenerator(
			name = "app_user_sequence_generator",
			sequenceName = "app_user_id_sequence",
			allocationSize = 1
	)
	@GeneratedValue(
			strategy = GenerationType.SEQUENCE,
			generator = "app_user_sequence_generator"
	)
	@Id
	private Long id;
	private String username;
	private LocalDate createdAt;

	@OneToMany(
			mappedBy = "appUser",
			cascade = CascadeType.ALL,
			orphanRemoval = true
	)
	private List<Message> messages;

	@OneToMany(mappedBy = "appUser", cascade = CascadeType.ALL)
	private List<ChatMembership> chatMemberships;

	public AppUser(String username) {
		this.username = username;
		this.createdAt = LocalDate.now();
	}
}
