module.exports = function(el) {
  switch (el.tagName.toLowerCase()) {
  case "a":
    this.attachLink(el)
    break

  case "form":
    throw "Pjax doesnt support <form> yet."
    break

  default:
    throw "Pjax can only be applied on <a> or <form> submit"
  }
}
