package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import static junit.framework.Assert.*;

import java.util.Map;

import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.PreviewTestBot;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PreviewTestBotImpl extends AdminBotImpl implements PreviewTestBot {
    protected final WebElement editButton;
    protected final WebElement saveChangesButton;
    protected final WebElement cancelButton;

    public PreviewTestBotImpl(WebDriver aDriver, String aWebAppUrl) {
        super(aDriver, aWebAppUrl, "/admin/tests#preview");
        
        editButton = driver.findElement(By.linkText("Edit"));
        assertNotNull(editButton);
        
        saveChangesButton = driver.findElement(By.linkText("Save changes"));
        assertNotNull(saveChangesButton);
        
        cancelButton = driver.findElement(By.linkText("Cancel"));
        assertNotNull(cancelButton);
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
        return null;
    }

    @Override
    public String getQuestion() {
        return null;
    }

    @Override
    public Map<String, String> getAmswers() {
        return null;
    }

    @Override
    public void answer(String aKey) throws BotException {
    }

    @Override
    public boolean isCorrect() throws BotException {
        return false;
    }

    @Override
    public String getExplanation() throws BotException {
        return null;
    }
    
    public static void main(String arg[]) {
        for (;;) {
            System.out.println();
        }
    }
}
