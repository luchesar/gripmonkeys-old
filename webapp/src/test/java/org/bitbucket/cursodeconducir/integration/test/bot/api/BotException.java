package org.bitbucket.cursodeconducir.integration.test.bot.api;

public class BotException extends Exception {
    public BotException(String aMessage, Throwable aCause) {
        super(aMessage, aCause);
    }

    public BotException(Throwable aCause) {
        super(aCause);
    }
}
