package org.bitbucket.cursodeconducir.services;

import java.util.List;

import org.bitbucket.cursodeconducir.services.entity.Asignment;
import org.bitbucket.cursodeconducir.services.entity.Course;
import org.bitbucket.cursodeconducir.services.entity.Question;
import org.bitbucket.cursodeconducir.services.entity.Lesson;
import org.bitbucket.cursodeconducir.services.entity.User;

public interface HelperService {
    User findUserByName(String name);
    
    User findUserByEmail(String email);
    
    User createUser(String name, String email, String passwordHash);
    
    void activateUser(User user);
    
    void deactivateUser(User user);
    
    List<Asignment> getAsignments(User user);
    
    List<Course> getCources(Asignment asignment);
    
    List<Lesson> getTopics(Course asignment);
    
    List<Question> getTests(Lesson asignment);
}
