package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import com.google.common.base.Objects;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Unindexed;

@Cached
@Unindexed
public class Course extends TitledEntity {
	private List<Integer> lessonIds;

	public Course() {
		super();
	}

	public Course(String aTitle, String aImage, String aDescription,
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
		if (!(aObj instanceof Course)) {
			return false;
		}
		if (!super.equals(aObj)) {
            return false;
        }
		Course other = (Course)aObj;
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
