package org.bitbucket.cursodeconducir.services.testobject;


import java.util.Set;

import org.bitbucket.cursodeconducir.services.ServiceException;

public interface TestObjectStorage {
    String ENTITY_NAME="TestObject";
    String PROP_TITLE="TestObject.title";
    String PROP_BODY="TestObject.body";
    String PROP_POSSIBLE_ANSWER="TestObject.possibleAnswer";
    String PROP_POSSIBLE_ANSWER_INDEX="TestObject.possibleAnswer.index";
    String PROP_POSSIBLE_ANSWER_CONTENT="TestObject.possibleAnswer.content";
    String PROP_CORRECT_ANSWER_INDEX="TestObject.correctAnswerIndex";
    
    void store(TestObject testObject) throws ServiceException;
    
    Set<String> getTestTitles() throws ServiceException;
	
	TestObject load(String title) throws ServiceException;

    boolean delete(String title) throws ServiceException;
}
