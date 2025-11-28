package core;

import com.google.common.io.Files;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.time.Duration;
import java.util.List;

public class JJUtils {
	private static WebDriverWait wait;
	private static WebElement element;

	private static final int DEFAULT_WAIT = 10;

	public JJUtils(WebDriver driver) {
		wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_WAIT));
	}

	public void getUrl() {

	}

	public void performLogin(String username, String password) {
		this.fill("username", username);
		this.fill("password", password);
		this.click("entrar-btn");
	}

	public void click(String elementId) {
		wait.until(ExpectedConditions.elementToBeClickable(By.id(elementId))).click();
	}

	public void fill(String elementId, String value) {
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementId))).clear();
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementId))).sendKeys(value);
	}

	public boolean asssertTextInElement(String elementId, String value) {
		return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementId))).getText().contains(value);
	}

	public boolean assertElementExists(String elementId) {
		return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementId))).isDisplayed();
	}

	public String getElementString(String elementId) {
		return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementId))).getText();
	}

	public void handleAllert() {
		try {
			Alert alert = wait.until(ExpectedConditions.alertIsPresent());
			alert.accept();
		} catch (Exception e) {
		}
	}

}
