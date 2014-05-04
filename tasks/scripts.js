var gulp = require("gulp")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var browserify = require("gulp-browserify")

var opts = require("./options")
var transforms = [
  // "jadeify",
  // "debowerify",
  // "decomponentify",
  // "deglobalify",
  // "es6ify"
]
if (opts.minify) {
  transforms.push("uglifyify")
}

module.exports = function() {
  return gulp.src("./src/scripts/*.js")
    .pipe(opts.plumber ? plumber(): util.noop())
    .pipe(browserify({
        transform: transforms,
        debug: opts.production !== undefined
      }
    ))
    .pipe(gulp.dest("./dist/scripts/"))
}
