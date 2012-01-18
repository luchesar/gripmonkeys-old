package org.bitbucket.cursodeconducir.integration.test.bot.api.admin;

public interface PreviewTestBot extends AdminBot {
    PreviewTestBot edit();
    
    AdminTestsBot cancel();
    
    AdminTestsBot save();
}
