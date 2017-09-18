module.exports = function(el) {
  switch (el.tagName.toLowerCase()) {
  case "a":
    // only attach link if el does not already have link attached
    if (!el.hasAttribute('data-pjax-click-state')) {
      this.attachLink(el)
    }
    break

    case "form":
      // only attach link if el does not already have link attached
      if (!el.hasAttribute('data-pjax-click-state')) {
        this.attachForm(el)
      }
    break

  default:
    throw "Pjax can only be applied on <a> or <form> submit"
  }
}
