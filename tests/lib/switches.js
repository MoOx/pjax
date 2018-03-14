var tape = require("tape")
var switches = require("../../lib/switches")
var noop = require("../../lib/util/noop")

tape("test replaceNode switch", function(t) {
  var replaceNode = switches.replaceNode

  var doc = document.implementation.createHTMLDocument()

  var container = doc.createElement("div")
  container.innerHTML = "<p>Original Text</p>"
  doc.body.appendChild(container)

  var p = doc.createElement("p")
  p.innerHTML = "New Text"

  replaceNode.bind({
    onSwitch: noop
  })(doc.querySelector("p"), p)

  t.equals(doc.querySelector("div").innerHTML, "<p>New Text</p>", "Elements correctly switched")

  t.end()
})
