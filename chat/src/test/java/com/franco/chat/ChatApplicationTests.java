package com.franco.chat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;

@SpringBootTest
@TestExecutionListeners(
		listeners = { TestEnvConfig.class, DependencyInjectionTestExecutionListener.class },
		mergeMode = TestExecutionListeners.MergeMode.MERGE_WITH_DEFAULTS
)
class ChatApplicationTests {

	@Test
	void contextLoads() {
	}

}
