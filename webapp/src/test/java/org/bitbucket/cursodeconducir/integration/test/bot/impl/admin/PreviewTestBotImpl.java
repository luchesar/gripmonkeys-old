package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import static junit.framework.Assert.*;

import java.net.URL;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.PreviewTestBot;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.collect.Lists;

public class PreviewTestBotImpl extends AdminBotImpl implements PreviewTestBot {
    protected WebElement editButton;
    protected WebElement saveChangesButton;
    protected WebElement cancelButton;
    protected WebElement previewContainer;
    protected WebElement image;
    protected WebElement title;
    protected WebElement question;
    protected WebElement answerLink0;
    protected WebElement answerLink1;
    protected WebElement answerLink2;
    protected WebElement answerText0;
    protected WebElement answerText1;
    protected WebElement answerText2;
    protected WebElement explanationContainer;
    protected WebElement incorrectContainer;
    protected WebElement correctContainer;

    public PreviewTestBotImpl(WebDriver aDriver, String aWebAppUrl) throws Exception {
        super(aDriver, aWebAppUrl, StringUtils.difference(aWebAppUrl, aDriver.getCurrentUrl()));

        initPrevewTestBot();
    }

    @Override
    protected void init() {
        super.init();
        initPrevewTestBot();
    }

    private final void initPrevewTestBot() {
        (new WebDriverWait(driver, 20)).until(new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver d) {
                return driver.findElements(By.linkText("Edit")).size() == 2;
            }
        });
        editButton = driver.findElement(By.linkText("Edit"));
        assertNotNull(editButton);

        saveChangesButton = driver.findElement(By.linkText("Save changes"));
        assertNotNull(saveChangesButton);

        cancelButton = driver.findElement(By.linkText("Cancel"));
        assertNotNull(cancelButton);

        previewContainer = driver.findElement(By.id("previewContainer"));
        image = previewContainer.findElement(By.id("testPreviewImage"));
        title = previewContainer.findElement(By.id("testPreviewTitle"));
        question = previewContainer.findElement(By.id("testPreviewDescription"));

        answerLink0 = previewContainer.findElement(By.id("answerLink0"));
        answerLink1 = previewContainer.findElement(By.id("answerLink1"));
        answerLink2 = previewContainer.findElement(By.id("answerLink2"));

        answerText0 = previewContainer.findElement(By.id("answerText0"));
        answerText1 = previewContainer.findElement(By.id("answerText1"));
        answerText2 = previewContainer.findElement(By.id("answerText2"));

        incorrectContainer = previewContainer.findElement(By.id("incorrectContainer"));
        correctContainer = previewContainer.findElement(By.id("correctContainer"));
        explanationContainer = previewContainer.findElement(By.id("explanationContainer"));
    }

    @Override
    public EditTestBot edit() {
        editButton.click();
        return new EditTestBotImpl(driver, webAppUrl);
    }

    @Override
    public AdminTestsBot cancel() {
        cancelButton.click();
        return new AdminTestsBotImpl(driver, webAppUrl);
    }

    @Override
    public AdminTestsBot save() {
        saveChangesButton.click();
        return new AdminTestsBotImpl(driver, webAppUrl);
    }

    @Override
    public String getImageUrl() {
        return image.getAttribute("src");
    }

    @Override
    public String getTestTitle() {
        return title.getText();
    }

    @Override
    public String getQuestion() {
        return question.getText();
    }

    @Override
    public List<String> getAnswerKeys() {
        return Lists.newArrayList(answerLink0.getText().trim(), answerLink1.getText().trim(),
                answerLink2.getText().trim());
    }

    @Override
    public String getAnswer(String aKey) {
        if (aKey.equals(answerLink0.getText().trim())) {
            return answerText0.getText().trim();
        }
        if (aKey.equals(answerLink1.getText().trim())) {
            return answerText1.getText().trim();
        }
        if (aKey.equals(answerLink2.getText().trim())) {
            return answerText2.getText().trim();
        }
        throw new IllegalArgumentException("No aswer with key '" + aKey + "'");
    }

    @Override
    public void answer(String aKey) throws BotException {
        previewContainer.findElement(By.partialLinkText(aKey)).click();
        (new WebDriverWait(driver, 20)).until(new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver d) {
                return isAnsweted();
            }
        });
    }

    @Override
    public boolean isAnsweted() {
        return (correctContainer.isDisplayed() || incorrectContainer.isDisplayed())
                && explanationContainer.isDisplayed();
    }

    @Override
    public boolean isCorrect() throws BotException {
        if (correctContainer.isDisplayed() && !incorrectContainer.isDisplayed()) {
            return true;
        }
        if (!correctContainer.isDisplayed() && incorrectContainer.isDisplayed()) {
            return false;
        }
        throw new BotException("Unknow answer state");
    }

    @Override
    public String getExplanation() throws BotException {
        if (!explanationContainer.isDisplayed()) {
            throw new BotException("Test is not aswered yet");
        }
        return explanationContainer.getText().trim();
    }
}
