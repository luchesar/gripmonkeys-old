package org.bitbucket.cursodeconducir.services;

import java.util.List;

import org.bitbucket.cursodeconducir.services.entity.Lesson;
import org.bitbucket.cursodeconducir.services.storage.LessonStorage;

import com.google.gson.reflect.TypeToken;
import com.google.inject.Singleton;

@Singleton @SuppressWarnings("serial")
public class LessonStorageServlet extends
		TitledEntityStorageServlet<LessonStorage, Lesson> {

	public LessonStorageServlet() {
		super(new LessonStorage(), new TypeToken<List<Lesson>>() {
		});
	}
}
