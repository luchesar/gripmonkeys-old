package org.bitbucket.cursodeconducir;

import java.io.IOException;
import java.net.MalformedURLException;

import org.junit.BeforeClass;
import org.junit.Test;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class HtmlUnitJsUnitRunner1 {
	private static final String WEB_APP_URL = "webAppUrl";
	private static final String DEFAULT_TEST_URL = "http://localhost:9810/test/index/";
	private static WebClient webClient;
	private static String webAppUrl;
	private JsUnitTestRunner jsUnitTestRunner = new JsUnitTestRunner();

	@BeforeClass
	public static void setUpClass() {
		webClient = new WebClient(BrowserVersion.INTERNET_EXPLORER_6);
		webAppUrl = System.getProperty(WEB_APP_URL);
		if (webAppUrl == null) {
			webAppUrl = DEFAULT_TEST_URL;
		}
	}

	@Test
	public void lessonFormTest() throws Exception {
		runTest("entity/lesson/lessonform_test.html");
	}
	
	@Test
	public void imageUploadTest() throws Exception {
		runTest("http/imageupload_test.html");
	}
	
	@Test
	public void lessonsTest() throws Exception {
		runTest("admin/lessons_test.html");
	}
	
	@Test
	public void questionsTest() throws Exception {
		runTest("admin/questions_test.html");
	}
	@Test
	public void questionFormTest() throws Exception {
		runTest("entity/question/questionform_test.html");
	}
	
	@Test
	public void entityListTest() throws Exception {
		runTest("entity/entitylist_test.html");
	}
	
	@Test
	public void pagedEntityListTest() throws Exception {
		runTest("entity/pagedentitylist_test.html");
	}
	
	@Test
	public void questionPreviewTest() throws Exception {
		runTest("entity/question/testPreview_test.html");
	}
	
	@Test
	public void dialogsTest() throws Exception {
		runTest("dialogs_test.html");
	}

	private void runTest(String testPath) throws IOException,
			MalformedURLException, Exception {
		HtmlPage page = webClient.getPage(webAppUrl + testPath);
		try {
			jsUnitTestRunner.runTest(page);
		} finally {
			page.cleanUp();
		}
	}
	/*
	 * private static final String TEST_URL = "webAppUrl"; private static final
	 * String DEFAULT_TEST_URL = "http://localhost:9810/test/index/"; private
	 * static HtmlUnitDriver driver; private static String webAppUrl; private
	 * JsUnitTestRunner jsUnitTestRunner = new JsUnitTestRunner();
	 * 
	 * @BeforeClass public static void initDriver() throws Exception { driver =
	 * new HtmlUnitDriver(BrowserVersion.FIREFOX_3_6);
	 * driver.setJavascriptEnabled(true); webAppUrl =
	 * System.getProperty(TEST_URL); if (webAppUrl == null) { webAppUrl =
	 * DEFAULT_TEST_URL; } }
	 * 
	 * @AfterClass public static void exitDriver() throws Exception {
	 * driver.quit(); }
	 * 
	 * @Test public void runAllJsUnitTests() throws Exception {
	 * jsUnitTestRunner.runTest(driver, webAppUrl +
	 * "entity/lesson/lessonform_test.html"); }
	 */
}
