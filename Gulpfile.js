var gulp = require("gulp")
var server = require("./tasks/server")

gulp.task("clean", require("./tasks/clean"))

// html
// @todo

// static assets

// generated assets
gulp.task("scripts:linting", require("./tasks/scripts-linting"))
gulp.task("scripts", ["scripts:linting"], require("./tasks/scripts"))
// gulp.task("stylesheets", require("./tasks/stylesheets"))

// build
// gulp.task("dist", ["clean", "static", "scripts", "stylesheets"])
gulp.task("dist", ["clean", "scripts"])

// publish
gulp.task("publish", ["dist"], require("./tasks/publish"))

// dev tasks
// gulp.task("server", ["dist"], server.start)
// gulp.task("default", ["dist", "server", "watch" ])
gulp.task("default", ["dist", "watch" ])
gulp.task("test", ["dist"])

gulp.task("watch", ["dist"], function() {
  gulp.watch("./styles/**/*.css", ["stylesheets"])
  gulp.watch("./scripts/**/*.js", ["scripts"])
  gulp.watch("./tasks/**/*.js", ["scripts:linting"])
  gulp.watch("./tests/**/*.js", ["scripts:linting"])

  // gulp.watch("./dist/**/*").on("change", server.livereload)
})
