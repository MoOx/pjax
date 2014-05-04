var forEachEls = require("../foreach-els")

module.exports = function(els, events) {
  events = (typeof events === "string" ? events.split(" ") : events)

  events.forEach(function(e) {
    var event // = new CustomEvent(e) // doesn't everywhere yet
    event = document.createEvent("HTMLEvents")
    event.initEvent(e, true, true)
    event.eventName = e

    forEachEls(els, function(el) {
      el.dispatchEvent(event)
    })
  })
}
