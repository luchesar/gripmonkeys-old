package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import com.google.appengine.repackaged.com.google.common.base.Objects;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.Unindexed;

@Cached
@Unindexed
public class Test extends TitledEntity {
    private List<String> possibleAnswers;
    private int correctAnswerIndex;
    private String explanation;
    private List<String> images;
    @Indexed
    private boolean published = true;

    public Test() {
        super();
    }

    public Test(String aTitle, String aImage, String aDescription, List<String> aPossibleAnswers,
            int aCorrectAnswerIndex, String aExplanation, List<String> aImageRelativePaths) {
        super(aTitle, aImage, aDescription);
        possibleAnswers = aPossibleAnswers;
        correctAnswerIndex = aCorrectAnswerIndex;
        explanation = aExplanation;
        images = aImageRelativePaths;
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

    public List<String> getImages() {
        return images;
    }

    public void setPossibleAnswers(List<String> aPossibleAnswers) {
        possibleAnswers = aPossibleAnswers;
    }

    public void setCorrectAnswerIndex(int aCorrectAnswerIndex) {
        correctAnswerIndex = aCorrectAnswerIndex;
    }

    public void setExplanation(String aExplanation) {
        explanation = aExplanation;
    }

    public void setImages(List<String> aImages) {
        images = aImages;
    }

    public boolean getPublished() {
        return published;
    }

    public void setPublished(boolean aPublished) {
        published = aPublished;
    }

    @Override
    public boolean equals(Object aObj) {
        if (this == aObj) {
            return true;
        }
        if (!(aObj instanceof Test)) {
            return false;
        }
        if (!super.equals(aObj)) {
            return false;
        }
        Test other = (Test) aObj;

        return Objects.equal(possibleAnswers, other.possibleAnswers)
                && Objects.equal(correctAnswerIndex, other.correctAnswerIndex)
                && Objects.equal(explanation, other.explanation)
                && Objects.equal(images, other.images)
                && Objects.equal(published, other.published);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(super.hashCode(), possibleAnswers, correctAnswerIndex, explanation,
                images, published);
    }

    @Override
    public String toString() {
        return "Test [getId()=" + getId() + ", getTitle()=" + getTitle() + ", getTitleImage()="
                + getTitleImage() + ", getDescription()=" + getDescription() + ", getImage()="
                + getImage() + "possibleAnswers=" + possibleAnswers + ", correctAnswerIndex="
                + correctAnswerIndex + ", explanation=" + explanation + ", images=" + images
                + " isPublished=" + published + "]";
    }
}
