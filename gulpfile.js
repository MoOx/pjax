///
var pkg = require("./package.json")
  , gulp = require("gulp")
  , plumber = require("gulp-plumber")

///
// Lint JS
///
var jshint = require("gulp-jshint")
  , jsFiles = [".jshintrc", "*.json", "*.js"]
gulp.task("scripts.lint", function() {
  gulp.src(jsFiles)
    .pipe(plumber())
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter("jshint-stylish"))
})

var jscs = require("gulp-jscs")
gulp.task("scripts.cs", function() {
  gulp.src("*.js")
    .pipe(plumber())
    .pipe(jscs())
})

gulp.task("scripts", ["scripts.lint", "scripts.cs"])

gulp.task("watch", function() {
  gulp.watch([jsFiles], ["scripts"])
})

gulp.task("default", ["scripts", "watch"])
