var pkg = require("./package.json")
  , gulp = require("gulp")
  , plumber = require("gulp-plumber")

///
// JS Lint
///
var jshint = require("gulp-jshint")
  , jsonFiles = [".jshintrc", "*.json"]
  , jsFiles = ["*.js", "src/**/*.js"]
gulp.task("scripts.lint", function() {
  gulp.src([].concat(jsonFiles).concat(jsFiles))
    .pipe(plumber())
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter("jshint-stylish"))
})

///
// JS Code Sniffing
///
var jscs = require("gulp-jscs")
gulp.task("scripts.cs", function() {
  gulp.src(jsFiles)
    .pipe(plumber())
    .pipe(jscs())
})

// JS Alias
gulp.task("scripts", ["scripts.lint", "scripts.cs"])

///
// Watch
///
gulp.task("watch", function() {
  gulp.watch(jsFiles, ["scripts"])
})

///
// Publish gh-branch
///
var buildBranch = require("buildbranch")
gulp.task("publish", ["test"], function(cb) {
  buildBranch({folder: "src"}
  , function(err) {
      if (err) {
        throw err
      }
      console.log(pkg.name + " published.")
      cb()
    })
})

// Aliases
gulp.task("build", ["scripts"])
gulp.task("test", ["build"])
gulp.task("default", ["test", "watch"])
