package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.AdminTestsBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestImageBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.PreviewTestBot;
import org.bitbucket.cursodeconducir.integration.test.bot.impl.PageBotImpl;
import org.bitbucket.cursodeconducir.services.entity.Test;
import org.openqa.selenium.WebDriver;

public class EditTestBotImpl extends PageBotImpl implements EditTestBot {

    public EditTestBotImpl(WebDriver aDriver, String aWebAppUrl) {
        super(aDriver, aWebAppUrl, "admin/tests#create");
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
    public PreviewTestBot preview() {
        return null;
    }

    @Override
    public AdminTestsBot cancel() {
        return null;
    }

    @Override
    public AdminTestsBot save() {
        return null;
    }

    @Override
    public Test getTest() {
        return null;
    }

    @Override
    public EditTestImageBot editImage() {
        return null;
    }
}
