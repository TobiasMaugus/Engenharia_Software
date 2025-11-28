package core;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;


import org.openqa.selenium.support.events.EventFiringDecorator;

import java.sql.Driver;
import java.time.Duration;

public class DriverFactory {
	private static final boolean HEADLESS = false;

	public static WebDriver getDriver() {
		WebDriverManager.chromedriver().setup();

		ChromeOptions options = new ChromeOptions();
		options.addArguments("user-data-dir=/home/luisturola/chrome/chrome-test-profile");
		options.addArguments("--no-sandbox");
		options.addArguments("--disable-dev-shm-usage");
		options.addArguments("--disable-blink-features=AutomationControlled");

		if (HEADLESS) {
			options.addArguments("--window-size=1920,1080");
			options.addArguments("--headless=new");
		} else {
			options.addArguments("--start-maximized");
		}

		return new ChromeDriver(options);
	}

	public static void killDriver(WebDriver driver) {
		if (driver != null) {
			driver.quit();
		}
	}
}
