goog.provide("cursoconducir.admin.tests.Model");
goog.provide("cursoconducir.admin.lessons.Model");
goog.provide("cursoconducir.admin.courses.Model");

/**
 * @typedef {{allTests:Array.<cursoconducir.Question>, activeTest:?cursoconducir.Question}}
 */
cursoconducir.admin.tests.Model;

/**
 * @typedef {{allLessons:Array.<cursoconducir.Lesson>, activeLesson:?cursoconducir.Lesson}}
 */
cursoconducir.admin.lessons.Model;

/**
 * @typedef {{allCourses:Array.<cursoconducir.Course>, activeCourse:?cursoconducir.Course}}
 */
cursoconducir.admin.courses.Model;