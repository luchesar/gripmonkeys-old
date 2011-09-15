package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import javax.persistence.Id;

import org.bitbucket.cursodeconducir.services.testobject.TestObject;

public class Topic {
    @Id
    private long id;
    private String title;
    private String description;
    private Topic topic;
    private List<TestObject> tests;
}
