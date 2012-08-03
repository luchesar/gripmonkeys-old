package org.bitbucket.cursodeconducir.services.entity;

import java.util.Arrays;
import java.util.List;

import com.google.common.base.Objects;

public class Cource extends TitledEntity {
	private List<Integer> lessonIds;

	public Cource() {
		super();
	}

	public Cource(String aTitle, String aImage, String aDescription,
			List<Integer> aLessonIds) {
		super(aTitle, aImage, aDescription);
		lessonIds = aLessonIds;
	}

	public List<Integer> getLessonIds() {
		return lessonIds;
	}

	public void setLessonIds(List<Integer> aLessonIds) {
		lessonIds = aLessonIds;
	}
	
	@Override
	public boolean equals(Object aObj) {
		if (this == aObj) {
			return true;
		}
		if (!(aObj instanceof Cource)) {
			return false;
		}
		if (!super.equals(aObj)) {
            return false;
        }
		Cource other = (Cource)aObj;
		return Objects.equal(lessonIds, other.lessonIds);
	}
	
	@Override
	public int hashCode() {
		return Objects.hashCode(super.hashCode(), lessonIds);
	}
	
	@Override
    public String toString() {
        return "Cource [getId()="
                + getId() + ", getTitle()=" + getTitle() + ", getTitleImage()=" + getTitleImage()
                + ", getDescription()=" + getDescription() + ", getImage()=" + getImage()
                + ", lessonIds=" + lessonIds + "]";
    }

}
