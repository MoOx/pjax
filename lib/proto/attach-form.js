var on = require("../events/on")
var clone = require("../clone")

var attrClick = "data-pjax-click-state"

var formAction = function(el, event) {
  // Since loadUrl modifies options and we may add our own modifications below,
  // clone it so the changes don't persist
  var options = clone(this.options)

  // Initialize requestOptions
  options.requestOptions = {
    requestUrl: el.getAttribute("action") || window.location.href,
    requestMethod: el.getAttribute("method") || "GET"
  }

  // create a testable virtual link of the form action
  var virtLinkElement = document.createElement("a")
  virtLinkElement.setAttribute("href", options.requestOptions.requestUrl)

  // Ignore external links.
  if (virtLinkElement.protocol !== window.location.protocol || virtLinkElement.host !== window.location.host) {
    el.setAttribute(attrClick, "external")
    return
  }

  // Ignore click if we are on an anchor on the same page
  if (virtLinkElement.pathname === window.location.pathname && virtLinkElement.hash.length > 0) {
    el.setAttribute(attrClick, "anchor-present")
    return
  }

  // Ignore empty anchor "foo.html#"
  if (virtLinkElement.href === window.location.href.split("#")[0] + "#") {
    el.setAttribute(attrClick, "anchor-empty")
    return
  }

  // if declared as a full reload, just normally submit the form
  if (options.currentUrlFullReload) {
    el.setAttribute(attrClick, "reload")
    return
  }

  event.preventDefault()

  var paramObject = []
  for (var elementKey in el.elements) {
    var element = el.elements[elementKey]
    // jscs:disable disallowImplicitTypeConversion
    if (!!element.name && element.attributes !== undefined && element.tagName.toLowerCase() !== "button") {
      // jscs:enable disallowImplicitTypeConversion
      if ((element.attributes.type !== "checkbox" && element.attributes.type !== "radio") || element.checked) {
        paramObject.push({name: encodeURIComponent(element.name), value: encodeURIComponent(element.value)})
      }
    }
  }

  // Creating a getString
  var paramsString = (paramObject.map(function(value) {return value.name + "=" + value.value})).join("&")

  options.requestOptions.requestPayload = paramObject
  options.requestOptions.requestPayloadString = paramsString

  el.setAttribute(attrClick, "submit")

  options.triggerElement = el
  this.loadUrl(virtLinkElement.href, options)
}

var isDefaultPrevented = function(event) {
  return event.defaultPrevented || event.returnValue === false
}

module.exports = function(el) {
  var that = this

  on(el, "submit", function(event) {
    if (isDefaultPrevented(event)) {
      return
    }

    formAction.call(that, el, event)
  })

  on(el, "keyup", function(event) {
    if (isDefaultPrevented(event)) {
      return
    }

    if (event.keyCode === 13) {
      formAction.call(that, el, event)
    }
  }.bind(this))
}
