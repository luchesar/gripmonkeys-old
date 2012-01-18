package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

import org.bitbucket.cursodeconducir.integration.test.bot.api.MainMenuBot;

public interface AdminBot {
    MainMenuBot getMainMenu();
    
    String getTitle();
    
    String getSubTitle();
    
    String getCopyRight();
}
