package org.bitbucket.cursodeconducir.integration;

import static junit.framework.Assert.*;

import java.util.Collections;

import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestBot;
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
        AdminTestsBot adminTestsBot = new AdminTestsBotImpl(driver, webAppUrl);
        assertEquals("No tests expected in the beginning", Collections.emptyList(),
                adminTestsBot.getAllTestTitles());
        
        EditTestBot editTestBot = adminTestsBot.create();
        String testTitle = "test1";
        String description = "test1 desription";
        
        editTestBot.setTestTitle(testTitle);
        editTestBot.setTestDescription(description);
        
        adminTestsBot = editTestBot.save();
        try {
            assertEquals("The test did not get saved", Lists.newArrayList(testTitle),
                    adminTestsBot.getAllTestTitles());
            
            assertEquals(description, adminTestsBot.getTestDescription(testTitle));
        } finally {
            adminTestsBot.deleteTest(testTitle).accept();
        }
//        assertEquals("Did not clean up the test properly", Collections.emptyList(),
//                adminTestsBot.getAllTestTitles());
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
    }
}
