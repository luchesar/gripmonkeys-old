package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import static junit.framework.Assert.*;

import java.util.List;

import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestBot;
import org.bitbucket.cursodeconducir.integration.test.bot.impl.PageBotImpl;
import org.bitbucket.cursodeconducir.services.entity.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class AdminTestsBotImpl extends PageBotImpl implements AdminTestsBot {
    private static final String CREATE_LINK_TEXT = "Create";

    private final WebDriver driver;
    private final String webAppUrl;
    private WebElement createButton;

    public AdminTestsBotImpl(WebDriver aDriver, String aWebAppUrl) {
        super(aDriver);
        webAppUrl = aWebAppUrl;
        driver = aDriver;
        
        String url = webAppUrl + "/admin/tests";
        if (!url.equals(driver.getCurrentUrl())) {
            driver.get(url);
        }

        List<WebElement> createButtons = driver.findElements(By.linkText(CREATE_LINK_TEXT));
        assertEquals(2, createButtons.size());
        assertEquals(createButtons.get(0).getAttribute("href"),
                createButtons.get(1).getAttribute("href"));

        createButton = createButtons.get(0);
    }

    @Override
    public String getTitle() {
        return null;
    }

    @Override
    public String getSubTitle() {
        return null;
    }

   
    @Override
    public EditTestBot create() {
        createButton.click();
        return new EditTestBotImpl(webAppUrl, driver);
    }

    @Override
    public List<Test> getAllTests() {
        return null;
    }

    @Override
    public EditTestBot clickTestImage(String aTitle) {
        return null;
    }

    @Override
    public EditTestBot clickTestTitle(String aTitle) {
        return null;
    }

    @Override
    public List<Test> deleteTest(String aTitle) {
        return null;
    }

    @Override
    public boolean isPublished(String aTitle) {
        return false;
    }

    @Override
    public boolean publish(String aTitle) throws BotException {
        return false;
    }

    @Override
    public boolean unpublish(String aTitle) throws BotException {
        return false;
    }
}
