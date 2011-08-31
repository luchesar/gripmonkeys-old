package org.bitbucket.cursodeconducir.services.testobject;

import java.io.Serializable;
import java.util.List;

public interface TestObject extends Serializable {
	String getTitle();

	String getTestBody();

	List<String> getPossibleAnswers();

	int getCorrectAnswerIndex();
}
