package org.bitbucket.cursodeconducir.integration.test.bot.impl.admin;

import org.bitbucket.cursodeconducir.integration.test.bot.WebDriverUtils;
import org.bitbucket.cursodeconducir.integration.test.bot.api.admin.EditTestImageBot;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class EditTestImageBotImpl implements EditTestImageBot {
    private final WebDriver driver;
    private final WebElement cancelButton;
    private WebElement doneButton;
    private WebElement title;
    private WebElement closeButton;
    private WebElement testImage;
    private WebElement fileToUploadButton;
    private WebElement fileName;
    private WebElement fileSize;
    private WebElement fileType;
    private WebElement progressNumber;

    public EditTestImageBotImpl(WebDriver aDriver) {
        driver = aDriver;

        cancelButton = WebDriverUtils.findElement(driver, By.linkText("Cancel"), 25);
        doneButton = WebDriverUtils.findElement(driver, By.linkText("Done"), 25);

        WebElement modalHeader = driver.findElement(By.id("upload-image-modal")).findElement(
                By.className("modal-header"));
        title = modalHeader.findElement(By.tagName("h3"));
        closeButton = modalHeader.findElement(By.className("close"));

        testImage = driver.findElement(By.id("currentTestImage"));
        fileToUploadButton = driver.findElement(By.id("fileToUpload"));

        fileName = driver.findElement(By.id("fileName"));
        fileSize = driver.findElement(By.id("fileSize"));
        fileType = driver.findElement(By.id("fileType"));
        progressNumber = driver.findElement(By.id("progressNumber"));
    }

    @Override
    public String getDialogTitle() {
        return title.getText();
    }

    @Override
    public String getFileName() {
        return fileName.getText();
    }

    @Override
    public String getImageUrl() {
        return testImage.getAttribute("src");
    }

    @Override
    public void uploadImage(String aAbsoluteFilePath, boolean apply) {
        final String oldImageUrl = testImage.getAttribute("src");

        fileToUploadButton.sendKeys(aAbsoluteFilePath);
        try {
            (new WebDriverWait(driver, 20)).until(new ExpectedCondition<Boolean>() {
                @Override
                public Boolean apply(WebDriver d) {
                    return !oldImageUrl.equals(testImage.getAttribute("src"));
                }
            });
        } finally {
            if (apply) {
                done();
            } else {
                cancel();
            }
        }
    }

    @Override
    public String getFileSize() {
        return fileSize.getText();
    }

    @Override
    public String getFileType() {
        return fileType.getText();
    }

    @Override
    public String getProgress() {
        return progressNumber.getText();
    }

    @Override
    public void done() {
        doneButton.click();
    }

    @Override
    public void cancel() {
        cancelButton.click();
    }

    @Override
    public void close() {
        closeButton.click();
    }
}
