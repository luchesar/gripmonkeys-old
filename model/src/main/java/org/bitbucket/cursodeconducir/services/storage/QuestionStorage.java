package org.bitbucket.cursodeconducir.services.storage;

import org.bitbucket.cursodeconducir.services.Util;
import org.bitbucket.cursodeconducir.services.entity.Question;

public class QuestionStorage extends TitledEntityStorage<Question> {
	
	public QuestionStorage() {
		super(Question.class);
	}

	static {
		Util.factory().register(Question.class);
	}
}
