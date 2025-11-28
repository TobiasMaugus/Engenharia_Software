package core;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

public class  JJUtils {
	private static final Logger LOGGER = LoggerFactory.getLogger(JJUtils.class);
	private static WebDriverWait wait;

	private static final int DEFAULT_WAIT = 10;

	public JJUtils(WebDriver driver) {
		wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_WAIT));
	}

	public void click(String elementId) {
		this.wait.until(ExpectedConditions.elementToBeClickable(By.id(elementId))).click();
	}

	public void fill(String elementId, String value) {
		this.wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementId))).sendKeys(value);
	}

	public boolean asssertTextInElement(String elementId, String value) {
		return this.wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementId))).getText().contains(value);
	}

	public String getElementString(String elementId) {
		return this.wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementId))).getText();
	}

}
