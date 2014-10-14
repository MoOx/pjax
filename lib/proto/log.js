module.exports = function() {
  if (this.options.debug && console) {
    if (typeof console.log === "function") {
      console.log.apply(console, arguments);
    }
    // ie is weird
    else if (console.log) {
      console.log(arguments);
    }
  }
}
