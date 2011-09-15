package org.bitbucket.cursodeconducir.services.testobject;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Id;

public interface TestObject extends Serializable {
    @Id
	String getTitle();

	String getTestBody();

	List<String> getPossibleAnswers();

	int getCorrectAnswerIndex();
}
