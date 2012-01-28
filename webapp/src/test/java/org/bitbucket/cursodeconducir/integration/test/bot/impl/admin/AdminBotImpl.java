package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import static junit.framework.Assert.*;
import static org.bitbucket.cursodeconducir.integration.TestConstants.*;

import org.apache.commons.lang.StringUtils;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminBot;
import org.bitbucket.cursodeconducir.integration.test.bot.impl.PageBotImpl;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class AdminBotImpl extends PageBotImpl implements AdminBot {
    protected final WebElement titleElement;
    protected final WebElement titleHintElement;
    protected final WebElement testFeedbackContent;

    public AdminBotImpl(WebDriver aDriver, String aWebAppUrl, String aPagePath) {
        super(aDriver, aWebAppUrl, aPagePath);
        
        titleElement = driver.findElement(By.tagName(H1));
        assertNotNull(titleElement);
        titleHintElement = titleElement.findElement(By.tagName(SMALL));
        assertNotNull(titleHintElement);
        
        testFeedbackContent = driver.findElement(By.className("feedback"));
    }

    @Override
    public String getTitle() {
        return StringUtils.remove(titleElement.getText(), titleHintElement.getText()).trim();
    }

    @Override
    public String getSubTitle() {
        return titleHintElement.getText();
    }
}
