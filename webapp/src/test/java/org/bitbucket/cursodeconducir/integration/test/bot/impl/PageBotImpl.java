package org.bitbucket.cursodeconducir.integration.test.bot.impl;

import static junit.framework.Assert.*;

import org.bitbucket.cursodeconducir.integration.test.bot.api.MainMenuBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.PageBot;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PageBotImpl implements PageBot {
    private String pageTitle;
    private MainMenuBotImpl mainMenuBot;
    private WebElement footer;

    public PageBotImpl(WebDriver driver) {
        pageTitle = driver.getTitle();
        mainMenuBot = new MainMenuBotImpl(driver);
        footer = driver.findElement(By.tagName("footer"));
        
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
