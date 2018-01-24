var tape = require("tape")

var parseOptions = require("../../../lib/proto/parse-options.js")
tape("test parse initalization options function", function(t) {
  // via http://stackoverflow.com/questions/1173549/how-to-determine-if-an-object-is-an-object-literal-in-javascript
  function isObjLiteral(_obj) {
    var _test = _obj;
    return (typeof _obj !== "object" || _obj === null ?
        false :
        (
          (function() {
            while (!false) {
              if (Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
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
    for (var n in _obj) {
      n = n;
      c++;
    }
    return c;
  }

  t.test("- default options", function(t) {
    var body1 = {};
    var options1 = {};
    parseOptions.apply(body1, [options1]);

    t.equal(body1.options.elements, "a[href], form[action]");
    t.equal(body1.options.selectors.length, 2, "selectors length");
    t.equal(body1.options.selectors[0], "title");
    t.equal(body1.options.selectors[1], ".js-Pjax");
    t.equal(isObjLiteral(body1.options.switches), true);
    t.equal(enumerableKeys(body1.options.switches), 2);// head and body
    t.equal(isObjLiteral(body1.options.switchesOptions), true);
    t.equal(enumerableKeys(body1.options.switchesOptions), 0);
    t.equal(body1.options.history, true);
    t.equal(typeof body1.options.analytics, "function");
    t.equal(body1.options.scrollTo, 0);
    t.equal(body1.options.scrollRestoration, true);
    t.equal(body1.options.cacheBust, true);
    t.equal(body1.options.debug, false);
    t.end();
  });

  // verify analytics always ends up as a function even when passed not a function
  t.test("- analytics is a function", function(t) {
    var body2 = {};
    var options2 = {analytics: "some string"};
    parseOptions.apply(body2, [options2]);

    t.deepEqual(typeof body2.options.analytics, "function");
    t.end();
  });
  // verify that the value false for scrollTo is not squashed
  t.test("- scrollTo remains false", function(t) {
    var body3 = {};
    var options3 = {scrollTo: false};
    parseOptions.apply(body3, [options3]);

    t.deepEqual(body3.options.scrollTo, false);
    t.end();
  });
  t.end()
})
