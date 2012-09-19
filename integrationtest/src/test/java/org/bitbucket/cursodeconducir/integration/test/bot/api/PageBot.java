package org.bitbucket.cursodeconducir.integration.test.bot.api;

public interface PageBot {
    String getPageTitle();
    
    MainMenuBot getMainMenu();
    
    String getCopyRight();
    
    void reload();
}
