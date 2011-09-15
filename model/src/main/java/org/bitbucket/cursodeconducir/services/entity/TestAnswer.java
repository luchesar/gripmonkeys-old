package org.bitbucket.cursodeconducir.services.entity;

import java.util.Date;

import javax.persistence.Id;

import org.bitbucket.cursodeconducir.services.testobject.TestObject;

public class TestAnswer {
    @Id
    private long id;
    private User user;
    private Date date;
    private TestObject test;
    private int answer;
}
