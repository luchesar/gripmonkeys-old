package org.bitbucket.cursodeconducir.integration;

import static junit.framework.Assert.*;

import java.util.Collections;

import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.impl.admin.AdminTestsBotImpl;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class TestManagementPageTest {
    private static final String WEB_APP_URL = "webAppUrl";
    private static WebDriver driver;

    @BeforeClass
    public static void initDriver() throws Exception {
        driver = new FirefoxDriver();
    }

    @AfterClass
    public static void exitDriver() throws Exception {
        driver.quit();
        driver = null;
    }

    @Test
    public void testNavigate() throws Exception {
        String webAppUrl = System.getProperty(WEB_APP_URL);
        if (webAppUrl == null) {
            webAppUrl = "http://localhost:8080";
        }
        AdminTestsBot adminTestsBot = new AdminTestsBotImpl(driver, webAppUrl);

        assertEquals("Wrong page title", "Test management", adminTestsBot.getPageTitle());
        assertEquals("Wrong page title", "© Company 2011", adminTestsBot.getCopyRight());
        assertEquals("Wrong title", "Manage Tests", adminTestsBot.getTitle());
        assertEquals("Wrong sub title", "Create new or modify old tests",
                adminTestsBot.getSubTitle());

        assertEquals("No tests expected in the beginning", Collections.emptyList(),
                adminTestsBot.getAllTestTitles());
    }

//    @Test
    public void _testCreatePreviewDeleteATest() throws Exception {
        fail();
    }

//    @Test
    public void _testCreateMultipleAndListThem() throws Exception {
        fail();
    }
    
//    @Test
    public void _testEditImageWithoutReload() throws Exception {
        fail();
    }

//    @Test
    public void _testNavigateCancel() throws Exception {
        fail();
    }

//    @Test
    public void _testNavigateCreate() throws Exception {
        fail();
    }

//    @Test
    public void _testNavigateEdit() throws Exception {
        fail();
    }
}
