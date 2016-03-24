/* global Pjax */
console.log("Document initialized:", window.location.href)

document.addEventListener("pjax:send", function() {
  console.log("Event: pjax:send", arguments)
})

document.addEventListener("pjax:complete", function() {
  console.log("Event: pjax:complete", arguments)
})

document.addEventListener("pjax:error", function() {
  console.log("Event: pjax:error", arguments)
})

document.addEventListener("pjax:success", function() {
  console.log("Event: pjax:success", arguments)
})

document.addEventListener("DOMContentLoaded", function() {
  var pjax = new Pjax({
    selectors: [".body"],
    // currentUrlFullReload: true,
  })
  console.log("Pjax initialized.", pjax)
})
