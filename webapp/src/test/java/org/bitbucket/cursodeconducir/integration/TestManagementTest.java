package org.bitbucket.cursodeconducir.integration;

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

        driver.get("http://localhost:8080/");
        
        driver.close();
    }
}
