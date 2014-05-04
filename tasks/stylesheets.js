var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var rework = require("gulp-rework")
var reworkPlugins = {
  imprt: require("rework-npm"),
  //  parent: require("rework-parent"),
  //  breakpoints: require("rework-breakpoints"),
   vars: require("rework-vars"),
   calc: require("rework-calc"),
  // colorFn: require("rework-color-function"), // Tab Atkins's proposal color function in CSS
  // hexAlpha: require("rework-hex-alpha"), // use 4-digit or 8-digit hex colors with alpha channels
  // inline: require("rework-plugin-inline"),
  // ieLimits: require("rework-ie-limits"),
  // remFallback: require("rework-rem-fallback"),
  // clearfix: require("rework-clearfix"),
  }
var autoprefixer = require("gulp-autoprefixer")

module.exports = function() {
  return gulp.src("./src/styles/*.css")
    .pipe(opts.plumber ? plumber(): util.noop())
    .pipe(rework(
      reworkPlugins.imprt("./src/css"),
      rework.colors(),
      rework.references(),
      // reworkPlugins.parent,
      // reworkPlugins.breakpoints,
      reworkPlugins.vars(),
      reworkPlugins.calc,
      //reworkPlugins.colorFn,
      //reworkPlugins.hexAlpha,
      //reworkPlugins.inline,
      //reworkPlugins.ieLimits,
      //reworkPlugins.remFallback,
      // reworkPlugins.clearfix,
      // rework.ease(),
      // rework.extend(),
      {sourcemap: !option.minify}
    ))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dist.stylesheets))
}
