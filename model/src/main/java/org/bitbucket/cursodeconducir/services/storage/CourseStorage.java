package org.bitbucket.cursodeconducir.services.storage;

import org.bitbucket.cursodeconducir.services.Util;
import org.bitbucket.cursodeconducir.services.entity.Course;

public class CourseStorage extends TitledEntityStorage<Course> {

	static {
		Util.factory().register(Course.class);
	}
	
	public CourseStorage() {
		super(Course.class);
	}
}
