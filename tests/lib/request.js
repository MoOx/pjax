var tape = require("tape")

var request = require("../../lib/request.js")

tape("test xhr request", function(t) {
  t.test("- request is made, gets a result, and is cache-busted", function(t) {
    var requestCacheBust = request.bind({
      options: {
        cacheBust: true,
      },
    });
    var r = requestCacheBust("https://api.github.com/", function(result) {
      t.equal(r.responseURL.indexOf("?"), 23, "XHR URL is cache-busted when configured to be")
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
  t.test("- request is not cache-busted when configured not to be", function(t) {
    var requestNoCacheBust = request.bind({
      options: {
        cacheBust: false,
      },
    });
    var r = requestNoCacheBust("https://api.github.com/", function() {
      t.equal(r.responseURL, "https://api.github.com/", "XHR URL is left untouched")
      t.end()
    })
  })
  t.end()
})
