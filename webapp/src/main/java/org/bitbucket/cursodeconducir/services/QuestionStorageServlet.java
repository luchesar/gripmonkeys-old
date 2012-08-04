package org.bitbucket.cursodeconducir.services;

import java.util.List;

import org.bitbucket.cursodeconducir.services.entity.Question;
import org.bitbucket.cursodeconducir.services.storage.QuestionStorage;
import com.google.gson.reflect.TypeToken;

@SuppressWarnings("serial")
public class QuestionStorageServlet extends
		TitledEntityStorageServlet<QuestionStorage, Question> {
	public QuestionStorageServlet() {
		super(new QuestionStorage(), new TypeToken<List<Question>>(){});
	}
}
