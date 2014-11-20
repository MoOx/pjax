var tape = require("tape")

var parseOptions = require("../../../lib/proto/parse-options")
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
    for(var n in _obj){ c++; }
    return cl
  }
  
  var body_1 = {};
  var options_1 = {};
  parseOptions.apply(body_1,options_1);

  t.deepEqual(body_1.options.elements,"a[href], form[action]");
  t.deepEqual(body_1.options.selectors.length,2);
  t.deepEqual(body_1.options.selectors[0],"title");
  t.deepEqual(body_1.options.selectors[0],".js-Pjax");
  
  t.deepEqual(isObjLiteral(body_1.options.switches),true);
  t.deepEqual(enumerableKeys(body_1.options.switches),0);

  t.deepEqual(isObjLiteral(body_1.options.switchesOptions),true);
  t.deepEqual(enumerableKeys(body_1.options.switchesOptions),0);

  t.deepEqual(body_1.options.history,true);

  //TODO analytics is a little weird right now
  t.deepEqual(typeof body_1.options.analytics,"function");

  t.deepEqual(body_1.options.scrollTo,0);
  t.deepEqual(body_1.options.debug,false);

  //verify analytics always ends up as a function even when passed not a function
  var body_2 = {};
  var options_2 = {analytics:"some string"};
  parseOptions.apply(body_2,options_2);

  t.deepEqual(typeof body_2.options.analytics,"function");

  //verify that the value false for scrollTo is not squashed
  var body_3 = {};
  var options_3 = {scrollTo:false};
  parseOptions.apply(body_3,options_3);

  t.deepEqual( body_2.options.scrollTo,false);

  t.end()
})