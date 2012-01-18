package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

import org.bitbucket.cursodeconducir.services.entity.Test;

public interface EditTestBot extends AdminBot {
    PreviewTestBot preview();
    
    AdminTestsBot cancel();
    
    AdminTestsBot save();
    
    Test getTest();
}
