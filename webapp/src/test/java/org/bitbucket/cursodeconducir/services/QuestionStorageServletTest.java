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

import org.bitbucket.cursodeconducir.services.entity.Question;
import org.bitbucket.cursodeconducir.services.storage.QuestionStorage;
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

public class QuestionStorageServletTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig(), new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());

    protected QuestionStorage storage;
    protected QuestionStorageServlet servlet;
    private Gson gson;

    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private ServletOutputStream responseOutputStream;
    private StringWriter responseWriter = new StringWriter();

    @Before
    public void setUp() throws Exception {
        helper.setUp();
        gson = new Gson();
        

        MockitoAnnotations.initMocks(this);
        when(response.getOutputStream()).thenReturn(responseOutputStream);
        when(response.getWriter()).thenReturn(new PrintWriter(responseWriter));

        servlet = new QuestionStorageServlet();
        storage = servlet.getStorage();
    }

    @After
    public void tearDown() throws Exception {
        helper.tearDown();
    }

    @Test
    public void testDoPut() throws Exception {
        Question test1 = new Question("title", "image", "description", Lists.newArrayList(
                "question1", "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));

        when(request.getParameter(QuestionStorageServlet.JSON_KEY)).thenReturn(null);
        servlet.doPut(request, response);

        verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);
        verify(responseOutputStream).write((QuestionStorageServlet.INVALID_JSON + null).getBytes());

        when(request.getParameter(QuestionStorageServlet.JSON_KEY)).thenReturn(gson.toJson(test1));
        servlet.doPut(request, response);

        List<Question> allTests = storage.getAll();
        assertEquals(1, allTests.size());

        Question storedQuestion = allTests.iterator().next();
        test1.setId(storedQuestion.getId());

        assertEquals(storedQuestion, test1);

        assertEquals(gson.toJson(storedQuestion), responseWriter.toString());
        verify(response).setStatus(HttpServletResponse.SC_CREATED);
    }
    
    @Test
    public void testDoGet() throws Exception {
        Question question1 = new Question("question1", "image", "description", Lists.newArrayList(
                "question1", "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Question question2 = new Question("question2", "image", "description", Lists.newArrayList(
                "question1", "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        
        question1 = storage.put(question1).iterator().next();
        question2 = storage.put(question2).iterator().next();
        
        when(request.getParameter("*")).thenReturn("*");
        servlet.doGet(request, response);
        assertEquals(gson.toJson(Lists.newArrayList(question1, question2)), responseWriter.toString());
        verify(response, never()).setStatus(anyInt());
        
        when(request.getParameter("*")).thenReturn(null);
        when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(question2.getId() + "");
        responseWriter.getBuffer().delete(0, responseWriter.getBuffer().length());
        servlet.doGet(request, response);
        verify(response, never()).setStatus(anyInt());
        assertEquals(gson.toJson(question2), responseWriter.toString());
        
        when(request.getParameter(QuestionStorageServlet.ID)).thenReturn("11111111");
        responseWriter.getBuffer().delete(0, responseWriter.getBuffer().length());
        servlet.doGet(request, response);
        
        assertEquals("", responseWriter.toString());
        verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);
    }
    
    @Test
    public void testDoDelete() throws Exception {
        Question question1 = new Question("question1", "image", "description", Lists.newArrayList(
                "question1", "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Question question2 = new Question("question2", "image", "description", Lists.newArrayList(
                "question1", "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        
        question1 = storage.put(question1).iterator().next();
        question2 = storage.put(question2).iterator().next();
        
        when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(question2.getId() + "");
        servlet.doDelete(request, response);
        
        verify(response, never()).setStatus(anyInt());
        assertEquals(gson.toJson(true), responseWriter.toString());
        
        assertEquals(Lists.newArrayList(question1), storage.getAll());
        
        when(request.getParameter(QuestionStorageServlet.ID)).thenReturn("1111");
        responseWriter.getBuffer().delete(0, responseWriter.getBuffer().length());
        servlet.doDelete(request, response);
        verify(response, never()).setStatus(anyInt());
        assertEquals(gson.toJson(true), responseWriter.toString());
    }
}
