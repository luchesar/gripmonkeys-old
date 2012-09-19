package org.bitbucket.cursodeconducir;

import org.bitbucket.cursodeconducir.services.CoursesStorageServlet;
import org.bitbucket.cursodeconducir.services.LessonStorageServlet;
import org.bitbucket.cursodeconducir.services.QuestionStorageServlet;
import org.bitbucket.cursodeconducir.services.fileupload.ImageServlet;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.Singleton;
import com.google.inject.servlet.GuiceServletContextListener;
import com.google.inject.servlet.ServletModule;

@Singleton
public class CursoconducirGuiceServletContextListener extends
		GuiceServletContextListener {

	@Override
	protected Injector getInjector() {
		return Guice.createInjector(new ServletModule() {
			@Override
			protected void configureServlets() {
				serve("/image").with(ImageServlet.class);
				serve("/question-storage").with(QuestionStorageServlet.class);
				serve("/lesson-storage").with(LessonStorageServlet.class);
				serve("/course-storage").with(CoursesStorageServlet.class);
			}
		});
	}
}