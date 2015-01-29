module.exports = function(el) {
  switch (el.tagName.toLowerCase()) {
  case "a":
    // only attach link if el does not already have link attached
    if (!el.hasAttribute('data-pjax-click-state')) {
      this.attachLink(el)
    }
    break

  case "form":
    throw "Pjax doesnt support <form> yet."
    break

  default:
    throw "Pjax can only be applied on <a> or <form> submit"
  }
}
