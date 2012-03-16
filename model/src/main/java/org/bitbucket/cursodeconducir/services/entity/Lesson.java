package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.Transient;

public class Lesson {
    @Id
    private Long id;
    private String title;
    private String description;
    private Lesson topic;
    @Transient
    private List<Question> tests;
}
