package org.bitbucket.cursodeconducir.services.storage;

import static junit.framework.Assert.*;

import java.util.Iterator;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.ServiceException;
import org.bitbucket.cursodeconducir.services.entity.Question;
import org.junit.After;
import org.junit.Before;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;

public class QuestionStorageTest {
	private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
			new LocalDatastoreServiceTestConfig(),
			new LocalMemcacheServiceTestConfig(),
			new LocalTaskQueueTestConfig());

	protected QuestionStorage storage;
	private Question question1;
	private Question question2;
	private Question question3;
	private Question question4;

	@Before
	public void setUp() throws Exception {
		helper.setUp();
		storage = new QuestionStorage();

		question1 = new Question("test1", "image1", "description1",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		question2 = new Question("test2", "image1", "description1",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		question3 = new Question("title3", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		question4 = new Question("title4", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
	}

	@After
	public void tearDown() throws Exception {
		helper.tearDown();
	}

	@org.junit.Test
	public void testStore() throws Exception {
		Question question1 = new Question("title", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		question1.setPublished(false);
		Question storedQuestions = putAndGet(question1);

		assertNotSame(question1, storedQuestions);
		assertEquals(question1, storedQuestions);

		assertEquals(Lists.newArrayList(question1), storage.getAll());
	}

	@org.junit.Test
	public void testStoreBatch() throws Exception {

		Set<Question> result = storage.put(question1, question2, question3,
				question4);
		Iterator<Question> iterator = result.iterator();
		assertEquals(question1, iterator.next());
		assertEquals(question2, iterator.next());
		assertEquals(question3, iterator.next());
		assertEquals(question4, iterator.next());
	}

	public void testStoreSameTitle() throws Exception {
		Question test1 = new Question("title", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test2 = new Question("title", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));

		try {
			storage.put(test1, test2);
			fail("Should not be able to store a test with the same title");
		} catch (ServiceException e) {
			assertEquals(Lists.newArrayList(test1), storage.getAll());
		}

		try {
			storage.put(test2);
			fail("Should not be able to store a test with the same title");
		} catch (ServiceException e) {
			assertEquals(Lists.newArrayList(test1), storage.getAll());
		}
	}

	@org.junit.Test
	public void testUpdate() throws Exception {
		Question test1 = new Question("title", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));

		test1 = storage.put(test1).iterator().next();
		test1.setTitleImage("new Image");
		storage.put(test1);

		assertEquals(Sets.newHashSet(test1), storage.get(test1.getId()));
		assertEquals(Lists.newArrayList(test1), storage.getAll());
	}

	@org.junit.Test
	public void testStoreAndGetMultiple() throws Exception {
		storage.put(question1, question2);
		assertEquals(Lists.newArrayList(question1, question2), storage.getAll());

		storage.delete(question1.getId());
		assertEquals(Lists.newArrayList(question2), storage.getAll());
		storage.delete(question2.getId());
		assertEquals(Lists.newArrayList(), storage.getAll());
	}

	@org.junit.Test
	public void testGetMultipleMissing() throws Exception {
		storage.put(question1, question2);
		assertEquals(Sets.newHashSet(question1, question2),
				storage.get(question1.getId(), question2.getId(), 234));
	}

	@org.junit.Test
	public void testFindByTitle() throws Exception {
		storage.put(question1, question2);

		assertEquals(question1, storage.find(question1.getTitle()));
		assertEquals(question2, storage.find(question2.getTitle()));

		assertNull(storage.find("missing title"));
	}

	@org.junit.Test
	public void testFindMultipleByTitle() throws Exception {
		storage.put(question1, question2, question3, question4);

		assertEquals(Lists.newArrayList(question2, question4),
				storage.find(question2.getTitle(), question4.getTitle()));
		assertEquals(Lists.newArrayList(question1, question3),
				storage.find(question1.getTitle(), question3.getTitle()));
		assertEquals(Lists.newArrayList(),
				storage.find("missing title", "missingTitle2"));
	}

	@org.junit.Test
	public void testFindMissingTitle() throws Exception {
		assertNull(storage.find("missing title"));
	}

	@org.junit.Test
	public void testDeleteBatch() throws Exception {
		storage.put(question1, question2);
		assertEquals(Lists.newArrayList(question1, question2), storage.getAll());

		storage.delete(question1.getId(), question2.getId());
		assertEquals(Lists.newArrayList(), storage.getAll());
	}

	@org.junit.Test
	public void testDeleteMissingId() throws Exception {
		storage.delete(1000);
		storage.delete(1001);
	}

	@org.junit.Test
	public void testGetAllOffsetLimit() throws Exception {
		Question test1 = new Question("A_title1", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test2 = new Question("Z_title2", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test3 = new Question("a_title3", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test4 = new Question("z_title4", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));

		storage.put(test4, test1, test3, test2);
		assertEquals(Lists.newArrayList(test1, test2, test3, test4),
				storage.getAll(0, 4));
		assertEquals(Lists.newArrayList(test2, test3, test4),
				storage.getAll(1, 3));
		assertEquals(Lists.newArrayList(test2, test3), storage.getAll(1, 2));
		assertEquals(Lists.newArrayList(test3), storage.getAll(2, 1));
	}

	@org.junit.Test
	public void testGetAllSorted() throws Exception {
		Question test1 = new Question("A_title1", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test2 = new Question("Z_title2", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test3 = new Question("a_title3", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test4 = new Question("z_title4", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));

		storage.put(test4, test1, test3, test2);
		assertEquals(Lists.newArrayList(test1, test2, test3, test4),
				storage.getAll());
	}

	public void _testGetAllSortedNumbers() throws Exception {
		Question test1 = new Question("1.", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test2 = new Question("10.", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test3 = new Question("11.", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test4 = new Question("100.", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));

		storage.put(test4, test1, test3, test2);
		assertEquals(Lists.newArrayList(test1, test2, test3, test4),
				storage.getAll());
	}

	@org.junit.Test
	public void testGetAllPublished() throws Exception {
		Question test1 = new Question("A_title1", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test2 = new Question("Z_title2", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test3 = new Question("a_title3", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test4 = new Question("z_title4", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));

		test1.setPublished(true);
		test2.setPublished(true);
		test3.setPublished(false);
		test4.setPublished(false);

		storage.put(test4, test1, test3, test2);
		assertEquals(Lists.newArrayList(test1, test2), storage.getAll(true));
		assertEquals(Lists.newArrayList(test3, test4), storage.getAll(false));
	}

	@org.junit.Test
	public void testBatchGet() throws Exception {
		Question test1 = new Question("title1", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test2 = new Question("title2", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test3 = new Question("title3", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		Question test4 = new Question("title4", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));

		storage.put(test1, test2, test3, test4);
		assertEquals(Lists.newArrayList(test1, test2, test3, test4),
				Lists.newArrayList(storage.get(test1.getId(), test2.getId(),
						test3.getId(), test4.getId())));
		assertEquals(Lists.newArrayList(test4, test2, test3, test1),
				Lists.newArrayList(storage.get(test4.getId(), test2.getId(),
						test3.getId(), test1.getId())));
		assertEquals(Lists.newArrayList(test2, test3, test4),
				Lists.newArrayList(storage.get(test2.getId(), test3.getId(),
						test4.getId())));
		assertEquals(Lists.newArrayList(test3, test4),
				Lists.newArrayList(storage.get(test3.getId(), test4.getId())));
	}

	protected Question putAndGet(Question saveMe) throws Exception {
		Set<Question> put = storage.put(saveMe);
		return storage.get(put.iterator().next().getId()).iterator().next();
	}
}
