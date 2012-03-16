package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import static junit.framework.Assert.*;
import static org.bitbucket.cursodeconducir.integration.TestConstants.*;

import java.util.ArrayList;
import java.util.List;

import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestImageBot;
import org.bitbucket.cursodeconducir.services.entity.Question;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AdminTestsBotImpl extends AdminBotImpl implements AdminTestsBot {
    private static final String ID_TEST_DESCRIPTION = "testDescription";
    private static final String ID_TEST_TITLE_LINK = "testTitleLink";
    private static final String ID_TEST_IMAGE = "testImage";
    private static final String ID_ALL_TESTS_CONTAINER = "allTestsContainer";

    private WebElement createButton;

    private WebElement allTestsContainer;

    private List<WebElement> testContainers;

    public AdminTestsBotImpl(WebDriver aDriver, String aWebAppUrl) {
        super(aDriver, aWebAppUrl, PAGE_PATH);

        initAdminTestsBot();
    }

    @Override
    protected void init() {
        super.init();
        initAdminTestsBot();
    }

    private final void initAdminTestsBot() {
        List<WebElement> createButtons = driver.findElements(By.linkText(CREATE_LINK_TEXT));
        assertEquals(2, createButtons.size());
        assertEquals(createButtons.get(0).getAttribute(HREF),
                createButtons.get(1).getAttribute(HREF));

        createButton = createButtons.get(0);
        assertNotNull(createButton);

        allTestsContainer = driver.findElement(By.id(ID_ALL_TESTS_CONTAINER));
        assertNotNull(allTestsContainer);
        testContainers = allTestsContainer.findElements(By.id("testInAList"));
        assertNotNull(testContainers);
        assertFalse("Server error '" + testFeedbackContent + "'", testFeedbackContent.isDisplayed());
    }

    @Override
    public EditTestBot create() {
        createButton.click();
        return new CreateTestBotImpl(driver, webAppUrl);
    }

    @Override
    public List<String> getAllTestTitles() {
        List<String> titles = new ArrayList<String>(testContainers.size());
        for (WebElement testContainer : testContainers) {
            titles.add(findTestTitle(testContainer).getText().trim());
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
    public void deleteTest(final String aTitle, boolean accept) {
        WebElement deleteButton = findTestElement(aTitle).findElement(By.linkText("Delete"));
        deleteButton.click();

        Alert alert = driver.switchTo().alert();
        if (accept) {
            alert.accept();

            // wait for the element to be deleted from the dom
            (new WebDriverWait(driver, 20)).until(new ExpectedCondition<Boolean>() {
                @Override
                public Boolean apply(WebDriver d) {
                    try {
                        initAdminTestsBot();
                        return findTestElement(aTitle) == null;
                    } catch (StaleElementReferenceException e) {
                        return true;
                    }
                }
            });
            init();
        } else {
            alert.dismiss();
        }
    }

    @Override
    public boolean isPublished(String aTitle) {
        WebElement publishmentButton = findTestPublishmentButton(findTestElement(aTitle));

        if ("Publish".equals(publishmentButton.getText())) {
            return false;
        } else if ("Unpublish".equals(publishmentButton.getText())) {
            return true;
        }
        throw new IllegalStateException();
    }

    @Override
    public void publish(final String aTitle) throws BotException {
        assertFalse("Server error '" + testFeedbackContent + "'", testFeedbackContent.isDisplayed());

        if (isPublished(aTitle)) {
            throw new BotException("'" + aTitle + "' is already published");
        }
        WebElement publishmentButton = findTestPublishmentButton(findTestElement(aTitle));
        publishmentButton.click();
        (new WebDriverWait(driver, 20)).until(new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver d) {
                try {
                    return isPublished(aTitle);
                } catch (StaleElementReferenceException e) {
                    return true;
                }
            }
        });
        init();
    }

    @Override
    public void unpublish(final String aTitle) throws BotException {
        assertFalse("Server error '" + testFeedbackContent + "'", testFeedbackContent.isDisplayed());

        if (!isPublished(aTitle)) {
            throw new BotException("'" + aTitle + "' is already unpublished");
        }
        WebElement publishmentButton = findTestPublishmentButton(findTestElement(aTitle));
        publishmentButton.click();
        (new WebDriverWait(driver, 20)).until(new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver d) {
                try {
                    return !isPublished(aTitle);
                } catch (StaleElementReferenceException e) {
                    return true;
                }
            }
        });
        init();
    }

    @Override
    public Question createTest(Question aTest) {
        EditTestBot editTestBot = create();
        return setTestValues(aTest, editTestBot);
    }

    @Override
    public Question updateTest(String aTitle, Question aTest) {
        EditTestBot editTestBot = clickTestTitle(aTitle);
        return setTestValues(aTest, editTestBot);
    }

    private Question setTestValues(Question aTest, EditTestBot editTestBot) {
        editTestBot.setTestTitle(aTest.getTitle());
        editTestBot.setTestDescription(aTest.getDescription());
        List<String> possibleAnswers = aTest.getPossibleAnswers();
        for (int i = 0; i < possibleAnswers.size(); i++) {
            editTestBot.setPossibleAnswer(i, possibleAnswers.get(i));
        }

        editTestBot.setCorrectAnswer(aTest.getCorrectAnswerIndex());
        editTestBot.setExplanation(aTest.getExplanation());
        String oldImage = editTestBot.getTest().getImage();

        EditTestImageBot testImageBot = editTestBot.editImage();
        assertEquals(oldImage, testImageBot.getImageUrl());
        testImageBot.uploadImage(aTest.getImage(), true);
        assertFalse(oldImage.equals(testImageBot.getImageUrl()));

        Question createdTest = editTestBot.getTest();
        editTestBot.save();
        init();
        return createdTest;
    }

    private WebElement findTestElement(String title) {
        for (WebElement element : testContainers) {
            WebElement titleLink = findTestTitle(element);
            if (title.equals(titleLink.getText().trim())) {
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

    private WebElement findTestPublishmentButton(WebElement testElement) {
        return testElement.findElement(By.id("changeTestPublishment"));
    }
}
