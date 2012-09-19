package org.bitbucket.cursodeconducir.integration.test.bot.impl;

import org.bitbucket.cursodeconducir.integration.test.bot.api.HomePageBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.MainMenuBot;
import org.bitbucket.cursodeconducir.integration.test.bot.api.UnderConstructionPopupBot;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class MainMenuBotImpl implements MainMenuBot {

    private WebElement logoImage;
    private WebElement courcesLink;
    private WebElement signInLink;
    private WebDriver driver;
    private WebElement registerLink;
    private final String webAppUrl;

    public MainMenuBotImpl(WebDriver aDriver, String aWebAppUrl) {
        driver = aDriver;
        webAppUrl = aWebAppUrl;
        init();
    }

    private void init() {
        WebElement menuContainer = driver.findElement(By.className("topbar"));
        logoImage = menuContainer.findElement(By.className("brand")).findElement(By.tagName("img"));
        
        courcesLink = menuContainer.findElement(By.linkText("Cursos"));
        signInLink = menuContainer.findElement(By.linkText("Acceder"));
        
        registerLink = menuContainer.findElement(By.linkText("Regístrate"));
    }

    @Override
    public String getLogoImageUrl() {
        return logoImage.getAttribute("src");
    }
    
    @Override
    public HomePageBot clickLogo() {
        logoImage.click();
        try {
            Thread.sleep(400);
        } catch (InterruptedException e) {
        }
        
        HomePageBot homePageBot = new HomePageBotImpl(driver, webAppUrl, "");
        init();
        return homePageBot;
        
    }

    @Override
    public UnderConstructionPopupBot clickCources() {
        courcesLink.click();
        return new UnderConstructionPopupBotImpl(driver);
    }

    @Override
    public UnderConstructionPopupBot clickSignIn() {
        signInLink.click();
        return new UnderConstructionPopupBotImpl(driver);
    }

    @Override
    public UnderConstructionPopupBot clickRegister() {
        registerLink.click();
        return new UnderConstructionPopupBotImpl(driver);
    }
}
