package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import com.google.common.base.Objects;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.Unindexed;

@Cached
@Unindexed
@Entity(name="Test")
public class Question extends TitledEntity {
    private List<String> possibleAnswers;
    private int correctAnswerIndex;
    private String explanation;
    private List<String> images;

    public Question() {
        super();
    }

    public Question(String aTitle, String aImage, String aDescription, List<String> aPossibleAnswers,
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

    @Override
    public boolean equals(Object aObj) {
        if (this == aObj) {
            return true;
        }
        if (!(aObj instanceof Question)) {
            return false;
        }
        if (!super.equals(aObj)) {
            return false;
        }
        Question other = (Question) aObj;

        return Objects.equal(possibleAnswers, other.possibleAnswers)
                && Objects.equal(correctAnswerIndex, other.correctAnswerIndex)
                && Objects.equal(explanation, other.explanation)
                && Objects.equal(images, other.images);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(super.hashCode(), possibleAnswers, correctAnswerIndex, explanation,
                images);
    }

    @Override
    public String toString() {
        return "Test [getId()=" + getId() + ", getTitle()=" + getTitle() + ", getTitleImage()="
                + getTitleImage() + ", getDescription()=" + getDescription() + ", getImage()="
                + getImage() + "possibleAnswers=" + possibleAnswers + ", correctAnswerIndex="
                + correctAnswerIndex + ", explanation=" + explanation + ", images=" + images + "]";
    }
}
