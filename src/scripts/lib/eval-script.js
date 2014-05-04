module.exports = function(el) {
  // console.log("going to execute script", el)

  var code = (el.text || el.textContent || el.innerHTML || "")
  var head = document.querySelector("head") || document.documentElement
  var script = document.createElement("script")

  if (code.match("document.write")) {
    if (console && console.log) {
      console.log("Script contains document.write. Can’t be executed correctly. Code skipped ", el)
    }
    return false
  }

  script.type = "text/javascript"
  try {
    script.appendChild(document.createTextNode(code))
  }
  catch (e) {
    // old IEs have funky script nodes
    script.text = code
  }

  // execute
  head.insertBefore(script, head.firstChild)
  head.removeChild(script) // avoid pollution

  return true
}
