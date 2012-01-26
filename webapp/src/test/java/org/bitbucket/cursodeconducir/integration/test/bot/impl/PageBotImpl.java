package org.bitbucket.cursodeconducir.integration.test.bot.impl;

import static org.bitbucket.cursodeconducir.integration.test.bot.WebDriverUtils.*;
import static junit.framework.Assert.*;

import org.bitbucket.cursodeconducir.integration.test.bot.api.MainMenuBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.PageBot;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PageBotImpl implements PageBot {
    protected final String pageTitle;
    protected final MainMenuBotImpl mainMenuBot;
    protected final WebElement footer;
    protected final WebDriver driver;
    protected final String webAppUrl;
    protected final String pagePath;

    public PageBotImpl(WebDriver aDriver, String aWebAppUrl, String aPagePath) {
        driver = aDriver;
        webAppUrl = aWebAppUrl;
        pagePath = aPagePath;
        String url = aWebAppUrl + aPagePath;
        if (!url.equals(driver.getCurrentUrl())) {
            driver.get(url);
        }

        pageTitle = driver.getTitle();
        mainMenuBot = new MainMenuBotImpl(driver);

        footer = findElement(driver, By.cssSelector("footer.loaded"), 25);
        assertNotNull(pageTitle);
        assertNotNull(mainMenuBot);
        assertNotNull(footer);
    }

    @Override
    public String getPageTitle() {
        return pageTitle;
    }

    @Override
    public MainMenuBot getMainMenu() {
        return mainMenuBot;
    }

    @Override
    public String getCopyRight() {
        return footer.getText();
    }
}
