package org.bitbucket.cursodeconducir.services.entity;

import javax.persistence.Id;

public class User {
    @Id
    private String name;
    @Id
    private String emailAddress;
    
    private History history;
}
