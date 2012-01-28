package org.bitbucket.cursodeconducir.integration;

import static junit.framework.Assert.*;

import java.util.Collections;
import java.util.List;

import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestImageBot;
import org.bitbucket.cursodeconducir.integration.test.bot.impl.admin.AdminTestsBotImpl;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.google.common.collect.Lists;

public class TestManagementPageTest {
    private static final String WEB_APP_URL = "webAppUrl";
    private static WebDriver driver;
    private static String webAppUrl;

    @BeforeClass
    public static void initDriver() throws Exception {
        driver = new FirefoxDriver();
        webAppUrl = System.getProperty(WEB_APP_URL);
        if (webAppUrl == null) {
            webAppUrl = "http://localhost:8080";
        }
    }

    @AfterClass
    public static void exitDriver() throws Exception {
        driver.quit();
        driver = null;
    }

    @Test
    public void testNavigate() throws Exception {
        AdminTestsBot adminTestsBot = new AdminTestsBotImpl(driver, webAppUrl);

        assertEquals("Wrong page title", "Test management", adminTestsBot.getPageTitle());
        assertEquals("Wrong page title", "© Company 2011", adminTestsBot.getCopyRight());
        assertEquals("Wrong title", "Manage Tests", adminTestsBot.getTitle());
        assertEquals("Wrong sub title", "Create new or modify old tests",
                adminTestsBot.getSubTitle());

        assertEquals("No tests expected in the beginning", Collections.emptyList(),
                adminTestsBot.getAllTestTitles());
    }

    @Test
    public void testCreatePreviewDeleteATest() throws Exception {
        String testTitle = "test1";
        String description = "test1 desription";
        String answer0 = "answer0";
        String answer1 = "answer1";
        String answer2 = "answer2";
        String explanation = "explanation";

        AdminTestsBot adminTestsBot = new AdminTestsBotImpl(driver, webAppUrl);
        List<String> allTestTitles = cleanUpTestingTest(testTitle, adminTestsBot);

        assertEquals("No tests expected in the beginning", Collections.emptyList(), allTestTitles);

        EditTestBot editTestBot = adminTestsBot.create();

        editTestBot.setTestTitle(testTitle);
        editTestBot.setTestDescription(description);
        editTestBot.setPossibleAnswer(0, answer0);
        editTestBot.setPossibleAnswer(1, answer1);
        editTestBot.setPossibleAnswer(2, answer2);
        editTestBot.setCorrectAnswer("B");
        editTestBot.setExplanation(explanation);
        String oldImage = editTestBot.getTest().getImage();

        EditTestImageBot testImageBot = editTestBot.editImage();
        assertEquals(oldImage, testImageBot.getImageUrl());
        testImageBot.uploadImage(getClass().getResource("testImage.jpg").getFile(), true);
        assertFalse(oldImage.equals(testImageBot.getImageUrl()));

        adminTestsBot = editTestBot.save();
        try {
            allTestTitles = adminTestsBot.getAllTestTitles();
            assertEquals("The test did not get saved", Lists.newArrayList(testTitle), allTestTitles);

            assertEquals(description, adminTestsBot.getTestDescription(testTitle));

            editTestBot = adminTestsBot.clickTestTitle(testTitle);

            org.bitbucket.cursodeconducir.services.entity.Test pageTest = editTestBot.getTest();

            assertEquals(testTitle, pageTest.getTitle());

            assertFalse(oldImage.equals(pageTest.getImage()));
            assertEquals(description, pageTest.getDescription());
            assertEquals(Lists.newArrayList(answer0, answer1, answer2),
                    pageTest.getPossibleAnswers());
            assertEquals(1, pageTest.getCorrectAnswerIndex());
            assertEquals(explanation, pageTest.getExplanation());
            adminTestsBot = editTestBot.cancel();
        } finally {
            try {
                adminTestsBot.deleteTest(testTitle, true);
                assertEquals("Did not clean up the test properly", Collections.emptyList(),
                        adminTestsBot.getAllTestTitles());
            } catch (Exception e) {
                // Swallow it because we want to see the real error
            }
        }
    }

    @Test
    public void testCancelTestCreation() throws Exception {
        String testTitle = "test1";

        AdminTestsBot adminTestsBot = new AdminTestsBotImpl(driver, webAppUrl);
        List<String> allTestTitles = cleanUpTestingTest(testTitle, adminTestsBot);
        assertEquals("No tests expected in the beginning", Collections.emptyList(), allTestTitles);
        EditTestBot editTestBot = adminTestsBot.create();
        editTestBot.setTestTitle(testTitle);

        adminTestsBot = editTestBot.cancel();
        assertEquals("Cancel editing a test did not work", Collections.emptyList(), allTestTitles);
    }

    /*@Test
    public void testNotApplyUploadedImage() throws Exception {
        fail();
    }

    @Test
    public void testCreateMultipleAndListThem() throws Exception {
        fail();
    }

    @Test
    public void testEditImageWithoutReload() throws Exception {
        fail();
    }

    @Test
    public void testNavigateCancel() throws Exception {
        fail();
    }

    @Test
    public void testNavigateCreate() throws Exception {
        fail();
    }

    @Test
    public void testNavigateEdit() throws Exception {
        fail();
    }*/

    private List<String> cleanUpTestingTest(String testTitle, AdminTestsBot adminTestsBot) {
        List<String> allTestTitles = adminTestsBot.getAllTestTitles();
        if (allTestTitles.contains(testTitle)) {
            adminTestsBot.deleteTest(testTitle, true);
            allTestTitles = adminTestsBot.getAllTestTitles();
        }
        return allTestTitles;
    }
}
