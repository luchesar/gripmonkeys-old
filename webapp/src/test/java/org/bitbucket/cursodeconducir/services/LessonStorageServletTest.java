package org.bitbucket.cursodeconducir.services;

import static junit.framework.Assert.*;
import static org.mockito.Matchers.*;
import static org.mockito.Mockito.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bitbucket.cursodeconducir.services.entity.Lesson;
import org.bitbucket.cursodeconducir.services.storage.LessonStorage;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.google.common.collect.Lists;
import com.google.gson.Gson;

public class LessonStorageServletTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig(), new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());

    protected LessonStorage storage;
    protected LessonStorageServlet servlet;
    private Gson gson;

    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private ServletOutputStream responseOutputStream;
    private StringWriter responseWriter = new StringWriter();
    
    private int k1 = 1;
    private int k2 = 2;
    private int k3 = 3;

    @Before
    public void setUp() throws Exception {
        helper.setUp();
        gson = new Gson();
        

        MockitoAnnotations.initMocks(this);
        when(response.getOutputStream()).thenReturn(responseOutputStream);
        when(response.getWriter()).thenReturn(new PrintWriter(responseWriter));

        servlet = new LessonStorageServlet();
        storage = servlet.getStorage();
    }

    @After
    public void tearDown() throws Exception {
        helper.tearDown();
    }

    @Test
    public void testDoPut() throws Exception {
        Lesson test1 = new Lesson("title", "image", "description", Lists.newArrayList(k1, k2, k3));
        
        when(request.getParameter(LessonStorageServlet.JSON_KEY)).thenReturn(null);
        servlet.doPut(request, response);

        verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);
        verify(responseOutputStream).write((LessonStorageServlet.INVALID_JSON + null).getBytes());

        when(request.getParameter(LessonStorageServlet.JSON_KEY)).thenReturn(gson.toJson(test1));
        servlet.doPut(request, response);

        List<Lesson> allLessons = storage.getAll();
        assertEquals(1, allLessons.size());

        Lesson storedQuestion = allLessons.iterator().next();
        test1.setId(storedQuestion.getId());

        assertEquals(storedQuestion, test1);

        assertEquals(gson.toJson(storedQuestion), responseWriter.toString());
        verify(response).setStatus(HttpServletResponse.SC_CREATED);
    }
    
    @Test
    public void testDoGet() throws Exception {
        Lesson lesson1 = new Lesson("lesson1", "image", "description", Lists.newArrayList(k1, k2, k3));
        Lesson lesson2 = new Lesson("lesson2", "image", "description", Lists.newArrayList(k1, k2, k3));
        
        lesson1 = storage.put(lesson1).iterator().next();
        lesson2 = storage.put(lesson2).iterator().next();
        
        when(request.getParameter("*")).thenReturn("*");
        servlet.doGet(request, response);
        assertEquals(gson.toJson(Lists.newArrayList(lesson1, lesson2)), responseWriter.toString());
        verify(response, never()).setStatus(anyInt());
        
        when(request.getParameter("*")).thenReturn(null);
        when(request.getParameter(LessonStorageServlet.ID)).thenReturn(lesson2.getId() + "");
        responseWriter.getBuffer().delete(0, responseWriter.getBuffer().length());
        servlet.doGet(request, response);
        verify(response, never()).setStatus(anyInt());
        assertEquals(gson.toJson(lesson2), responseWriter.toString());
        
        when(request.getParameter(LessonStorageServlet.ID)).thenReturn("11111111");
        responseWriter.getBuffer().delete(0, responseWriter.getBuffer().length());
        servlet.doGet(request, response);
        
        assertEquals("", responseWriter.toString());
        verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);
    }
    
    @Test
    public void testDoDelete() throws Exception {
        Lesson lesson1 = new Lesson("lesson1", "image", "description", Lists.newArrayList(k1, k2, k3));
        Lesson lesson2 = new Lesson("lesson2", "image", "description", Lists.newArrayList(k1, k2, k3));
        
        lesson1 = storage.put(lesson1).iterator().next();
        lesson2 = storage.put(lesson2).iterator().next();
        
        when(request.getParameter(LessonStorageServlet.ID)).thenReturn(lesson2.getId() + "");
        servlet.doDelete(request, response);
        
        verify(response, never()).setStatus(anyInt());
        assertEquals(gson.toJson(true), responseWriter.toString());
        
        assertEquals(Lists.newArrayList(lesson1), storage.getAll());
        
        when(request.getParameter(LessonStorageServlet.ID)).thenReturn("1111");
        responseWriter.getBuffer().delete(0, responseWriter.getBuffer().length());
        servlet.doDelete(request, response);
        verify(response, never()).setStatus(anyInt());
        assertEquals(gson.toJson(true), responseWriter.toString());
    }
}
