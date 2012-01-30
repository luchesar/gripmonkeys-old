package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

import java.util.Map;

import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;

public interface PreviewTestBot extends AdminBot {
    EditTestBot edit();
    
    AdminTestsBot cancel();
    
    AdminTestsBot save();
    
    String getImageUrl();
    
    String getTitle();
    
    String getQuestion();
    
    Map<String, String> getAmswers();
    
    void answer(String key) throws BotException;
    
    boolean isCorrect() throws BotException;
    
    String getExplanation() throws BotException;
}
