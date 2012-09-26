package org.bitbucket.cursodeconducir;

import static java.lang.System.currentTimeMillis;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;

import org.junit.BeforeClass;
import org.junit.Test;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class HtmlUnitJsUnitRunner {
	private static final String WEB_APP_URL = "webAppUrl";
	private static final String DEFAULT_TEST_URL = "http://localhost:9810/test/index/all";
	private static WebClient webClient;
	private static String webAppUrl;

	@BeforeClass
	public static void setUpClass() {
		webClient = new WebClient(BrowserVersion.INTERNET_EXPLORER_8);
		webAppUrl = System.getProperty(WEB_APP_URL);
		if (webAppUrl == null) {
			webAppUrl = DEFAULT_TEST_URL;
		}
	}

	@Test
	public void runAllJsUnitTests() throws Exception {
		HtmlPage testPage = webClient.getPage(webAppUrl);
		
		DomNodeList<HtmlElement> buttons = testPage.getElementsByTagName("button");
		assertEquals("The page has less or more then two buttons", 2, buttons.size());
		final HtmlElement startButton = buttons.get(0);
		final HtmlElement stopButton = buttons.get(1);
		
		waitFor(testPage, new Condition() {
			public boolean exec(HtmlPage htmlPage) throws Exception {
				return DomElement.ATTRIBUTE_NOT_DEFINED.equals(startButton.getAttribute("disabled"));
			}
		}, 30000, 600);
		
		assertEquals(DomElement.ATTRIBUTE_NOT_DEFINED, startButton.getAttribute("disabled"));
		assertNotNull(stopButton.getAttribute("disabled"));
		assertFalse( DomElement.ATTRIBUTE_NOT_DEFINED.equals(stopButton.getAttribute("disabled")));
		assertFalse( DomElement.ATTRIBUTE_VALUE_EMPTY.equals(stopButton.getAttribute("disabled")));
		
		startButton.click();
		
		waitFor(testPage, new Condition() {
			public boolean exec(HtmlPage htmlPage) throws Exception {
				System.out.println(htmlPage.asXml());
				HtmlElement activeTab = (HtmlElement) htmlPage.getFirstByXPath("//*[@class=\"goog-testrunner-reporttab goog-testrunner-activetab\"]");
				if (activeTab != null) {
					return true;
				}
				return false;
			}
		}, 60000, 600);
		
		HtmlElement log = (HtmlElement) testPage.getFirstByXPath("//*[@class=\"goog-testrunner-log\"]");
		HtmlElement summary = (HtmlElement) testPage.getFirstByXPath("//*[@class=\"goog-testrunner-progress-summary\"]");
		HtmlElement report = (HtmlElement) testPage.getFirstByXPath("//*[@class=\"goog-testrunner-log\"]");
		
		
		if (hasErrors(testPage)) {
			fail("Some junit tests failed \nlog:" + log.asText() + "\nreport:" 
							+ report.asText() + "\nsummery:" + summary.asText());
		}
	}

	private boolean hasErrors(HtmlPage page) {
		HtmlElement failureReport = (HtmlElement) page
				.getFirstByXPath("//*[@class=\"goog-testrunner-report-failure\"]");
		if (failureReport != null) {
			return true;
		}
		return false;
	}

	private void waitFor(HtmlPage htmlPage, Condition condition, long timeout,
			long interval) throws Exception {
		for (long start = currentTimeMillis(); start + timeout > currentTimeMillis();) {
			if (condition.exec(htmlPage)) {
				return;
			}
			Thread.sleep(interval);
		}
		fail("Condition not met after " + timeout + "micro seconds");
	}

	private interface Condition {
		public boolean exec(HtmlPage page) throws Exception;
	}
}
