package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import static org.bitbucket.cursodeconducir.integration.TestConstants.*;
import static junit.framework.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestBot;
import org.bitbucket.cursodeconducir.integration.test.bot.impl.PageBotImpl;
import org.bitbucket.cursodeconducir.services.entity.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class AdminTestsBotImpl extends PageBotImpl implements AdminTestsBot {
    private static final String ID_TEST_DESCRIPTION = "testDescription";
    private static final String ID_TEST_TITLE_LINK = "testTitleLink";
    private static final String ID_TEST_IMAGE = "testImage";
    private static final String ID_ALL_TESTS_CONTAINER = "allTestsContainer";
    

    private final WebDriver driver;
    private final String webAppUrl;
    private WebElement createButton;
    private WebElement titleElement;
    private WebElement titleHintElement;

    private WebElement allTestsContainer;

    private List<WebElement> testContainers;

    public AdminTestsBotImpl(WebDriver aDriver, String aWebAppUrl) {
        super(aDriver, aWebAppUrl, PAGE_PATH);
        webAppUrl = aWebAppUrl;
        driver = aDriver;

        List<WebElement> createButtons = driver.findElements(By.linkText(CREATE_LINK_TEXT));
        assertEquals(2, createButtons.size());
        assertEquals(createButtons.get(0).getAttribute(HREF),
                createButtons.get(1).getAttribute(HREF));

        createButton = createButtons.get(0);
        assertNotNull(createButton);
        titleElement = driver.findElement(By.tagName(H1));
        assertNotNull(titleElement);
        titleHintElement = titleElement.findElement(By.tagName(SMALL));
        assertNotNull(titleHintElement);

        allTestsContainer = driver.findElement(By.id(ID_ALL_TESTS_CONTAINER));
        assertNotNull(allTestsContainer);
        testContainers = allTestsContainer.findElements(By
                .id("testInAList"));
        assertNotNull(testContainers);
    }

    @Override
    public String getTitle() {
        return StringUtils.remove(titleElement.getText(), titleHintElement.getText()).trim();
    }

    @Override
    public String getSubTitle() {
        return titleHintElement.getText();
    }

    @Override
    public EditTestBot create() {
        createButton.click();
        return new EditTestBotImpl(driver, webAppUrl);
    }

    @Override
    public List<String> getAllTestTitles() {
        List<String> titles = new ArrayList<String>(testContainers.size());
        for (WebElement testContainer : testContainers) {
            titles.add(findTestTitle(testContainer).getText());
        }
        return titles;
    }

    @Override
    public EditTestBot clickTestImage(String aTitle) {
        findTestImage(findTestElement(aTitle)).click();
        return new EditTestBotImpl(driver, webAppUrl);
    }

    @Override
    public EditTestBot clickTestTitle(String aTitle) {
        findTestTitle(findTestElement(aTitle)).click();
        return new EditTestBotImpl(driver, webAppUrl);
    }
    
    @Override
    public String getTestDescription(String aTitle) {
        return getTestDescription(findTestElement(aTitle));
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
    
    private WebElement findTestElement(String title) {
        for (WebElement element : testContainers) {
            WebElement titleLink = findTestTitle(element);
            if (title.equals(titleLink.getText())) {
                return element;
            }
        }
        
        return null;
    }
    
    private WebElement findTestImage(WebElement testElement) {
        return testElement.findElement(By.id(ID_TEST_IMAGE));
    }
    
    private WebElement findTestTitle(WebElement testElement) {
        return testElement.findElement(By.id(ID_TEST_TITLE_LINK));
    }
    
    private String getTestDescription(WebElement testElement) {
        return testElement.findElement(By.id(ID_TEST_DESCRIPTION)).getText();
    }
}
