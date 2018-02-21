var updateQueryString = require("./util/update-query-string");

module.exports = function(location, options, callback) {
  options = options || {}
  var requestMethod = (options.requestMethod || "GET").toUpperCase()
  var requestParams = options.requestParams || null
  var requestPayload = null
  var request = new XMLHttpRequest()

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        callback(request.responseText, request)
      }
      else {
        callback(null, request)
      }
    }
  }

  request.onerror = function(e) {
    console.log(e)
    callback(null, request)
  }

  request.ontimeout = function() {
    callback(null, request)
  }

  // Prepare the request payload for forms, if available
  if (requestParams && requestParams.length) {
    switch (requestMethod) {
      case "GET":
        // Reset query string to avoid an issue with repeat submissions where checkboxes that were
        // previously checked are incorrectly preserved
        location = location.split("?")[0]

        // Build new query string
        requestParams.forEach(function(param) {
          location = updateQueryString(location, param.name, param.value)
        });
        break;

      case "POST":
        // Build payload string
        requestPayload = (requestParams.map(function(param) {return param.name + "=" + param.value})).join("&")
        break;
    }
  }

  // Add a timestamp as part of the query string if cache busting is enabled
  if (this.options.cacheBust) {
    location = updateQueryString(location, "t", Date.now())
  }

  request.open(requestMethod, location, true)
  request.timeout = options.timeout
  request.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  request.setRequestHeader("X-PJAX", "true")

  // Send the proper header information for POST forms
  if (requestPayload && requestMethod === "POST") {
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
  }

  request.send(requestPayload)

  return request
}
