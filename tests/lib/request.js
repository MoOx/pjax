var tape = require("tape")

var request = require("../../lib/request.js")

tape("test xhr request", function(t) {
  t.test("- request is made and gets a result", function(t) {
    request("https://api.github.com/", function(result) {
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
  t.end()
})
