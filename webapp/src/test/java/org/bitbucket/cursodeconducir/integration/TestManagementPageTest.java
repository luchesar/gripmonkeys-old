package org.bitbucket.cursodeconducir.integration;

import static junit.framework.Assert.*;

import java.util.Collections;
import java.util.List;

import org.bitbucket.cursodeconducir.integration.test.bot.api.HomePageBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.MainMenuBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.UnderConstructionPopupBot;
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
    public void testMainMenu() throws Exception {
        AdminTestsBot adminTestsBot = new AdminTestsBotImpl(driver, webAppUrl);
        MainMenuBot mainMenu = adminTestsBot.getMainMenu();

        HomePageBot homePageBot = mainMenu.clickLogo();
        assertEquals("Curso Conducir", homePageBot.getPageTitle());

        assertUnderConstruction(mainMenu.clickCources());
        assertUnderConstruction(mainMenu.clickSignIn());
        UnderConstructionPopupBot underConstructionPopupBot = mainMenu.clickRegister();
        underConstructionPopupBot.close();
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
            assertTrue(adminTestsBot.isPublished(testTitle));

            editTestBot = adminTestsBot.clickTestTitle(testTitle);

            org.bitbucket.cursodeconducir.services.entity.Test pageTest = editTestBot.getTest();

            assertEquals(testTitle, pageTest.getTitle());

            assertFalse("old image '" + oldImage + "' did not get changed ",
                    oldImage.equals(pageTest.getImage()));
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
    public void testEditExistingTest() throws Exception {
        AdminTestsBot adminTestsBot = new AdminTestsBotImpl(driver, webAppUrl);
        assertEquals("No tests expected in the beginning", Collections.emptyList(),
                adminTestsBot.getAllTestTitles());

        String imageFile = getClass().getResource("testImage.jpg").getFile();
        String imageFile1 = getClass().getResource("testImage1.png").getFile();
        org.bitbucket.cursodeconducir.services.entity.Test test1 = new org.bitbucket.cursodeconducir.services.entity.Test(
                "title1", imageFile, "description1", Lists.newArrayList("asnwer11", "answer12",
                        "answer13"), 2, "explanation1", Lists.<String> newArrayList());

        org.bitbucket.cursodeconducir.services.entity.Test test2 = new org.bitbucket.cursodeconducir.services.entity.Test(
                "title2", imageFile1, "description2", Lists.newArrayList("asnwer21", "answer22",
                        "answer23"), 1, "explanation2", Lists.<String> newArrayList());

        org.bitbucket.cursodeconducir.services.entity.Test createdTest = adminTestsBot
                .createTest(test1);
        try {
            adminTestsBot.updateTest(test1.getTitle(), test2);
            assertEquals(Lists.newArrayList(test2.getTitle()), adminTestsBot.getAllTestTitles());
            assertEquals(test2.getDescription(), adminTestsBot.getTestDescription(test2.getTitle()));

            EditTestBot editTestBot = adminTestsBot.clickTestTitle(test2.getTitle());

            org.bitbucket.cursodeconducir.services.entity.Test updatedTest = editTestBot.getTest();

            assertEquals(test2.getTitle(), updatedTest.getTitle());

            assertFalse("old image '" + createdTest.getImage() + "' did not get changed ",
                    createdTest.getImage().equals(updatedTest.getImage()));
            assertEquals(test2.getDescription(), updatedTest.getDescription());
            assertEquals(test2.getPossibleAnswers(), updatedTest.getPossibleAnswers());
            assertEquals(test2.getCorrectAnswerIndex(), updatedTest.getCorrectAnswerIndex());
            assertEquals(test2.getExplanation(), updatedTest.getExplanation());
            adminTestsBot = editTestBot.cancel();
        } finally {
            try {
                adminTestsBot.deleteTest(test2.getTitle(), true);
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

    @Test
    public void testNotApplyUploadedImage() throws Exception {
        String testTitle = "test1";

        AdminTestsBot adminTestsBot = new AdminTestsBotImpl(driver, webAppUrl);
        List<String> allTestTitles = cleanUpTestingTest(testTitle, adminTestsBot);

        assertEquals("No tests expected in the beginning", Collections.emptyList(), allTestTitles);

        EditTestBot editTestBot = adminTestsBot.create();

        editTestBot.setTestTitle(testTitle);
        String oldImage = editTestBot.getTest().getImage();

        EditTestImageBot testImageBot = editTestBot.editImage();
        assertEquals(oldImage, testImageBot.getImageUrl());
        testImageBot.uploadImage(getClass().getResource("testImage.jpg").getFile(), false);
        assertFalse(oldImage.equals(testImageBot.getImageUrl()));

        assertEquals(oldImage, editTestBot.getTest().getImage());
    }

    @Test
    public void testCreateMultipleAndListThem() throws Exception {
        AdminTestsBot adminTestsBot = new AdminTestsBotImpl(driver, webAppUrl);
        assertEquals("No tests expected in the beginning", Collections.emptyList(),
                adminTestsBot.getAllTestTitles());

        String imageFile = getClass().getResource("testImage.jpg").getFile();
        String imageFile1 = getClass().getResource("testImage1.png").getFile();
        org.bitbucket.cursodeconducir.services.entity.Test test1 = new org.bitbucket.cursodeconducir.services.entity.Test(
                "title1", imageFile, "description1", Lists.newArrayList("asnwer11", "answer12",
                        "answer13"), 2, "explanation1", Lists.<String> newArrayList());

        org.bitbucket.cursodeconducir.services.entity.Test test2 = new org.bitbucket.cursodeconducir.services.entity.Test(
                "title2", imageFile1, "description2", Lists.newArrayList("asnwer21", "answer22",
                        "answer23"), 1, "explanation2", Lists.<String> newArrayList());

        adminTestsBot.createTest(test1);
        try {
            adminTestsBot.createTest(test2);
            try {
                assertEquals(Lists.newArrayList(test1.getTitle(), test2.getTitle()),
                        adminTestsBot.getAllTestTitles());

                assertEquals(test1.getDescription(),
                        adminTestsBot.getTestDescription(test1.getTitle()));
                assertEquals(test2.getDescription(),
                        adminTestsBot.getTestDescription(test2.getTitle()));

                assertTrue(adminTestsBot.isPublished(test1.getTitle()));
                assertTrue(adminTestsBot.isPublished(test2.getTitle()));

                adminTestsBot.unpublish(test1.getTitle());
                assertFalse(adminTestsBot.isPublished(test1.getTitle()));
                assertTrue(adminTestsBot.isPublished(test2.getTitle()));

                adminTestsBot.unpublish(test2.getTitle());
                assertFalse(adminTestsBot.isPublished(test1.getTitle()));
                assertFalse(adminTestsBot.isPublished(test2.getTitle()));

                adminTestsBot.publish(test1.getTitle());
                assertTrue(adminTestsBot.isPublished(test1.getTitle()));
                assertFalse(adminTestsBot.isPublished(test2.getTitle()));

                adminTestsBot.publish(test2.getTitle());
                assertTrue(adminTestsBot.isPublished(test1.getTitle()));
                assertTrue(adminTestsBot.isPublished(test2.getTitle()));
            } finally {
                try {
                    adminTestsBot.deleteTest(test2.getTitle(), true);
                } catch (Exception e) {
                    // Swallow it because we want to see the real error
                }
            }
        } finally {
            try {
                adminTestsBot.deleteTest(test1.getTitle(), true);
            } catch (Exception e) {
                // Swallow it because we want to see the real error
            }
        }
    }
    
    @Test
    public void testPreviewATest() throws Exception {
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
    }
    
    @Test
    public void testBackForthNavigation() throws Exception {
        fail();
    }

    private void assertUnderConstruction(UnderConstructionPopupBot aClickCources) {
        try {
            assertEquals("En construcción", aClickCources.getTitle());
        } finally {
            aClickCources.x();
        }
    }

    private List<String> cleanUpTestingTest(String testTitle, AdminTestsBot adminTestsBot) {
        List<String> allTestTitles = adminTestsBot.getAllTestTitles();
        if (allTestTitles.contains(testTitle)) {
            adminTestsBot.deleteTest(testTitle, true);
            allTestTitles = adminTestsBot.getAllTestTitles();
        }
        return allTestTitles;
    }
}
