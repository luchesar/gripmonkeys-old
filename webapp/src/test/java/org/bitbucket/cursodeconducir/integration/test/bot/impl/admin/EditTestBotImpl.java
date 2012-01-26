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

import com.google.common.collect.Lists;

public class EditTestBotImpl extends AdminBotImpl implements EditTestBot {
    protected final WebElement previewButton;
    protected final WebElement saveChangesButton;
    protected final WebElement cancelButton;
    protected final WebElement testTitle;
    protected final WebElement testImageLink;
    protected final WebElement testDescription;
    protected final WebElement answer0;
    protected final WebElement answer1;
    protected final WebElement answer2;
    protected final WebElement correctAnswerIndex;
    protected final WebElement testExplanation;

    public EditTestBotImpl(WebDriver aDriver, String aWebAppUrl) {
        this(aDriver, aWebAppUrl, "edit");
    }

    protected EditTestBotImpl(WebDriver aDriver, String aWebAppUrl, String hash) {
        super(aDriver, aWebAppUrl, "/admin/tests#" + hash);
        
        testExplanation = findElement(driver, By.name("testExplanation"), 25);
        assertNotNull(testExplanation);
        
        previewButton = driver.findElement(By.linkText("Preview"));
        assertNotNull(previewButton);

        saveChangesButton = driver.findElement(By.linkText("Save changes"));
        assertNotNull(saveChangesButton);

        cancelButton = driver.findElement(By.linkText("Cancel"));
        assertNotNull(cancelButton);

        testTitle = driver.findElement(By.name("testTitle"));
        assertNotNull(testTitle);
        testImageLink = driver.findElement(By.id("testImageLink"));
        assertNotNull(testImageLink);
        testDescription = driver.findElement(By.name("testDescription"));
        assertNotNull(testDescription);
        answer0 = driver.findElement(By.name("answer0"));
        assertNotNull(answer0);
        answer1 = driver.findElement(By.name("answer1"));
        assertNotNull(answer1);
        answer2 = driver.findElement(By.name("answer2"));
        assertNotNull(answer2);

        correctAnswerIndex = driver.findElement(By.name("correctAnswerIndex"));
        assertNotNull(correctAnswerIndex);
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
        int selectedIndex = Integer.parseInt(WebDriverUtils.getSelectedValue(correctAnswerIndex));

        return new Test(testTitle.getText(), testImageLink.getAttribute("href"),
                testDescription.getText(), possibleAnswers, selectedIndex,
                testExplanation.getText(), Collections.<String>emptyList());
    }

    @Override
    public EditTestImageBot editImage() {
        return null;
    }
    
    @Override
    public void setTestTitle(String aTitle) {
        testTitle.sendKeys(aTitle);
    }
    
    @Override
    public void setTestDescription(String aDescription) {
        testDescription.sendKeys(aDescription);
    }
}
