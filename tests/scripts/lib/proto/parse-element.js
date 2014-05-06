var tape = require("tape")

var parseElement = require("../../../../src/scripts/lib/proto/parse-element")
var protoMock = {attachLink: function() { return true}}
tape("test parse element prototype method", function(t) {

  t.doesNotThrow(function() {
    var a = document.createElement("a")
    parseElement.call(protoMock, a)
  }, "<a> element can be parsed")

  t.throws(function() {
    var form = document.createElement("form")
    parseElement.call(protoMock, form)
  }, "<form> cannot be used (for now)")

  t.end()
})
