package com.franco.chat;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupabaseService {

	private final RestTemplate restTemplate = new RestTemplate();
	@Value("${supabase.url}")
	private String supabaseUrl;
	@Value("${supabase.bucket.name}")
	private String supabaseBucketName;
	@Value("${supabase.api.key}")
	private String supabaseApiKey;

	public ResponseDTO uploadImage(MultipartFile imageFile) {
		try {
			System.out.println();
			System.out.println("Started uploading the image");

			String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
			String uploadUrl = supabaseUrl + "/storage/v1/object/" + supabaseBucketName + "/" + fileName;

			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "Bearer " + supabaseApiKey);
			headers.set("apikey", supabaseApiKey);
			headers.setContentType(MediaType.MULTIPART_FORM_DATA);

			ByteArrayResource fileAsResource = new ByteArrayResource(imageFile.getBytes()) {
				@Override
				public String getFilename() {
					return fileName;
				}
			};

			MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
			body.add("file", fileAsResource);

			HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

			restTemplate.postForEntity(uploadUrl, requestEntity, String.class);

			System.out.println("Finish uploading the image");

			String imageUrl = supabaseUrl + "/storage/v1/object/public/" + supabaseBucketName + "/" + fileName;

			return new ResponseDTO(true, "Image successfully uploaded", imageUrl, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseDTO(false, "Error uploading image to Supabase: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}