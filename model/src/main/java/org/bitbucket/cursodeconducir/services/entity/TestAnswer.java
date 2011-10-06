package org.bitbucket.cursodeconducir.services.entity;

import java.util.Date;

import javax.persistence.Id;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Unindexed;

public class TestAnswer {
    @Id
    private Long id;
    private Date date;
    private boolean isCorrect;
    @Unindexed
    private Test test;
    private int answer;

    public TestAnswer(Test aTest, Date aDate, int aAnswer, boolean aIsCorrect) {
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

    public Test getTest() {
        return test;
    }

    public int getAnswer() {
        return answer;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public static class TestAnswerDao extends TestAnswer {
        private Key<Test> testKey;

        public TestAnswerDao(TestAnswer aTestAnswer) {
            this(aTestAnswer.getTest(), aTestAnswer.getDate(), aTestAnswer.getAnswer(), aTestAnswer
                    .isCorrect());
        }

        public TestAnswerDao(Test aTest, Date aDate, int aAnswer, boolean isCorrect) {
            super(aTest, aDate, aAnswer, isCorrect);
            testKey = new Key<Test>(Test.class, aTest.getId());
        }

        public Key<Test> getTestKey() {
            return testKey;
        }
    }
    
    
}
