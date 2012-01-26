package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import static junit.framework.Assert.*;

import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
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
    public PreviewTestBot edit() {
        editButton.click();
        return null;
    }

    @Override
    public AdminTestsBot cancel() {
        cancelButton.click();
        return null;
    }

    @Override
    public AdminTestsBot save() {
        saveChangesButton.click();
        return null;
    }
}
