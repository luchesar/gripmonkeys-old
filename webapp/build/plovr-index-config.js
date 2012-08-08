{
  "id": "index",
  "inherits": "plovr-root-config.js",
  
  "modules": {
    "index": {
      "inputs": ["../src/main/webapp/pages/index.js"],
      "deps": []
    },
    "admin": {
      "inputs": ["../src/main/webapp/pages/admin/tests.js"],
      "deps": ["index"]
    },
    "lessons": {
      "inputs": ["../src/main/webapp/pages/admin/lessons.js"],
      "deps": ["index"]
    }
  },
  "module-output-path": "../target/CursoConducir/jsgen/%s.compiled.js"
}
