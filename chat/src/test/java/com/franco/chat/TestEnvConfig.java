package com.franco.chat;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.test.context.TestContext;
import org.springframework.test.context.support.AbstractTestExecutionListener;

public class TestEnvConfig extends AbstractTestExecutionListener {

	@Override
	public void beforeTestClass(TestContext testContext) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);
	}
}
