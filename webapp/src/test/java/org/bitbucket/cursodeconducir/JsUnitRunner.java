package org.bitbucket.cursodeconducir;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.List;
import java.util.NoSuchElementException;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.gargoylesoftware.htmlunit.BrowserVersion;

public class JsUnitRunner {
	private static final String TEST_URL = "webAppUrl";
	private static final String DEFAULT_TEST_URL = "http://localhost:9810/test/index/";
	private static HtmlUnitDriver driver;
	private static String webAppUrl;

	@BeforeClass
	public static void initDriver() throws Exception {
		driver = new HtmlUnitDriver(BrowserVersion.FIREFOX_3_6);
		driver.setJavascriptEnabled(true);
		webAppUrl = System.getProperty(TEST_URL);
		if (webAppUrl == null) {
			webAppUrl = DEFAULT_TEST_URL;
		}
	}

	@AfterClass
	public static void exitDriver() throws Exception {
		driver.quit();
	}

	@Test
	public void runAllJsUnitTests() throws Exception {
		driver.get(webAppUrl);
		List<WebElement> buttons = driver.findElements(By.tagName("button"));
		final WebElement startButton = buttons.get(0);
		final WebElement stopButton = buttons.get(1);
		
		new WebDriverWait(driver, 30).until(new ExpectedCondition<Object>() {
			@Override
			public Object apply(WebDriver d) {
				return Boolean.parseBoolean(stopButton.getAttribute("disabled"));
			}
		});

		assertFalse(Boolean.parseBoolean(startButton.getAttribute("disabled")));
		assertTrue(Boolean.parseBoolean(stopButton.getAttribute("disabled")));

		startButton.click();
		waitForFinish(620);
		
		WebElement report = driver.findElement(By.className("goog-testrunner-report"));
		WebElement summary = driver.findElement(By.className("goog-testrunner-progress-summary"));
		WebElement log = driver.findElement(By.className("goog-testrunner-log"));
		
		
		if (hasErrors()) {
			fail("Some junit tests failed \nlog:" + log.getText() + "\nreport:" 
							+ report.getText() + "\nsummery:" + summary.getText());
		}
	}
	
	private boolean hasErrors() {
		try {
			driver.findElement(By.className("goog-testrunner-report-failure"));
			return true;
		} catch (NoSuchElementException e) {
			return false;
		}
	}

	private Object waitForFinish(int timeOutSeconds) {
		return (new WebDriverWait(driver, timeOutSeconds)).until(new ExpectedCondition<Object>() {
					@Override
					public Object apply(WebDriver d) {
						try {
							System.out.println(d.getPageSource());
							WebElement activeTab = d.findElement(By.className("goog-testrunner-activetab"));
							if ("Report".equals(activeTab.getText())) {
								return true;
							}
						} catch (NoSuchElementException e) {
							// just go on untill there is such an element
						}
						
						return null;
					}
				});
	}
}
