goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.testing.MockClock');
goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.TestCase.Test');
goog.require('goog.testing.jsunit');


var testCase = new goog.testing.ContinuationTestCase('Continuation Test Case');
testCase.autoDiscoverTests();

if (typeof G_testRunner != 'undefined') {
  G_testRunner.initialize(testCase);
}

var setUp = function() {
}

function testWaiting() {
	var someVar = true;
	waitForTimeout(function() {
		assertTrue(someVar)
	}, 500);
}

function testWaitForCondition() {
	var counter = 0;

	waitForCondition(function() {
		// This function is evaluated periodically until it returns true, or it
		// times out.
		return ++counter >= 3;
	}, function() {
		// This test step is run once the condition becomes true.
		assertEquals(3, counter);
	});
}
