var rimraf = require("rimraf")

module.exports = function() {
  rimraf.sync("./dist")
}
