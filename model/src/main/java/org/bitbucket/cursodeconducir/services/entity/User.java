package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.Transient;

public class User {
    @Id
    private Long id;

    private String name;
    @Id
    private String emailAddress;
    
    private boolean isActive;
    
    @Transient
    private List<Asignment> asignments;
    
    

}
