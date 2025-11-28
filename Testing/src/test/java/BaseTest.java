import core.DriverFactory;
import core.JJUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class BaseTest {
	protected WebDriver driver;
	protected WebDriverWait wait;
	protected JJUtils view;

	@BeforeEach
	public void setup() {
		driver = DriverFactory.getDriver();
		wait = new WebDriverWait(driver, Duration.ofSeconds(10));
	}

	@AfterEach
	public void teardown() {
		DriverFactory.killDriver(driver);
	}
}
