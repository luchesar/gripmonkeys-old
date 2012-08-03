package org.bitbucket.cursodeconducir.services.entity;

import javax.persistence.Id;

import com.googlecode.objectify.annotation.Parent;

public class Asignment {
    @Id
    private long id;
    
    private boolean isComplate;
    @Parent
    private User user;
    private Course cource;
    
}
