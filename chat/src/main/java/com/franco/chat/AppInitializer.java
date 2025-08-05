package com.franco.chat;

import com.franco.chat.appuser.AppUserService;
import com.franco.chat.chat.ChatDTO;
import com.franco.chat.chat.ChatService;
import com.franco.chat.message.Message;
import com.franco.chat.message.MessageRepository;
import com.franco.chat.message.MessageService;
import com.franco.chat.message.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
@Log
public class AppInitializer implements CommandLineRunner {
	@Value("${sample.data}")
	private boolean sampleData;

	private final AppUserService appUserService;
	private final ChatService chatService;
	private final MessageService messageService;

	@Override
	public void run(String... args) {
		if (sampleData) {
			this.appUserService.createAppUser("Pepito");
			this.appUserService.createAppUser("Belal");
			this.appUserService.createAppUser("fran");
			this.appUserService.createAppUser("Test 1");
			this.appUserService.createAppUser("HolaComoEstas");
			this.appUserService.createAppUser("YoBienYVos");

			ResponseDTO chatResponse = this.chatService.createChat(
					"Chat from app init",
					"Pepito",
					new ArrayList<>(List.of("Belal"))
			);
			ChatDTO chatDTO = (ChatDTO) chatResponse.content();

			this.messageService.createMessage("First message", "Pepito", chatDTO.id(), MessageType.PERSONAL);
			this.messageService.createMessage("Oh, what a nice batman message", "Belal", chatDTO.id(), MessageType.PERSONAL);
			this.messageService.createMessage("Why?", "Pepito", chatDTO.id(), MessageType.PERSONAL);
			this.messageService.createMessage("Because it has no parents", "Belal", chatDTO.id(), MessageType.PERSONAL);
			this.messageService.createMessage(":)", "Belal", chatDTO.id(), MessageType.PERSONAL);
			this.messageService.createMessage("Pepito left the group", "Pepito", chatDTO.id(), MessageType.GENERAL);


			System.out.println("\n\n\n\n");
			System.out.println("----------------------" + "Mock data created" + "----------------------");
			System.out.println("\n\n\n\n");
		}
		System.out.println("\n\n\n\n");
		System.out.println("----------------------" + "App started" + "----------------------");
		System.out.println("\n\n\n\n");
	}
}
