var symlink = require("gulp-symlink")

gulp.task("static", function() {
  return gulp.src("./src/static/*")
    .pipe(symlink("./dist/"))
})
