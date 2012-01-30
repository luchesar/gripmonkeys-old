package org.bitbucket.cursodeconducir.integration.test.bot.impl;

import static junit.framework.Assert.*;
import static org.bitbucket.cursodeconducir.integration.test.bot.WebDriverUtils.*;

import org.bitbucket.cursodeconducir.integration.test.bot.api.MainMenuBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.PageBot;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PageBotImpl implements PageBot {
    protected String pageTitle;
    protected MainMenuBotImpl mainMenuBot;
    protected WebElement footer;
    protected WebDriver driver;
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

        initPage();
    }

    private final void initPage() {
        pageTitle = driver.getTitle();
        mainMenuBot = new MainMenuBotImpl(driver, webAppUrl);

        footer = findElement(driver, By.cssSelector("footer.loaded"), 25);
        assertNotNull(pageTitle);
        assertNotNull(mainMenuBot);
        assertNotNull(footer);
    }
    
    protected void init() {
        initPage();
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
