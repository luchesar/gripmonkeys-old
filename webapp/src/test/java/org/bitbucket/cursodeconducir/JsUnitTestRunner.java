package org.bitbucket.cursodeconducir;

import static java.lang.System.currentTimeMillis;
import static org.junit.Assert.fail;

import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class JsUnitTestRunner {
	public void runTest(HtmlPage page) throws Exception {
		waitForResult(page);
		checkResult(page);
	}

	private void waitForResult(HtmlPage page) throws Exception {
		waitFor(page, new Condition() {
			public boolean exec(HtmlPage page) throws Exception {
				return (Boolean) page
						.executeJavaScript(
								"window.G_testRunner && window.G_testRunner.isFinished()")
						.getJavaScriptResult();
			}
		}, 15000, 600);
	}

	private void checkResult(HtmlPage page) {
		if (!isSuccess(page)) {
			Object result = page.executeJavaScript("window.G_testRunner.getReport()").getJavaScriptResult();
			fail("Some junit tests failed log:\n" + result);
		}
	}

	private boolean isSuccess(HtmlPage page) {
		return (Boolean) page.executeJavaScript(
				"window.G_testRunner.isSuccess()").getJavaScriptResult();
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

	/*
	 * public void runTest(WebDriver driver, String testUrl) throws Exception {
	 * driver.get(testUrl); waitForResult(driver); checkResult(driver); }
	 * 
	 * private void waitForResult(WebDriver driver) { new WebDriverWait(driver,
	 * 1000).until(new ExpectedCondition<Object>() {
	 * 
	 * @Override public Object apply(WebDriver d) { return ((JavascriptExecutor)
	 * d)
	 * .executeScript("window.G_testRunner && window.G_testRunner.isFinished()"
	 * ); } }); }
	 * 
	 * private void checkResult(WebDriver driver) { if (!isSuccess(driver)) {
	 * Object result = ((JavascriptExecutor) driver)
	 * .executeScript("window.G_testRunner.getReport()");
	 * fail("Some junit tests failed log:\n" + result); } }
	 * 
	 * private boolean isSuccess(WebDriver driver) { return (Boolean)
	 * ((JavascriptExecutor) driver)
	 * .executeScript("window.G_testRunner.isSuccess()"); }
	 */
}
