module.exports = function(location, options, callback) {
  options = options || {};
  var requestMethod = options.requestMethod || "GET";
  var requestPayload = options.requestPayloadString || null;
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

  // Add a timestamp as part of the query string if cache busting is enabled
  if (this.options.cacheBust) {
    location += (!/[?&]/.test(location) ? "?" : "&") + new Date().getTime()
  }

  request.open(requestMethod.toUpperCase(), location, true)
  request.setRequestHeader("X-Requested-With", "XMLHttpRequest")

  // Add the request payload if available
  if (options.requestPayloadString != undefined && options.requestPayloadString != "") {
    // Send the proper header information along with the request
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  }

  request.send(requestPayload)

  return request
}
