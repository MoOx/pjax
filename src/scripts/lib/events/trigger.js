var forEachEls = require("../foreach-els")

module.exports = function(els, events) {
  events = (typeof events === "string" ? events.split(" ") : events)

  events.forEach(function(e) {
    var event
    if (document.createEvent) {
      event = document.createEvent("HTMLEvents")
      event.initEvent(e, true, true)
    }
    else {
      event = document.createEventObject()
      event.eventType = e
    }

    event.eventName = e

    if (document.createEvent) {
      forEachEls(els, function(el) {
        el.dispatchEvent(event)
      })
    }
    else {
      forEachEls(els, function(el) {
        el.fireEvent("on" + event.eventType, event)
      })
    }
  })
}
