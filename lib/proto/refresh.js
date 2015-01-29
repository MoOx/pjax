
var parseDom = require("./parse-dom")

module.exports = function(el) {
  parseDom(el || document)
}
