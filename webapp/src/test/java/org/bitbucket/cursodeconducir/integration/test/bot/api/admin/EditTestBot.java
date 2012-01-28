package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

import org.bitbucket.cursodeconducir.services.entity.Test;

public interface EditTestBot extends AdminBot {
    PreviewTestBot preview();
    
    AdminTestsBot cancel();
    
    AdminTestsBot save();
    
    Test getTest();
    
    void setTestTitle(String title);
    
    EditTestImageBot editImage();
    
    void setTestDescription(String description);
    
    void setPossibleAnswer(int index, String answer);
    
    void setCorrectAnswer(String correctAnswer);
    
    void setExplanation(String explanation);
}
