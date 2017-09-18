var tape = require("tape")

var on = require("../../../lib/events/on")
var trigger = require("../../../lib/events/trigger")
var attachForm = require("../../../lib/proto/attach-form")

var form = document.createElement("form")
var attr = "data-pjax-click-state"
var preventDefault = function(e) { e.preventDefault() }

tape("test attach form prototype method", function(t) {
  t.plan(7)

  attachForm.call({
    options: {},
    reload: function() {
      t.equal(form.getAttribute(attr), "reload", "triggering a simple reload will just submit the form")
    },
    loadUrl: function() {
      t.equal(form.getAttribute(attr), "submit", "triggering a post to the next page")
    }
  }, form)

  var internalUri = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search

  form.action = "http://external.com/"
  trigger(form, "submit")
  t.equal(form.getAttribute(attr), "external", "external url stop behavior")

  form.action = internalUri + "#anchor"
  trigger(form, "submit")
  t.equal(form.getAttribute(attr), "anchor-present", "internal anchor stop behavior")

  window.location.hash = "#anchor"
  form.action = internalUri + "#another-anchor"
  trigger(form, "submit")
  t.notEqual(form.getAttribute(attr), "anchor", "differents anchors stop behavior")
  window.location.hash = ""

  form.action = internalUri + "#"
  trigger(form, "submit")
  t.equal(form.getAttribute(attr), "anchor-empty", "empty anchor stop behavior")

  form.action = internalUri
  trigger(form, "submit")
  // see reload defined above

  form.action = window.location.protocol + "//" + window.location.host + "/internal"
  form.method = 'POST'
  trigger(form, "submit")
  // see post defined above

  form.action = window.location.protocol + "//" + window.location.host + "/internal"
  form.method = 'GET'
  trigger(form, "submit")
  // see post defined above

  t.end()
})

tape("test attach form preventDefaulted events", function(t) {
  var callbacked = false
  var form = document.createElement("form")

  attachForm.call({
    options: {},
    loadUrl: function() {
      callbacked = true
    }
  }, form)

  form.action = "#"
  on(form, "submit", preventDefault)
  trigger(form, "submit")
  t.equal(callbacked, false, "events that are preventDefaulted should not fire callback")

  t.end()
})
