var tape = require("tape")

var request = require("../../lib/request.js")

tape("test xhr request", function(t) {
  var xhr = request("https://api.github.com/", function(result) {
    try {
      result = JSON.parse(result)
    }
    catch (e) {
      t.fail("xhr doesn't get a JSON response")
    }
    t.same(typeof result, "object", "xhr request get a result")
    t.end()
  })
})
