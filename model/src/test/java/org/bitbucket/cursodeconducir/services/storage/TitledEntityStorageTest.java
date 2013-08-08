package org.bitbucket.cursodeconducir.services.storage;

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertNotSame;
import static junit.framework.Assert.assertNull;
import static junit.framework.Assert.assertTrue;

import java.util.Iterator;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.Util;
import org.bitbucket.cursodeconducir.services.entity.TitledEntity;
import org.junit.After;
import org.junit.Before;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

public class TitledEntityStorageTest {
	private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
			new LocalDatastoreServiceTestConfig(),
			new LocalMemcacheServiceTestConfig(),
			new LocalTaskQueueTestConfig());

	protected TitledEntityStorage<MockTitledEntity> storage;
	private MockTitledEntity titledEntity1;
	private MockTitledEntity titledEntity2;
	private MockTitledEntity titledEntity3;
	private MockTitledEntity titledEntity4;
	
	static {
		Util.factory().register(MockTitledEntity.class);
	}

	@Before
	public void setUp() throws Exception {
		helper.setUp();
		storage = new TitledEntityStorage<MockTitledEntity>(MockTitledEntity.class){};

		titledEntity1 = newTE(1);
		titledEntity2 = newTE(2);
		titledEntity3 = newTE(3);
		titledEntity4 = newTE(4);
	}

	@After
	public void tearDown() throws Exception {
		helper.tearDown();
	}
	
	private static MockTitledEntity newTE(int i) {
		return new MockTitledEntity("titledEntity" + i, "image" + i, "description" + i);
	}

	@org.junit.Test
	public void testStore() throws Exception {
		titledEntity1.setPublished(false);
		MockTitledEntity storedQuestions = putAndGet(titledEntity1);

		assertNotSame(titledEntity1, storedQuestions);
		assertEquals(titledEntity1, storedQuestions);

		assertEquals(Lists.newArrayList(titledEntity1), storage.getAll());
	}

	@org.junit.Test
	public void testStoreBatch() throws Exception {

		Set<MockTitledEntity> result = storage.put(titledEntity1, titledEntity2, titledEntity3,
				titledEntity4);
		Iterator<MockTitledEntity> iterator = result.iterator();
		assertEquals(titledEntity1, iterator.next());
		assertEquals(titledEntity2, iterator.next());
		assertEquals(titledEntity3, iterator.next());
		assertEquals(titledEntity4, iterator.next());
	}

	@org.junit.Test
	public void testStoreSameTitle() throws Exception {
		MockTitledEntity test1 = newTE(1);
		MockTitledEntity test2 = newTE(1);
		test2.setDescription("different description");

		Set<MockTitledEntity> puts = storage.put(test1, test2);
		Iterator<MockTitledEntity> iterator = puts.iterator();
		MockTitledEntity e1 = iterator.next();
		MockTitledEntity e2 = iterator.next();
		
		assertTrue(e1.getId() != e2.getId());
		assertEquals(e1.getTitle(), e2.getTitle());
		
		MockTitledEntity test3 = newTE(1);
		MockTitledEntity e3 = storage.put(test3).iterator().next();
		assertTrue(e1.getId() != e3.getId());
		assertTrue(e2.getId() != e3.getId());
		assertEquals(e1.getTitle(), e2.getTitle());
	}

	@org.junit.Test
	public void testUpdate() throws Exception {
		titledEntity1 = storage.put(titledEntity1).iterator().next();
		titledEntity1.setTitleImage("new Image");
		storage.put(titledEntity1);

		assertEquals(Sets.newHashSet(titledEntity1), storage.get(titledEntity1.getId()));
		assertEquals(Lists.newArrayList(titledEntity1), storage.getAll());
	}

	@org.junit.Test
	public void testStoreAndGetMultiple() throws Exception {
		storage.put(titledEntity1, titledEntity2);
		assertEquals(Lists.newArrayList(titledEntity1, titledEntity2), storage.getAll());

		storage.delete(titledEntity1.getId());
		assertEquals(Lists.newArrayList(titledEntity2), storage.getAll());
		storage.delete(titledEntity2.getId());
		assertEquals(Lists.newArrayList(), storage.getAll());
	}

	@org.junit.Test
	public void testGetMultipleMissing() throws Exception {
		storage.put(titledEntity1, titledEntity2);
		assertEquals(Sets.newHashSet(titledEntity1, titledEntity2),
				storage.get(titledEntity1.getId(), titledEntity2.getId(), 234));
	}

	@org.junit.Test
	public void testFindByTitle() throws Exception {
		storage.put(titledEntity1, titledEntity2);

		assertEquals(titledEntity1, storage.find(titledEntity1.getTitle()));
		assertEquals(titledEntity2, storage.find(titledEntity2.getTitle()));

		assertNull(storage.find("missing title"));
	}

	@org.junit.Test
	public void testFindMultipleByTitle() throws Exception {
		storage.put(titledEntity1, titledEntity2, titledEntity3, titledEntity4);

		assertEquals(Lists.newArrayList(titledEntity2, titledEntity4),
				storage.find(titledEntity2.getTitle(), titledEntity4.getTitle()));
		assertEquals(Lists.newArrayList(titledEntity1, titledEntity3),
				storage.find(titledEntity1.getTitle(), titledEntity3.getTitle()));
		assertEquals(Lists.newArrayList(),
				storage.find("missing title", "missingTitle2"));
	}

	@org.junit.Test
	public void testFindMissingTitle() throws Exception {
		assertNull(storage.find("missing title"));
	}

	@org.junit.Test
	public void testDeleteBatch() throws Exception {
		storage.put(titledEntity1, titledEntity2);
		assertEquals(Lists.newArrayList(titledEntity1, titledEntity2), storage.getAll());

		storage.delete(titledEntity1.getId(), titledEntity2.getId());
		assertEquals(Lists.newArrayList(), storage.getAll());
	}

	@org.junit.Test
	public void testDeleteMissingId() throws Exception {
		storage.delete(1000);
		storage.delete(1001);
	}

	@org.junit.Test
	public void testGetAllOffsetLimit() throws Exception {
		MockTitledEntity test1 = new MockTitledEntity("A_title1", "image", "description");
		MockTitledEntity test2 = new MockTitledEntity("Z_title2", "image", "description");
		MockTitledEntity test3 = new MockTitledEntity("a_title3", "image", "description");
		MockTitledEntity test4 = new MockTitledEntity("z_title4", "image", "description");

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
		MockTitledEntity test1 = new MockTitledEntity("A_title1", "image", "description");
		MockTitledEntity test2 = new MockTitledEntity("Z_title2", "image", "description");
		MockTitledEntity test3 = new MockTitledEntity("a_title3", "image", "description");
		MockTitledEntity test4 = new MockTitledEntity("z_title4", "image", "description");

		storage.put(test4, test1, test3, test2);
		assertEquals(Lists.newArrayList(test1, test2, test3, test4),
				storage.getAll());
	}

	public void _testGetAllSortedNumbers() throws Exception {
		MockTitledEntity test1 = new MockTitledEntity("1.", "image", "description");
		MockTitledEntity test2 = new MockTitledEntity("10.", "image", "description");
		MockTitledEntity test3 = new MockTitledEntity("11.", "image", "description");
		MockTitledEntity test4 = new MockTitledEntity("100.", "image", "description");

		storage.put(test4, test1, test3, test2);
		assertEquals(Lists.newArrayList(test1, test2, test3, test4),
				storage.getAll());
	}

	@org.junit.Test
	public void testGetAllPublished() throws Exception {
		MockTitledEntity test1 = new MockTitledEntity("A_title1", "image", "description");
		MockTitledEntity test2 = new MockTitledEntity("Z_title2", "image", "description");
		MockTitledEntity test3 = new MockTitledEntity("a_title3", "image", "description");
		MockTitledEntity test4 = new MockTitledEntity("z_title4", "image", "description");

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
		MockTitledEntity test1 = new MockTitledEntity("title1", "image", "description");
		MockTitledEntity test2 = new MockTitledEntity("title2", "image", "description");
		MockTitledEntity test3 = new MockTitledEntity("title3", "image", "description");
		MockTitledEntity test4 = new MockTitledEntity("title4", "image", "description");

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
	
	@org.junit.Test
	public void testCount() throws Exception {
		MockTitledEntity test1 = new MockTitledEntity("title1", "image", "description");
		MockTitledEntity test2 = new MockTitledEntity("title2", "image", "description");
		MockTitledEntity test3 = new MockTitledEntity("title3", "image", "description");
		MockTitledEntity test4 = new MockTitledEntity("title4", "image", "description");
		test1.setPublished(true);
		test2.setPublished(true);
		test3.setPublished(true);
		test4.setPublished(true);

		assertEquals(0, storage.count(true));
		assertEquals(0, storage.count(false));
		storage.put(test1);
		assertEquals(1, storage.count(true));
		assertEquals(1, storage.count(false));
		storage.put(test2);
		assertEquals(2, storage.count(true));
		storage.put(test3);
		assertEquals(3, storage.count(true));
		storage.put(test4);
		assertEquals(4, storage.count(true));
		
		test1.setPublished(false);
		storage.put(test1);
		assertEquals(3, storage.count(true));
		
		test2.setPublished(false);
		storage.put(test2);
		assertEquals(2, storage.count(true));
		storage.delete(test3.getId());
		assertEquals(1, storage.count(true));
		storage.delete(test4.getId());
		assertEquals(0, storage.count(true));
		
		assertEquals(2, storage.count(false));
	}

	protected MockTitledEntity putAndGet(MockTitledEntity saveMe) throws Exception {
		Set<MockTitledEntity> put = storage.put(saveMe);
		return storage.get(put.iterator().next().getId()).iterator().next();
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