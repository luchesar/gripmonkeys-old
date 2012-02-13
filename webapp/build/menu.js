// This file was automatically generated from menu.soy.
// Please don't edit this file by hand.

if (typeof cursoconducir == 'undefined') { var cursoconducir = {}; }


cursoconducir.menu = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="under-construction-modal" class="modal hide fade" style="width: 600px; left: 47%"><div class="modal-header"><a href="#" class="close">&times;</a><h2>En construcción</h2></div><div id="under-construction-modal-body" class="modal-body"><div class="container"><div class="row"><div class="span4"><a> <img class="thumbnail pull-left" src="/images/under-construction.jpg" /> </a></div><div class="span6"><p>La web Cursoconducir.com está siendo mejorada. <a href="http://www.CursoConducir.es">CursoConducir.es</a> es la nueva página web a la que usted ha sido redirigido.</p><p>En estos momentos <a href="http://www.CursoConducir.es">CursoConducir.es</a> esta en fase de desarrollo, puedes realizar las primeras preguntas de los Test Especiales, el resto de contenidos de <a href="http://www.CursoConducir.com">CursoConducir.com</a> seran anadidos pronto.</p></div></div></div></div><div class="modal-footer"><a class="btn close">Cerrar</a></div></div><div class="topbar"><div class="fill"><div class="container"><a class="brand pull-right" href="/"><img src="/images/logo.png" /></img></a><div class="pull-right"><ul class="nav"><li><a href="#" data-controls-modal="under-construction-modal" data-keyboard="true" data-backdrop="static">Cursos</a></li><li><a href="/login" data-controls-modal="under-construction-modal" data-keyboard="true" data-backdrop="static">Acceder</a></li></ul><form action=""><input class="input-small" type="text" placeholder="Email"> <input class="input-small" type="password" placeholder="Contraseña"><button class="btn" type="submit" data-controls-modal="under-construction-modal" data-keyboard="true" data-backdrop="static">Entrar</button></form><ul class="nav"><li><a href="#" data-controls-modal="under-construction-modal" data-keyboard="true" data-backdrop="static">Regístrate</a></li></ul></div></div></div></div>');
  return opt_sb ? '' : output.toString();
};

;
// This file was automatically generated from allTests.soy.
// Please don't edit this file by hand.

if (typeof cursoconducir == 'undefined') { var cursoconducir = {}; }


cursoconducir.allTests = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="allTestsContainer">');
  var testList7 = opt_data.allTests;
  var testListLen7 = testList7.length;
  if (testListLen7 > 0) {
    for (var testIndex7 = 0; testIndex7 < testListLen7; testIndex7++) {
      var testData7 = testList7[testIndex7];
      output.append('<div id="testInAList" class="container"><div class="container mini-layout"><div class="row"><div class="span2"><div class="media-grid"><a id="testImage" style="margin: 0 0 0px 20px;" href="#update?test=', soy.$$escapeHtml(testData7.id), '"> <img class="thumbnail" src="/image?key=', soy.$$escapeHtml(testData7.image), '&s=80&falback=/images/80x50.gif" alt=""> </a></div></div><div class="span12 pull-left"><h4><a id="testTitleLink" href="#update?test=', soy.$$escapeHtml(testData7.id), '">', soy.$$escapeHtml(test.title), '&nbsp;</a></h4><div id="testDescription">', soy.$$escapeHtml(test.description), '</div></div><div class="span2"><a id="deleteTest" class="btn small disabled" >Delete</a><!-- href="#delete?test=', soy.$$escapeHtml(testData7.id), '" -->', (testData7.published) ? '<a id="changeTestPublishment" class="btn small disabled" >Publish</a><!-- href="#publish?test=' + soy.$$escapeHtml(testData7.id) + '" -->' : '<a id="changeTestPublishment" class="btn small disabled"> Unpublish</a><!-- href="#unpublish?test=' + soy.$$escapeHtml(testData7.id) + '" -->', '</div></div></div></div>');
    }
  } else {
    output.append('<small>No tests yet</small>');
  }
  output.append('</div>');
  return opt_sb ? '' : output.toString();
};
