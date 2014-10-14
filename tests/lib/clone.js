var tape = require("tape")

var clone = require("../../lib/clone")

tape("test clone method", function(t) {
  var obj = {one: 1, two: 2}
  var cloned = clone(obj)

  t.notEqual(obj, cloned, "cloned object isn't the object")

  t.same(obj, cloned, "cloned object have the same values than object")

  cloned.tree = 3
  t.notSame(obj, cloned, "modified cloned object haven't the same values than object")

  t.end()
})
