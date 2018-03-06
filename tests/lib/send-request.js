var tape = require("tape")

var sendRequest = require("../../lib/send-request.js")

// Polyfill responseURL property into XMLHttpRequest if it doesn't exist,
// just for the purposes of this test
// This polyfill is not complete; it won't show the updated location if a
// redirection occurred, but it's fine for our purposes.
if (!("responseURL" in XMLHttpRequest.prototype)) {
  var nativeOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function(method, url) {
    this.responseURL = url
    return nativeOpen.apply(this, arguments)
  }
}

tape("test xhr request", function(t) {
  var url = "https://httpbin.org/get"

  t.test("- request is made, gets a result, and is cache-busted", function(t) {
    var r = sendRequest(url, {cacheBust: true}, function(result) {
      t.equal(r.responseURL.indexOf("?"), url.length, "XHR URL is cache-busted when configured to be")
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
    var r = sendRequest(url, {}, function() {
      t.equal(r.responseURL, url, "XHR URL is left untouched")
      t.end()
    })
  })
  t.end()
})
