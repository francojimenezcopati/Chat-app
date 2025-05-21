package com.franco.chat;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log
public class AppInitializer implements CommandLineRunner {

	@Value("${sample.data}")
	private boolean sampleData;

	@Override
	public void run(String... args) {
		if (sampleData) {

			System.out.println("\n\n\n\n");
			System.out.println("----------------------" + "Mock data created" + "----------------------");
			System.out.println("\n\n\n\n");
		}
	}
}
