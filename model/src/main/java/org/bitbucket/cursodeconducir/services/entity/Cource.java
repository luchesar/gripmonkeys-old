package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import javax.persistence.Id;

import org.bitbucket.cursodeconducir.services.testobject.TestObject;

public class Cource extends TitledEntity {
    private Topic topic;
    private List<TestObject> tests;
}
