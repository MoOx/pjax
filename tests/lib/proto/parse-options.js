var tape = require("tape")

var parseOptions = require("../../../lib/proto/parse-options.js")
tape("test parse initalization options function", function(t) {
  // via http://stackoverflow.com/questions/1173549/how-to-determine-if-an-object-is-an-object-literal-in-javascript
  function isObjLiteral(_obj) {
  var _test  = _obj;
  return (  typeof _obj !== 'object' || _obj === null ?
      false :  
      (
        (function () {
          while (!false) {
            if (  Object.getPrototypeOf( _test = Object.getPrototypeOf(_test)  ) === null) {
              break;
            }      
          }
          return Object.getPrototypeOf(_obj) === _test;
        })()
      )
    );
  }
  function enumerableKeys(_obj) {
    var c = 0;
    for(var n in _obj){ n = n; c++; }
    return c;
  }
  t.test("- default options", function(t){
    var body_1 = {};
    var options_1 = {};
    parseOptions.apply(body_1,[options_1]);

    t.deepEqual(body_1.options.elements,"a[href], form[action]");
    t.deepEqual(body_1.options.selectors.length,2,"selectors length");
    t.deepEqual(body_1.options.selectors[0],"title");
    t.deepEqual(body_1.options.selectors[1],".js-Pjax");
    
    t.deepEqual(isObjLiteral(body_1.options.switches),true);
    t.deepEqual(enumerableKeys(body_1.options.switches),2);//head and body

    t.deepEqual(isObjLiteral(body_1.options.switchesOptions),true);
    t.deepEqual(enumerableKeys(body_1.options.switchesOptions),0);

    t.deepEqual(body_1.options.history,true);

    //TODO analytics is a little weird right now
    t.deepEqual(typeof body_1.options.analytics,"function");

    t.deepEqual(body_1.options.scrollTo,0);
    t.deepEqual(body_1.options.cacheBust,true);
    t.deepEqual(body_1.options.debug,false);
    t.end();
  });

  //verify analytics always ends up as a function even when passed not a function
  t.test("- analytics is a function", function(t){
    var body_2 = {};
    var options_2 = {analytics:"some string"};
    parseOptions.apply(body_2,[options_2]);

    t.deepEqual(typeof body_2.options.analytics,"function");
    t.end();
  });
  //verify that the value false for scrollTo is not squashed
  t.test("- scrollTo remains false", function(t){
    var body_3 = {};
    var options_3 = {scrollTo:false};
    parseOptions.apply(body_3,[options_3]);

    t.deepEqual( body_3.options.scrollTo,false);
    t.end();
  });
  t.end()
})