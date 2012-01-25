package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

import java.util.List;

import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;
import org.bitbucket.cursodeconducir.services.entity.Test;

public interface AdminTestsBot extends AdminBot {
    EditTestBot create();
    
    List<String> getAllTestTitles();
    
    EditTestBot clickTestImage(String title);
    
    EditTestBot clickTestTitle(String title);
    
    String getTestDescription(String aTitle);
    
    List<Test> deleteTest(String title);
    
    boolean isPublished(String title);
    
    boolean publish(String title) throws BotException;
    
    boolean unpublish(String title) throws BotException;
}
