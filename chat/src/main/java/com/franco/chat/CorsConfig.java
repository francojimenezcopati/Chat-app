package com.franco.chat;

import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableTransactionManagement
public class CorsConfig implements WebMvcConfigurer {

//	@Value("${frontend.url}")
//	private String frontendUrl;
//
//	@Override
//	public void addCorsMappings(CorsRegistry registry) {
//		registry.addMapping("/**")
//				// para hoppscotch cuando uso su extension de chrom ------------------->  vvvvvvvvvvvvv
//				.allowedOrigins(this.frontendUrl, "https://hoppscotch.io",
//						"chrome-extension://amknoiejhlmhancpahfcfcfhllgkpbld")  // Reemplaza con el origen específico
//				.allowedMethods("*")
//				.allowCredentials(true);  // Permitir envío de credenciales
//	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins("*")
				.allowedMethods("*");
	}

}
