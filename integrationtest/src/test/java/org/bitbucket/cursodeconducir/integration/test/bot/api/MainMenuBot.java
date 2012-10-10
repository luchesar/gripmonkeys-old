package org.bitbucket.cursodeconducir.integration.test.bot.api;


public interface MainMenuBot {
    String getLogoImageUrl();
    
    HomePageBot clickLogo();
    
    UnderConstructionPopupBot clickCources();
    
    UnderConstructionPopupBot clickSignIn();
    
    UnderConstructionPopupBot clickRegister();
}
