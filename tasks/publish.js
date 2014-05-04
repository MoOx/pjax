var gulp = require("gulp")
var ghPages = require("gulp-gh-pages")

/**
 * publish task
 *
 * publish build in the gh-pages branch
 */
module.exports = function() {
  return gulp.src("./dist/**/*")
    .pipe(ghPages({
      remoteUrl: "git@github.com:MoOx/pjax.git",
      branch: "gh-pages",
      cacheDir: __dirname + "/../.publish"
    }))
}
