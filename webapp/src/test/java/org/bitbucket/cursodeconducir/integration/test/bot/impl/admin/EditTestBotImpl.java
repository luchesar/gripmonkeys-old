package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import static junit.framework.Assert.*;
import static org.bitbucket.cursodeconducir.integration.test.bot.WebDriverUtils.*;

import java.util.Collections;
import java.util.List;

import org.bitbucket.cursodeconducir.integration.test.bot.WebDriverUtils;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestImageBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.PreviewTestBot;
import org.bitbucket.cursodeconducir.services.entity.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import com.google.common.collect.Lists;

public class EditTestBotImpl extends AdminBotImpl implements EditTestBot {
    protected final WebElement previewButton;
    protected final WebElement saveChangesButton;
    protected final WebElement cancelButton;
    protected final WebElement testTitle;
    protected final WebElement testImageLink;
    protected final WebElement testImage;
    protected final WebElement testDescription;
    protected final WebElement answer0;
    protected final WebElement answer1;
    protected final WebElement answer2;
    protected final WebElement correctAnswerSelect;
    protected final WebElement testExplanation;

    public EditTestBotImpl(WebDriver aDriver, String aWebAppUrl) {
        this(aDriver, aWebAppUrl, "edit");
    }

    protected EditTestBotImpl(WebDriver aDriver, String aWebAppUrl, String hash) {
        super(aDriver, aWebAppUrl, "/admin/tests#" + hash);

        testExplanation = findElement(driver, By.name("testExplanation"), 25);
        previewButton = driver.findElement(By.linkText("Preview"));
        saveChangesButton = driver.findElement(By.linkText("Save changes"));
        cancelButton = driver.findElement(By.linkText("Cancel"));

        testTitle = driver.findElement(By.name("testTitle"));
        testImageLink = driver.findElement(By.id("testImageLink"));
        testImage = driver.findElement(By.id("testImage"));
        testDescription = driver.findElement(By.name("testDescription"));
        answer0 = driver.findElement(By.name("answer0"));
        answer1 = driver.findElement(By.name("answer1"));
        answer2 = driver.findElement(By.name("answer2"));

        correctAnswerSelect = driver.findElement(By.name("correctAnswerIndex"));
        assertNotNull(correctAnswerSelect);
    }

    @Override
    public PreviewTestBot preview() {
        previewButton.click();
        return new PreviewTestBotImpl(driver, webAppUrl);
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
    public Test getTest() {
        List<String> possibleAnswers = Lists.newArrayList(answer0.getText(), answer1.getText(),
                answer2.getText());
        int selectedIndex = Integer.parseInt(WebDriverUtils.getSelectedValue(correctAnswerSelect));

        return new Test(testTitle.getAttribute("value"), testImage.getAttribute("src"),
                testDescription.getText(), possibleAnswers, selectedIndex,
                testExplanation.getText(), Collections.<String> emptyList());
    }

    @Override
    public EditTestImageBot editImage() {
        testImage.click();
        return new EditTestImageBotImpl(driver);
    }

    @Override
    public void setTestTitle(String aTitle) {
        testTitle.clear();
        testTitle.sendKeys(aTitle);
    }

    @Override
    public void setTestDescription(String aDescription) {
        testDescription.clear();
        testDescription.sendKeys(aDescription);
    }

    @Override
    public void setPossibleAnswer(int aIndex, String aAnswer) {
        switch (aIndex) {
        case 0:
            answer0.clear();
            answer0.sendKeys(aAnswer);
            break;
        case 1:
            answer1.clear();
            answer1.sendKeys(aAnswer);
            break;
        case 2:
            answer2.clear();
            answer2.sendKeys(aAnswer);
            break;

        default:
            throw new IllegalArgumentException("No aswer with index " + aIndex);
        }
    }

    @Override
    public void setCorrectAnswer(String aCorrectAnswer) {
        Select select = new Select(correctAnswerSelect);
        select.selectByVisibleText(aCorrectAnswer);
    }
    
    @Override
    public void setCorrectAnswer(int aCorrectAnswerIndex) {
        Select select = new Select(correctAnswerSelect);
        select.selectByValue(aCorrectAnswerIndex + "");
    }

    @Override
    public void setExplanation(String aExplanation) {
        testExplanation.clear();
        testExplanation.sendKeys(aExplanation);
    }
}
