{
  "paths": ["../src/main/webapp/modules", "../src/main/webapp/pages", "../src/main/webapp/jslib"],
  "mode": "ADVANCED",
  "level": "VERBOSE",
  "externs": ["//jquery-1.6.js"],
  "test-template":"testTemplate.soy",
  "treat-warnings-as-errors": true,
//   "output-charset": "UTF-8"
   "checks": {
	   "accessControls": "ERROR",
	   "visibility": "ERROR",
	   "checkRegExp": "ERROR",
	   "checkTypes": "ERROR",
	   "checkVars": "ERROR",
	   "deprecated": "ERROR",
	   "fileoverviewTags": "ERROR",
	   "invalidCasts": "ERROR",
	   "missingProperties": "ERROR",
	   "nonStandardJsDocs": "ERROR",
	   "undefinedVars": "ERROR",
	   "uselessCode": "ERROR",
	   "globalThis" : "ERROR"
	 },
	 "output-wrapper": "(function(){%output%})();"
}

