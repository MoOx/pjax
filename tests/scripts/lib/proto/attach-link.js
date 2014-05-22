var tape = require("tape")

var on = require("../../../../src/scripts/lib/events/on")
var trigger = require("../../../../src/scripts/lib/events/trigger")
var attachLink = require("../../../../src/scripts/lib/proto/attach-link")

var a = document.createElement("a")
var attr = "data-pjax-click-state"
var preventDefault = function(e) { e.preventDefault() }

tape("test attach link prototype method", function(t) {
  t.plan(7)

  attachLink.call({
    options: {},
    refresh: function() {
      t.equal(a.getAttribute(attr), "refresh", "triggering exact same url refresh the page")
    },
    loadUrl: function() {
      t.equal(a.getAttribute(attr), "load", "triggering a internal link actually load the page")
    }
  }, a)

  var internalUri = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search

  a.href = internalUri
  on(a, "click", preventDefault) // to avoid link to be open (break testing env)
  trigger(a, "click", {metaKey: true})
  t.equal(a.getAttribute(attr), "modifier", "event key modifier stop behavior")

  a.href = "http://external.com/"
  trigger(a, "click")
  t.equal(a.getAttribute(attr), "external", "external url stop behavior")

  a.href = internalUri + "#anchor"
  trigger(a, "click")
  t.equal(a.getAttribute(attr), "anchor-present", "internal anchor stop behavior")

  window.location.hash = "#anchor"
  a.href = internalUri + "#another-anchor"
  trigger(a, "click")
  t.notEqual(a.getAttribute(attr), "anchor", "differents anchors stop behavior")
  window.location.hash = ""

  a.href = internalUri + "#"
  trigger(a, "click")
  t.equal(a.getAttribute(attr), "anchor-empty", "empty anchor stop behavior")

  a.href = internalUri
  trigger(a, "click")
  // see refresh defined above

  a.href = window.location.protocol + "//" + window.location.host + "/internal"
  trigger(a, "click")
  // see loadUrl defined above

  t.end()
})
