package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

import java.util.List;

import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;

public interface PreviewTestBot extends AdminBot {
    EditTestBot edit();
    
    AdminTestsBot cancel();
    
    AdminTestsBot save();
    
    String getImageUrl();
    
    String getTestTitle();
    
    String getQuestion();
    
    List<String> getAnswerKeys();
    
    String getAnswer(String key);
    
    void answer(String key) throws BotException;
    
    boolean isAnsweted();
    
    boolean isCorrect() throws BotException;
    
    String getExplanation() throws BotException;
}
