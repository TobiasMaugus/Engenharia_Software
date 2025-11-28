package core;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class WebUtils {

	public static void fill(WebDriverWait wait, String elementID, String text) {
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementID))).click();
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(elementID))).sendKeys(text);
	}

	public static void click(WebDriverWait wait, By elementLocator) {
		wait.until(ExpectedConditions.visibilityOfElementLocated(elementLocator));
		wait.until(ExpectedConditions.elementToBeClickable(elementLocator)).click();
	}

	public static String getTextFromElement(WebDriverWait wait, By elementLocator) {
		return wait.until(ExpectedConditions.presenceOfElementLocated(elementLocator)).getText();
	}

	public static void scrollToElement(WebDriver driver, By elementLocator) {
		Actions actions = new Actions(driver);
		actions.scrollToElement(
				driver.findElement(elementLocator)
		).perform();
	}

	public static void findElement(WebDriver driver, By elementLocator) {
		driver.findElement(elementLocator);
	}

}
