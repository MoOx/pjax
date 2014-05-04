var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var jscs = require("gulp-jscs")
var jshint = require("gulp-jshint")

/**
 * task scripts:linting
 *
 * jshint + jscs
 */
module.exports = function() {
  return gulp.src([
      "./src/scripts/**/*.js",
      "!./src/scripts/lib/**/*.js",
      "./tasks/**/*.js",
      "./tests/**/*.js",
    ])
    .pipe(opts.plumber ? plumber(): util.noop())
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
}
