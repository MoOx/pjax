module.exports = function(location, callback) {
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

  request.open("GET", location + (!/[?&]/.test(location) ? "?" : "&") + (new Date().getTime()), true)
  request.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  request.send(null)
  return request
}
