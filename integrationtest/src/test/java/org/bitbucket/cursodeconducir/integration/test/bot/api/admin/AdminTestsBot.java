package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

import java.util.List;

import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;
import org.bitbucket.cursodeconducir.services.entity.Question;

public interface AdminTestsBot extends AdminBot {
    EditTestBot create();
    
    List<String> getAllTestTitles();
    
    EditTestBot clickTestImage(String title);
    
    EditTestBot clickTestTitle(String title);
    
    String getTestDescription(String aTitle);
    
    void deleteTest(String title, boolean accept);
    
    boolean isPublished(String title);
    
    void publish(String title) throws BotException;
    
    void unpublish(String title) throws BotException;
    
    Question createTest(Question test);
    
    Question updateTest(String title, Question test);
}
