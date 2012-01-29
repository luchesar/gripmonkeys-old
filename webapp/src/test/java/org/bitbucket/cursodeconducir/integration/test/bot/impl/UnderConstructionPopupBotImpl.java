package org.bitbucket.cursodeconducir.integration.test.bot.impl;

import static junit.framework.Assert.*;
import static org.bitbucket.cursodeconducir.integration.test.bot.WebDriverUtils.*;

import org.bitbucket.cursodeconducir.integration.test.bot.api.UnderConstructionPopupBot;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class UnderConstructionPopupBotImpl implements UnderConstructionPopupBot {
    private final WebElement title;
    private final WebElement xButton;
    private final WebElement closeButton;
    private WebElement image;
    private final WebDriver driver;
    private WebElement modalContainer;

    public UnderConstructionPopupBotImpl(WebDriver aDriver) {
        driver = aDriver;
        modalContainer = findElement(driver, By.id("under-construction-modal"), 25);
        waitForPopUp();
        WebElement footer = modalContainer.findElement(By.className("modal-footer"));
        closeButton = footer.findElement(By.className("close"));

        WebElement header = modalContainer.findElement(By.className("modal-header"));
        title = header.findElement(By.tagName("h2"));
        assertTrue(modalContainer.isDisplayed());
        xButton = header.findElement(By.className("close"));

        image = driver.findElement(By.className("modal-body")).findElement(
                By.cssSelector("img.thumbnail"));
    }

    @Override
    public String getTitle() {
        return title.getText();
    }

    @Override
    public void x() {
        xButton.click();
        waitForClose();
    }

    @Override
    public String getImageUrl() {
        return image.getAttribute("src");
    }

    @Override
    public void close() {
        closeButton.click();
        waitForClose();
    }
    
    private void waitForPopUp() {
        (new WebDriverWait(driver, 10))
        .until(new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver d) {
                return modalContainer.isDisplayed();
            }
        });
    }
    
    private void waitForClose() {
        (new WebDriverWait(driver, 10))
        .until(new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver d) {
                return !modalContainer.isDisplayed();
            }
        });
    }
}
