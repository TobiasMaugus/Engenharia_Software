import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.core.FileAppender;
import core.DriverFactory;
import core.JJUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInfo;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Date;

public class BaseTest {
	protected WebDriver driver;
	protected JJUtils view;

	@BeforeEach
	public void setup() throws InterruptedException {
		driver = DriverFactory.getDriver();
		view = new JJUtils(driver);
	}

	@BeforeEach
	public void setupLogger(TestInfo testInfo) {
		LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();

		PatternLayoutEncoder encoder = new PatternLayoutEncoder();
		encoder.setContext(context);
		encoder.setPattern("%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n");
		encoder.start();

		String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
		String nomeArquivo = "logs/" + testInfo.getDisplayName() + "_" + timestamp + ".log";

		FileAppender fileAppender = new FileAppender();
		fileAppender.setContext(context);
		fileAppender.setFile(nomeArquivo);
		fileAppender.setEncoder(encoder);
		fileAppender.start();

		// CAST para Logger do Logback
		ch.qos.logback.classic.Logger logbackLogger =
				(ch.qos.logback.classic.Logger) LoggerFactory.getLogger(Produtos_TEST.class);

		logbackLogger.setLevel(ch.qos.logback.classic.Level.TRACE);
		logbackLogger.addAppender(fileAppender);
	}

	@AfterEach
	public void teardown() {
		DriverFactory.killDriver(driver);
	}
}
