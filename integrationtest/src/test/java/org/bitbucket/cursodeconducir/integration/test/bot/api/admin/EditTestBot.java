package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

import org.bitbucket.cursodeconducir.integration.test.bot.api.BotException;
import org.bitbucket.cursodeconducir.services.entity.Question;

public interface EditTestBot extends AdminBot {
    PreviewTestBot preview() throws BotException;
    
    AdminTestsBot cancel();
    
    AdminTestsBot save();
    
    Question getTest();
    
    void setTestTitle(String title);
    
    EditTestImageBot editImage();
    
    void setTestDescription(String description);
    
    void setPossibleAnswer(int index, String answer);
    
    void setCorrectAnswer(String correctAnswer);
    
    void setCorrectAnswer(int correctAnswerIndex);
    
    void setExplanation(String explanation);
}
