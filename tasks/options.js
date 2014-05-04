/**
 * parses cli arguments as options
 */
var options = require("minimist")(process.argv.slice(2))
var defaults = {
    plumber: true,
    minify: false
  }
// set some defaults options depending on some flags
if (options.production) {
  defaults.plumber = false
  defaults.minify = true
}

options.plumber = options.plumber === undefined ? defaults.plumber: options.plumber
options.minify = options.minify === undefined ? defaults.minify: options.minify

module.exports = options
