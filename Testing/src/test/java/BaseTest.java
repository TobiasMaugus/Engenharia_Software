import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.core.FileAppender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInfo;
import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.Logger;
import core.DriverFactory;
import core.JJUtils;
import org.junit.jupiter.api.AfterEach;
import org.openqa.selenium.WebDriver;


import java.text.SimpleDateFormat;
import java.util.Date;

public class BaseTest {
	protected WebDriver driver;
	protected JJUtils view;
	private static final String LOG_DIR = "logs/test_logs/";
	private static final Logger rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);

//	@BeforeEach
//	public void setupLogger(TestInfo testInfo) {
//		LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
//
//		PatternLayoutEncoder encoder = new PatternLayoutEncoder();
//		encoder.setContext(context);
//		encoder.setPattern("%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n");
//		encoder.start();
//
//		String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
//		String nomeArquivo = "logs/" + testInfo.getDisplayName() + "_" + timestamp + ".log";
////
////		FileAppender fileAppender = new FileAppender();
////		fileAppender.setContext(context);
////		fileAppender.setFile(nomeArquivo);
////		fileAppender.setEncoder(encoder);
////		fileAppender.start();
////
////		// CAST para Logger do Logback
////		ch.qos.logback.classic.Logger logbackLogger =
////				(ch.qos.logback.classic.Logger) LoggerFactory.getLogger(Produtos_TEST.class);
////
////		logbackLogger.setLevel(ch.qos.logback.classic.Level.TRACE);
////		logbackLogger.addAppender(fileAppender);
//	}

	@BeforeEach
	public void setupTestLog(TestInfo testInfo) {
		LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();
		lc.stop();
		FileAppender fileAppender = new FileAppender();
		String testFileName = testInfo.getTestClass().get().getSimpleName()
				+ "_"
				+ testInfo.getTestMethod().get().getName()
				+ ".log";

		fileAppender.setFile(LOG_DIR + testFileName);
		fileAppender.setContext(lc);
		fileAppender.setAppend(true);
		PatternLayoutEncoder encoder = new PatternLayoutEncoder();
		encoder.setPattern("%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n");
		encoder.setContext(lc);
		encoder.start();

		fileAppender.setEncoder(encoder);
		fileAppender.start();
		rootLogger.detachAndStopAllAppenders();
		rootLogger.addAppender(fileAppender);
		rootLogger.setLevel(ch.qos.logback.classic.Level.TRACE);
		lc.start();

		rootLogger.info("Log para o teste: {} iniciado.", testFileName);
	}

	@BeforeEach
	public void setup() throws InterruptedException {
		driver = DriverFactory.getDriver();
		view = new JJUtils(driver);
	}


	@AfterEach
	public void teardown() {
		DriverFactory.killDriver(driver);
	}
}
