package org.bitbucket.cursodeconducir.integration.test.bot.impl;

import org.bitbucket.cursodeconducir.integration.test.bot.api.HomePageBot;
import org.openqa.selenium.WebDriver;

public class HomePageBotImpl extends PageBotImpl implements HomePageBot {

    public HomePageBotImpl(WebDriver aDriver, String aWebAppUrl, String aPagePath) {
        super(aDriver, aWebAppUrl, aPagePath);
    }

}
