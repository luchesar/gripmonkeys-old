package org.bitbucket.cursodeconducir.integration.test.bot.api;

@SuppressWarnings("serial")
public class BotException extends Exception {
    public BotException(String aMessage) {
        super(aMessage);
    }
    
    public BotException(String aMessage, Throwable aCause) {
        super(aMessage, aCause);
    }

    public BotException(Throwable aCause) {
        super(aCause);
    }
}
