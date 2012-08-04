package org.bitbucket.cursodeconducir.services;

import java.util.List;

import org.bitbucket.cursodeconducir.services.entity.Course;
import org.bitbucket.cursodeconducir.services.storage.CourseStorage;

import com.google.gson.reflect.TypeToken;

@SuppressWarnings("serial")
public class CoursesStorageServlet extends TitledEntityStorageServlet<CourseStorage, Course> {

	public CoursesStorageServlet() {
		super(new CourseStorage(), new TypeToken<List<Course>>(){});
	}
}
