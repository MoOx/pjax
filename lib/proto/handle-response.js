var clone = require("./lib/clone.js")
var newUid = require("./lib/uniqueid.js")
var trigger = require("./lib/events/trigger.js")

module.export = function(responseText, request, href) {
  // Fail if unable to load HTML via AJAX
  if (responseText === false) {
    var tempOptions = this.options
    tempOptions.request = request

    trigger(document, "pjax:complete pjax:error", tempOptions)

    return
  }

  // push scroll position to history
  var currentState = window.history.state || {}
  window.history.replaceState({
      url: currentState.url || window.location.href,
      title: currentState.title || document.title,
      uid: currentState.uid || newUid(),
      scrollPos: [document.documentElement.scrollLeft || document.body.scrollLeft,
        document.documentElement.scrollTop || document.body.scrollTop]
    },
    document.title, window.location)

  // Check for redirects
  var oldHref = href
  if (request.responseURL) {
    if (href !== request.responseURL) {
      href = request.responseURL
    }
  }
  else if (request.getResponseHeader("X-PJAX-URL")) {
    href = request.getResponseHeader("X-PJAX-URL")
  }
  else if (request.getResponseHeader("X-XHR-Redirected-To")) {
    href = request.getResponseHeader("X-XHR-Redirected-To")
  }

  // Add back the hash if it was removed
  var a = document.createElement("a")
  a.href = oldHref
  var oldHash = a.hash
  a.href = href
  if (oldHash && !a.hash) {
    a.hash = oldHash
    href = a.href
  }

  this.state.href = href
  this.state.options = clone(this.options)

  try {
    this.loadContent(responseText, this.options)
  }
  catch (e) {
    var tempOptions2 = this.options
    tempOptions2.request = request
    trigger(document, "pjax:error", tempOptions2)

    if (!this.options.debug) {
      if (console && console.error) {
        console.error("Pjax switch fail: ", e)
      }
      return this.latestChance(href)
    }
    else {
      throw e
    }
  }
}
