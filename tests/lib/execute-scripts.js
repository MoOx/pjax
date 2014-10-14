var tape = require("tape")

var executeScripts = require("../../lib/execute-scripts")

tape("test executeScripts method", function(t) {
  document.body.className = ""

  var container = document.createElement("div")
  container.innerHTML = "<" + "script" + ">document.body.className = 'executed';</" + "script" + "><" + "script" + ">document.body.className += ' correctly';</" + "script" + ">"

  t.equal(document.body.className, "", "script hasn't been executed yet")
  executeScripts(container)
  t.equal(document.body.className, "executed correctly", "script has been properly executed")

  t.end()
})
