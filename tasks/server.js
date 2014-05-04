var gulpUtil = require("gulp-util")
var connect = require("connect")
var connectLivereload = require("connect-livereload")
var livereload = require("gulp-livereload")
var opn = require("opn")

var livereloadServer
var ports = {
  web: 2402,
  livereload: 2403
}

module.exports = {
  start: function() {
    livereloadServer = livereload(ports.livereload)

    var app = connect()
      .use(connectLivereload({port: ports.livereload}))
      .use(connect.static("./dist/"))

    require("http").createServer(app)
      .listen(ports.web)
      .on("listening", function() {
        gulpUtil.log("Started connect web server on http://localhost:" + ports.web + " and livereload server on http://localhost:" + ports.livereload)
      })

    opn("http://localhost:" + ports.web)
  },
  livereload: function(file) {
    livereloadServer.changed(file.path)
  }
}
