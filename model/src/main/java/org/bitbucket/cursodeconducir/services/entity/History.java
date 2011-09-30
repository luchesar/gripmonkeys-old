package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import javax.persistence.Id;

public class History {
    @Id
    private long id;
    private User user;
}
