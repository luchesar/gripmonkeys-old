{
  "id": "index",
  "inherits": "plovr-root-config.js",
  
  "modules": {
    "cursoconducir.modules.index": {
      "inputs": ["../src/main/webapp/pages/index_init.js"],
      "deps": []
    },
    "cursoconducir.modules.admin.questions": {
      "inputs": ["../src/main/webapp/pages/admin/questions/questions_init.js"],
      "deps": ["cursoconducir.modules.index"]
    },
    "cursoconducir.modules.admin.lessons": {
      "inputs": ["../src/main/webapp/pages/admin/lessons/lessons_init.js"],
      "deps": ["cursoconducir.modules.index"]
    },
    "cursoconducir.modules.admin.courses": {
      "inputs": ["../src/main/webapp/pages/admin/courses/courses_init.js"],
      "deps": ["cursoconducir.modules.index"]
    }
    
//    , ========================= TESTS ===================================
//    "lesson_test": {
//        "inputs": ["../src/main/webapp/pages/admin/lesson_test.js",
//                   "../src/main/webapp/modules/lesson/allLessons_test.js",
//                   "../src/main/webapp/modules/lesson/lessonForm_test.js",
//                   "../src/main/webapp/modules/testPreview_test.js"
//                   ],
//        "deps": ["index", "admin", "lessons"]
//      }
  },
  "module-output-path": "../target/CursoConducir/jsgen/%s.compiled.js",
  "module-production-uri" : "/jsgen/%s.compiled.js",
//  "debug": true,
  "test-drivers" : [ {"class": "org.openqa.selenium.htmlunit.HtmlUnitDriver"}], 
  "global-scope-name": "__plovr__"
}
