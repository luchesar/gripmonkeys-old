package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import org.openqa.selenium.WebDriver;

public class CreateTestBotImpl extends EditTestBotImpl {

    public CreateTestBotImpl(WebDriver aDriver, String aWebAppUrl) {
        super(aDriver, aWebAppUrl, "create");
    }
}
