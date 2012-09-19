package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

public interface EditTestImageBot {
    String getDialogTitle();
    String getFileName();
    
    String getImageUrl();
    
    void uploadImage(String absoluteFilePath, boolean apply);
    
    String getFileSize();
    String getFileType();
    String getProgress();
    
    void done();
    void cancel();
    void close();
}
