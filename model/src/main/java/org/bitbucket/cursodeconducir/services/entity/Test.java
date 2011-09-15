package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Unindexed;

@Cached
public class Test extends TitledEntity {
    @Unindexed
    private List<String> possibleAnswers;
    @Unindexed
    private int correctAnswerIndex;
    @Unindexed
    private String explanation;
    @Unindexed
    private List<String> imageRelativePaths;
    @Unindexed
    private List<String> videoRelativePaths;

    public Test() {
        super();
    }

    public Test(long aId, String aTitle, String aDescription, List<String> aPossibleAnswers,
            int aCorrectAnswerIndex, String aExplanation, List<String> aImageRelativePaths,
            List<String> aVideoRelativePaths) {
        super(aId, aTitle, aDescription);
        possibleAnswers = aPossibleAnswers;
        correctAnswerIndex = aCorrectAnswerIndex;
        explanation = aExplanation;
        imageRelativePaths = aImageRelativePaths;
        videoRelativePaths = aVideoRelativePaths;
    }

    public List<String> getPossibleAnswers() {
        return possibleAnswers;
    }

    public int getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public String getExplanation() {
        return explanation;
    }

    public List<String> getImageRelativePaths() {
        return imageRelativePaths;
    }

    public List<String> getVideoRelativePaths() {
        return videoRelativePaths;
    }
}
