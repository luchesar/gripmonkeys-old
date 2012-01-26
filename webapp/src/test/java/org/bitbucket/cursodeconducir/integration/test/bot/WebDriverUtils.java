package org.bitbucket.cursodeconducir.integration.test.bot;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class WebDriverUtils {
    public static String getSelectedValue(WebElement select) {
        List<WebElement> options = select.findElements(By.tagName("option"));
        if (options == null) {
            return null;
        }

        for (WebElement option : options) {
            if (option.getAttribute("selected") != null) {
                return option.getAttribute("value");
            }
        }

        return null;
    }

    public static WebElement findElement(WebDriver driver, final By by, int timeOutSeconds) {
        return (new WebDriverWait(driver, timeOutSeconds))
                .until(new ExpectedCondition<WebElement>() {
                    @Override
                    public WebElement apply(WebDriver d) {
                        return d.findElement(by);
                    }
                });
    }
}
