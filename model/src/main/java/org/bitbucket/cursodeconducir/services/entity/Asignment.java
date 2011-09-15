package org.bitbucket.cursodeconducir.services.entity;

import javax.persistence.Id;

public class Asignment {
    @Id
    private long id;
    
    private User user;
    private Cource cource;
    
}
