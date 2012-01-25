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

    public PageBotImpl(WebDriver driver, String webAppUrl, String pageFragment) {
        String url = webAppUrl + pageFragment;
        if (!url.equals(driver.getCurrentUrl())) {
            driver.get(url);
        }

        pageTitle = driver.getTitle();
        mainMenuBot = new MainMenuBotImpl(driver);

        footer = (new WebDriverWait(driver, 25)).until(new ExpectedCondition<WebElement>() {
            @Override
            public WebElement apply(WebDriver d) {
                return d.findElement(By.cssSelector("footer.loaded"));
            }
        });
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
