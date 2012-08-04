package org.bitbucket.cursodeconducir.services;

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.fail;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bitbucket.cursodeconducir.services.entity.TitledEntity;
import org.bitbucket.cursodeconducir.services.storage.TitledEntityStorage;
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
import com.google.gson.reflect.TypeToken;

public class TitledEntityStorageServletTest {
	private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
			new LocalDatastoreServiceTestConfig(),
			new LocalMemcacheServiceTestConfig(),
			new LocalTaskQueueTestConfig());

	protected TitledEntityStorage<MockTitledEntity> storage;
	protected TitledEntityStorageServlet<TitledEntityStorage<MockTitledEntity>, MockTitledEntity> servlet;
	private Gson gson;

	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private ServletOutputStream responseOutputStream;
	private StringWriter responseWriter = new StringWriter();

	private MockTitledEntity te1;
	private MockTitledEntity te2;
	
	static {
		Util.factory().register(MockTitledEntity.class);
	}

	@SuppressWarnings("serial")
	@Before
	public void setUp() throws Exception {
		helper.setUp();
		gson = new Gson();

		MockitoAnnotations.initMocks(this);
		resetResponse();

		storage = new TitledEntityStorage<MockTitledEntity>(
				MockTitledEntity.class) {
		};
		TypeToken<List<MockTitledEntity>> typeToken = new TypeToken<List<MockTitledEntity>>() {
		};
		servlet = new TitledEntityStorageServlet<TitledEntityStorage<MockTitledEntity>, MockTitledEntity>(
				storage, typeToken) {
		};
		storage = servlet.getStorage();

		te1 = newTE(1);
		te2 = newTE(2);
	}

	private MockTitledEntity newTE(int i) {
		return new MockTitledEntity("titledEntity" + i, "image" + i, "description" + i);
	}

	private void resetResponse() throws IOException {
		reset(response);
		when(response.getOutputStream()).thenReturn(responseOutputStream);
		responseWriter = new StringWriter();
		when(response.getWriter()).thenReturn(new PrintWriter(responseWriter));
	}

	@After
	public void tearDown() throws Exception {
		helper.tearDown();
	}

	@Test
	public void testDoPut() throws Exception {
		when(request.getParameter(TitledEntityStorageServlet.JSON_KEY))
				.thenReturn(null);
		servlet.doPut(request, response);

		verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);
		verify(responseOutputStream).write(
				(TitledEntityStorageServlet.INVALID_JSON + null).getBytes());

		when(request.getParameter(TitledEntityStorageServlet.JSON_KEY))
				.thenReturn(gson.toJson(Lists.newArrayList(te1)));
		servlet.doPut(request, response);

		List<MockTitledEntity> allTests = storage.getAll();
		assertEquals(1, allTests.size());

		MockTitledEntity storedQuestion = allTests.iterator().next();
		te1.setId(storedQuestion.getId());

		assertEquals(storedQuestion, te1);

		assertEquals(gson.toJson(Lists.newArrayList(storedQuestion)),
				responseWriter.toString());
		verify(response).setStatus(HttpServletResponse.SC_CREATED);
	}

	@Test
	public void testDoPutMultiple() throws Exception {
		when(request.getParameter(TitledEntityStorageServlet.JSON_KEY))
				.thenReturn(gson.toJson(Lists.newArrayList(te1, te2)));
		servlet.doPut(request, response);

		List<MockTitledEntity> allTests = storage.getAll();
		assertEquals(2, allTests.size());

		Iterator<MockTitledEntity> iterator = allTests.iterator();
		MockTitledEntity storedQuestion1 = iterator.next();
		MockTitledEntity storedQuestion2 = iterator.next();
		te1.setId(storedQuestion1.getId());
		te2.setId(storedQuestion2.getId());

		assertEquals(storedQuestion1, te1);
		assertEquals(storedQuestion2, te2);

		assertEquals(gson.toJson(Lists.newArrayList(storedQuestion1,
				storedQuestion2)), responseWriter.toString());
	}

	@Test
	public void testDoGet() throws Exception {
		te1 = storage.put(te1).iterator().next();
		te2 = storage.put(te2).iterator().next();

		when(request.getParameter("*")).thenReturn("*");
		servlet.doGet(request, response);
		assertEquals(gson.toJson(Lists.newArrayList(te1, te2)),
				responseWriter.toString());
		verify(response, never()).setStatus(anyInt());

		when(request.getParameter("*")).thenReturn(null);
		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				te2.getId() + "");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(te2), responseWriter.toString());

		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				"11111111");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);

		assertEquals("", responseWriter.toString());
		verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				te1.getId() + "," + te2.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new MockTitledEntity[] { te1, te2 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				te2.getId() + "," + te1.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new MockTitledEntity[] { te2, te1 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				te1.getId() + ",768," + te2.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new MockTitledEntity[] { te1, te2 }),
				responseWriter.toString());
	}

	@Test
	public void testDoGetPaged() throws Exception {
		te1 = storage.put(te1).iterator().next();
		te2 = storage.put(te2).iterator().next();
		MockTitledEntity te3 = storage
				.put(newTE(3)).iterator().next();
		MockTitledEntity te4 = storage
				.put(newTE(4)).iterator().next();
		MockTitledEntity te5 = storage
				.put(newTE(5)).iterator().next();

		when(request.getParameter(TitledEntityStorageServlet.OFFSET))
				.thenReturn("-1");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH))
				.thenReturn("1");
		servlet.doGet(request, response);
		verify(response).setStatus(HttpServletResponse.SC_BAD_REQUEST);

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET))
				.thenReturn("0");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH))
				.thenReturn("-1");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new MockTitledEntity[] { te1, te2, te3, te4,
				te5 }), responseWriter.toString());

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET))
				.thenReturn("0");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH))
				.thenReturn("1");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new MockTitledEntity[] { te1 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET))
				.thenReturn("1");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH))
				.thenReturn("1");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new MockTitledEntity[] { te2 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET))
				.thenReturn("1");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH))
				.thenReturn("4");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(
				gson.toJson(new MockTitledEntity[] { te2, te3, te4, te5 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET))
				.thenReturn("3");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH))
				.thenReturn("5");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new MockTitledEntity[] { te4, te5 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET))
				.thenReturn("1");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH))
				.thenReturn("3");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new MockTitledEntity[] { te2, te3, te4 }),
				responseWriter.toString());
	}
	
	public void testDoGetFiltered() throws Exception {
		fail();
	}
	
	public void testDoGetFilteredAndPaged() throws Exception {
		fail();
	}

	@Test
	public void testDoDelete() throws Exception {
		te1 = storage.put(te1).iterator().next();
		te2 = storage.put(te2).iterator().next();

		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				te2.getId() + "");
		servlet.doDelete(request, response);

		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());

		assertEquals(Lists.newArrayList(te1), storage.getAll());

		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				"1111");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doDelete(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());
	}

	@Test
	public void testDoDeleteMultiple() throws Exception {
		te1 = storage.put(te1).iterator().next();
		te2 = storage.put(te2).iterator().next();

		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				te1.getId() + "," + te2.getId());
		servlet.doDelete(request, response);

		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());

		assertEquals(Lists.newArrayList(), storage.getAll());
	}
	
	private static final class MockTitledEntity extends TitledEntity {
		@SuppressWarnings("unused")
		public MockTitledEntity() {
		}
		public MockTitledEntity(String aTitle, String aImage,
				String aDescription) {
			super(aTitle, aImage, aDescription);
		}
	}
}
