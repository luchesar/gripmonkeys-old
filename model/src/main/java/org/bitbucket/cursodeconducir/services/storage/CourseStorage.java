package org.bitbucket.cursodeconducir.services.storage;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.ServiceException;
import org.bitbucket.cursodeconducir.services.Util;
import org.bitbucket.cursodeconducir.services.entity.Course;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.Query;

public class CourseStorage {

	static {
		Util.factory().register(Course.class);
	}

	public Set<Course> put(final Course... lessons) throws ServiceException {
		Objectify objectify = Util.factory().begin();

		Map<Key<Course>, Course> putResult = objectify.put(Arrays
				.asList(lessons));
		return Sets.newLinkedHashSet(putResult.values());
	}

	public Set<Course> get(final long... ids) {
		Objectify objectify = Util.factory().begin();
		List<Key<Course>> keys = Lists.newArrayList();
		for (long id : ids) {
			keys.add(new Key<Course>(Course.class, id));
		}
		Map<Key<Course>, Course> map = objectify.get(keys);
		return Sets.newLinkedHashSet(map.values());
	}

	public List<Course> getAll() {
		Objectify objectify = Util.factory().begin();
		Query<Course> query = objectify.query(Course.class).order("title");
		return query.list();
	}

	public List<Course> getAll(boolean published) {
		Objectify objectify = Util.factory().begin();
		Query<Course> query = objectify.query(Course.class)
				.filter("published", published).order("title");
		return query.list();
	}

	public List<Course> getAll(int offset, int limit) {
		Objectify objectify = Util.factory().begin();
		Query<Course> query = objectify.query(Course.class).offset(offset)
				.limit(limit).order("title");
		return query.list();
	}

	public Course find(final String title) {
		Objectify objectify = Util.factory().begin();
		Query<Course> query = objectify.query(Course.class).filter("title",
				title);

		if (query.count() < 1) {
			return null;
		}
		if (query.count() > 1) {
			throw new RuntimeException(
					"Found more then one test with the same titme "
							+ query.list());
		}
		return query.get();
	}

	public List<Course> find(final String... titles) {
		Objectify objectify = Util.factory().begin();
		Query<Course> query = objectify.query(Course.class).filter("title in",
				titles);
		return query.list();
	}

	public void delete(final long... ids) {
		Objectify objectify = Util.factory().begin();
		List<Key<Course>> keys = Lists.newArrayList();
		for (long id : ids) {
			keys.add(new Key<Course>(Course.class, id));
		}
		objectify.delete(keys);
	}

}
