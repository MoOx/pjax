module.exports = function(el) {
  // console.log("going to execute script", el)

  var code = (el.text || el.textContent || el.innerHTML || "")
  var src = (el.src || "")
  var parent = el.parentNode || document.querySelector("head") || document.documentElement
  var script = document.createElement("script")

  if (code.match("document.write")) {
    if (console && console.log) {
      console.log("Script contains document.write. Can’t be executed correctly. Code skipped ", el)
    }
    return false
  }

  script.type = "text/javascript"

  if (src !== "") {
    script.src = src
    script.async = false // force asynchronous loading of peripheral js
  }

  if (code !== "") {
    try {
      script.appendChild(document.createTextNode(code))
    }
    catch (e) {
      // old IEs have funky script nodes
      script.text = code
    }
  }

  // execute
  parent.appendChild(script)
  // avoid pollution only in head or body tags
  if (["head", "body"].indexOf(parent.tagName.toLowerCase()) > 0) {
    parent.removeChild(script)
  }

  return true
}
