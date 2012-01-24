package org.bitbucket.cursodeconducir.integration;

import java.util.concurrent.TimeUnit;

import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.impl.admin.AdminTestsBotImpl;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import junit.framework.TestCase;

public class TestManagementTest extends TestCase {
    @Test
    public void testOne() throws Exception {
        WebDriver driver = new HtmlUnitDriver(true);
        driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS);
        AdminTestsBot admitTestsBot = new AdminTestsBotImpl(driver, "http://localhost:8080");
        
        driver.close();
    }
}
