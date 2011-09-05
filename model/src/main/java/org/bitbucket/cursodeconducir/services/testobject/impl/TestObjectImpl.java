package org.bitbucket.cursodeconducir.services.testobject.impl;

import java.util.Collections;
import java.util.List;

import org.bitbucket.cursodeconducir.services.testobject.TestObject;

import com.google.appengine.repackaged.com.google.common.base.Objects;
import com.google.appengine.repackaged.com.google.common.collect.Lists;

@SuppressWarnings("serial")
public class TestObjectImpl implements TestObject {
    private final String title;
    private final String testBody;
    private final List<String> possibleAnswers;
    private final int correctAnswerIndex;

    public TestObjectImpl(String aTitle, String aTestBody,
            List<String> aTestPossibleAnswers, int aCorrectAnswerIndex) {
        super();
        title = aTitle;
        testBody = aTestBody;
        possibleAnswers = Lists.newArrayList(aTestPossibleAnswers);
        correctAnswerIndex = aCorrectAnswerIndex;
        
        if (aCorrectAnswerIndex < 0 || aCorrectAnswerIndex >= aTestPossibleAnswers.size()) {
            throw new IllegalArgumentException("The possible answers is out of bounds");
        }
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getTestBody() {
        return testBody;
    }

    @Override
    public List<String> getPossibleAnswers() {
        return Collections.unmodifiableList(possibleAnswers);
    }

    @Override
    public int getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    @Override
    public boolean equals(Object aObj) {
        if (this == aObj) {
            return true;
        }
        if (!(aObj instanceof TestObject)) {
            return false;
        }

        TestObject other = (TestObject) aObj;
        return  Objects.equal(title, other.getTitle())
                && Objects.equal(testBody, other.getTestBody())
                && Objects.equal(possibleAnswers, other.getPossibleAnswers())
                && Objects.equal(correctAnswerIndex, other.getCorrectAnswerIndex());
    }
    
    @Override
    public int hashCode() {
        return Objects.hashCode(title,testBody, possibleAnswers, correctAnswerIndex);
    }

    @Override
    public String toString() {
        return "TestObjectImpl [title=" + title + ", testBody=" + testBody + ", possibleAnswers="
                + possibleAnswers + ", correctAnswerIndex=" + correctAnswerIndex + "]";
    }
    
    
}
