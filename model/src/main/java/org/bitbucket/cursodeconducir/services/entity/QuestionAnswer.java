package org.bitbucket.cursodeconducir.services.entity;

import java.util.Date;

import javax.persistence.Id;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Unindexed;

public class QuestionAnswer {
    @Id
    private Long id;
    private Date date;
    private boolean isCorrect;
    @Unindexed
    private Question test;
    private int answer;

    public QuestionAnswer(Question aTest, Date aDate, int aAnswer, boolean aIsCorrect) {
        date = aDate;
        test = aTest;
        answer = aAnswer;
        isCorrect = aIsCorrect;
    }

    public Long getId() {
        return id;
    }

    public Date getDate() {
        return date;
    }

    public Question getTest() {
        return test;
    }

    public int getAnswer() {
        return answer;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public static class TestAnswerDao extends QuestionAnswer {
        private Key<Question> testKey;

        public TestAnswerDao(QuestionAnswer aTestAnswer) {
            this(aTestAnswer.getTest(), aTestAnswer.getDate(), aTestAnswer.getAnswer(), aTestAnswer
                    .isCorrect());
        }

        public TestAnswerDao(Question aTest, Date aDate, int aAnswer, boolean isCorrect) {
            super(aTest, aDate, aAnswer, isCorrect);
            testKey = new Key<Question>(Question.class, aTest.getId());
        }

        public Key<Question> getTestKey() {
            return testKey;
        }
    }
    
    
}
