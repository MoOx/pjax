;(function(root, factory) {
  if (typeof exports === "object") {
    // CommonJS
    module.exports = factory()
  }
  else if (typeof define === "function" && define.amd) {
    // AMD
    define([], factory)
  }
  else {
    // Global Variables
    root.Pjax = factory()
  }
}(this, function() {
  "use strict";

  function newUid() {
    return (new Date().getTime())
  }

  var Pjax = function(options) {
      this.firstrun = true

      this.options = options
      this.options.elements = this.options.elements || "a[href], form[action]"
      this.options.selectors = this.options.selectors || ["title", ".js-Pjax"]
      this.options.switches = this.options.switches || {}
      this.options.switchesOptions = this.options.switchesOptions || {}
      this.options.history = this.options.history || true
      this.options.currentUrlFullReload = this.options.currentUrlFullReload || false
      this.options.analytics = this.options.analytics || function(options) {
        // options.backward or options.foward can be true or undefined
        // by default, we do track back/foward hit
        // https://productforums.google.com/forum/#!topic/analytics/WVwMDjLhXYk
        if (window._gaq) {
          _gaq.push(["_trackPageview"])
        }
        if (window.ga) {
          ga("send", "pageview", {"page": options.url, "title": options.title})
        }
      }
      this.options.scrollTo = this.options.scrollTo || 0
      this.options.debug = this.options.debug || false

      this.maxUid = this.lastUid = newUid()

      // we can’t replace body.outerHTML or head.outerHTML
      // it create a bug where new body or new head are created in the dom
      // if you set head.outerHTML, a new body tag is appended, so the dom get 2 body
      // & it break the switchFallback which replace head & body
      if (!this.options.switches.head) {
        this.options.switches.head = this.switchElementsAlt
      }
      if (!this.options.switches.body) {
        this.options.switches.body = this.switchElementsAlt
      }

      this.log("Pjax options", this.options)

      if (typeof options.analytics !== "function") {
        options.analytics = function() {}
      }

      this.parseDOM(document)

      Pjax.on(window, "popstate", function(st) {
        if (st.state) {
          var opt = Pjax.clone(this.options)
          opt.url = st.state.url
          opt.title = st.state.title
          opt.history = false

          if (st.state.uid < this.lastUid) {
            opt.backward = true
          }
          else {
            opt.forward = true
          }
          this.lastUid = st.state.uid

          // @todo implement history cache here, based on uid
          this.loadUrl(st.state.url, opt)
        }
      }.bind(this))

    }

  // make internal methods public
  Pjax.isSupported = function() {
    // Borrowed wholesale from https://github.com/defunkt/jquery-pjax
    return window.history &&
      window.history.pushState &&
      window.history.replaceState &&
      // pushState isn’t reliable on iOS until 5.
      !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)
  }

  Pjax.forEachEls = function(els, fn, context) {
    if (els instanceof HTMLCollection || els instanceof NodeList) {
      return Array.prototype.forEach.call(els, fn, context)
    }
    // assume simple dom element
    fn.call(context, els)
  }

  Pjax.on = function(els, events, listener, useCapture) {
    events = (typeof events === "string" ? events.split(" ") : events)

    events.forEach(function(e) {
      Pjax.forEachEls(els, function(el) {
        el.addEventListener(e, listener, useCapture)
      })
    }, this)
  }

  Pjax.off = function(els, events, listener, useCapture) {
    events = (typeof events === "string" ? events.split(" ") : events)

    events.forEach(function(e) {
      Pjax.forEachEls(els, function(el) {
        el.removeEventListener(e, listener, useCapture)
      })
    }, this)
  }

  Pjax.trigger = function(els, events) {
    events = (typeof events === "string" ? events.split(" ") : events)

    events.forEach(function(e) {
      var event
      if (document.createEvent) {
        event = document.createEvent("HTMLEvents")
        event.initEvent(e, true, true)
      }
      else {
        event = document.createEventObject()
        event.eventType = e
      }

      event.eventName = e

      if (document.createEvent) {
        Pjax.forEachEls(els, function(el) {
          el.dispatchEvent(event)
        })
      }
      else {
        Pjax.forEachEls(els, function(el) {
          el.fireEvent("on" + event.eventType, event)
        })
      }
    }, this)
  }

  Pjax.clone = function(obj) {
    if (null === obj || "object" != typeof obj) {
      return obj
    }
    var copy = obj.constructor()
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr]
      }
    }
    return copy
  }

  // Finds and executes scripts (used for newly added elements)
  // Needed since innerHTML does not run scripts
  Pjax.executeScripts = function(el) {
    // console.log("going to execute scripts for ", el)
    Pjax.forEachEls(el.querySelectorAll("script"), function(script) {
      if (!script.type || script.type.toLowerCase() === "text/javascript") {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
        Pjax.evalScript(script)
      }
    })
  }

  Pjax.evalScript = function(el) {
    // console.log("going to execute script", el)

    var code = (el.text || el.textContent || el.innerHTML || "")
      , head = document.querySelector("head") || document.documentElement
      , script = document.createElement("script")

    if (code.match("document.write")) {
      if (console && console.log) {
        console.log("Script contains document.write. Can’t be executed correctly. Code skipped ", el)
      }
      return false
    }

    script.type = "text/javascript"
    try {
      script.appendChild(document.createTextNode(code))
    }
    catch (e) {
      // old IEs have funky script nodes
      script.text = code
    }

    // execute
    head.insertBefore(script, head.firstChild)
    head.removeChild(script) // avoid pollution

    return true
  }

  Pjax.prototype = {
    log: function() {
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

  , getElements: function(el) {
      return el.querySelectorAll(this.options.elements)
    }

  , parseDOM: function(el) {
      Pjax.forEachEls(this.getElements(el), function(el) {
        switch (el.tagName.toLowerCase()) {
        case "a": this.attachLink(el)
          break
        case "form":
          // todo
          this.log("Pjax doesnt support <form> yet. TODO :)")
          break
        default:
          throw "Pjax can only be applied on <a> or <form> submit"
        }
      }, this)
    }

  , attachLink: function(el) {
      Pjax.on(el, "click", function(event) {
        //var el = event.currentTarget

        // Don’t break browser special behavior on links (like page in new window)
        if (event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return -1
        }

        // Ignore external links.
        if (el.protocol !== window.location.protocol || el.host !== window.location.host) {
          return -2
        }

        // Ignore anchors on the same page
        if (el.pathname === location.pathname && el.hash.length > 0) {
          return -3
        }

        // Ignore anchors on the same page
        if (el.hash && el.href.replace(el.hash, "") === location.href.replace(location.hash, "")) {
          return -4
        }

        // Ignore empty anchor "foo.html#"
        if (el.href === location.href + "#") {
          return -5
        }

        event.preventDefault()

        if (this.options.currentUrlFullReload) {
          if (el.href === window.location.href) {
            window.location.reload()
            return -6
          }
        }

        this.loadUrl(el.href, Pjax.clone(this.options))
      }.bind(this))

      Pjax.on(el, "keyup", function(event) {
        this.log("pjax todo")
        // todo handle a link hitted by keyboard (enter/space) when focus is on it
      }.bind(this))
    }

  , forEachSelectors: function(cb, context, DOMcontext) {
      DOMcontext = DOMcontext || document
      this.options.selectors.forEach(function(selector) {
        Pjax.forEachEls(DOMcontext.querySelectorAll(selector), cb, context)
      })
    }

  , switchSelectors: function(selectors, fromEl, toEl, options) {
      selectors.forEach(function(selector) {
        var newEls = fromEl.querySelectorAll(selector)
        var oldEls = toEl.querySelectorAll(selector)
        this.log("Pjax switch", selector, newEls, oldEls)
        if (newEls.length !== oldEls.length) {
          // Pjax.forEachEls(newEls, function(el) {
          //   this.log("newEl", el, el.outerHTML)
          // }, this)
          // Pjax.forEachEls(oldEls, function(el) {
          //   this.log("oldEl", el, el.outerHTML)
          // }, this)
          throw "DOM doesn’t look the same on new loaded page: ’" + selector + "’ - new " + newEls.length + ", old " + oldEls.length
        }

        Pjax.forEachEls(newEls, function(newEl, i) {
          var oldEl = oldEls[i]
          this.log("newEl", newEl, "oldEl", oldEl)
          if (this.options.switches[selector]) {
            this.options.switches[selector].bind(this)(oldEl, newEl, options, this.options.switchesOptions[selector])
          }
          else {
            Pjax.switches.outerHTML.bind(this)(oldEl, newEl, options)
          }
        }, this)
      }, this)
    }

    // too much problem with the code below
    // + it’s too dangerous
  // , switchFallback: function(fromEl, toEl) {
  //     this.switchSelectors(["head", "body"], fromEl, toEl)
  //     // execute script when DOM is like it should be
  //     Pjax.executeScripts(document.querySelector("head"))
  //     Pjax.executeScripts(document.querySelector("body"))
  //   }

  , latestChance: function(href) {
      window.location = href
    }

  , onSwitch: function() {
      Pjax.trigger(window, "resize scroll")
    }

  , loadContent: function(html, options) {
      var tmpEl = document.implementation.createHTMLDocument("")

        // parse HTML attributes to copy them
        // since we are forced to use documentElement.innerHTML (outerHTML can't be used for <html>)
        , htmlRegex = /<html[^>]+>/gi
        , htmlAttribsRegex = /\s?[a-z:]+(?:\=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi
        , matches = html.match(htmlRegex)
        if (matches && matches.length) {
          matches = matches[0].match(htmlAttribsRegex)
          if (matches.length) {
            matches.shift()
            matches.forEach(function(htmlAttrib) {
              var attr = htmlAttrib.trim().split("=")
              tmpEl.documentElement.setAttribute(attr[0], attr[1].slice(1, -1))
            })
          }
        }

      tmpEl.documentElement.innerHTML = html
      this.log("load content", tmpEl.documentElement.attributes, tmpEl.documentElement.innerHTML.length)
      // try {
        this.switchSelectors(this.options.selectors, tmpEl, document, options)

        // FF bug: Won’t autofocus fields that are inserted via JS.
        // This behavior is incorrect. So if theres no current focus, autofocus
        // the last field.
        //
        // http://www.w3.org/html/wg/drafts/html/master/forms.html
        var autofocusEl = Array.prototype.slice.call(document.querySelectorAll("[autofocus]")).pop()
        if (autofocusEl && document.activeElement !== autofocusEl) {
          autofocusEl.focus();
        }

        // execute scripts when DOM have been completely updated
        this.options.selectors.forEach(function(selector) {
          Pjax.forEachEls(document.querySelectorAll(selector), function(el) {
            Pjax.executeScripts(el)
          })
        })
      // }
      // catch(e) {
      //   if (this.options.debug) {
      //     this.log("Pjax switch fail: ", e)
      //   }
      //   this.switchFallback(tmpEl, document)
      // }
    }

  , doRequest: function(location, callback) {
      var request = new XMLHttpRequest()

      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
          callback(request.responseText)
        }
        else if (request.readyState === 4 && (request.status === 404 || request.status === 500)){
          callback(false)
        }
      }

      request.open("GET", location + (!/[?&]/.test(location) ? "?" : "&") + (new Date().getTime()), true)
      request.setRequestHeader("X-Requested-With", "XMLHttpRequest")
      request.send(null)
    }

  , loadUrl: function(href, options) {
      this.log("load href", href, options)

      Pjax.trigger(document, "pjax:send", options);

      // Do the request
      this.doRequest(href, function(html) {

        // Fail if unable to load HTML via AJAX
        if (html === false) {
          Pjax.trigger(document,"pjax:complete pjax:error", options)

          return
        }

        // Clear out any focused controls before inserting new page contents.
        document.activeElement.blur()

        try {
          this.loadContent(html, options)
        }
        catch (e) {
          if (!this.options.debug) {
            if (console && console.error) {
              console.error("Pjax switch fail: ", e)
            }
            this.latestChance(href)
            return
          }
          else {
            throw e
          }
        }

        if (options.history) {

          if (this.firstrun) {
            this.lastUid = this.maxUid = newUid()
            this.firstrun = false
            window.history.replaceState({
                "url": window.location.href
              , "title": document.title
              , "uid": this.maxUid
              }
            , document.title)
          }

          // Update browser history
          this.lastUid = this.maxUid = newUid()
          window.history.pushState({
              "url": href
            , "title": options.title
            , "uid": this.maxUid
            }
          , options.title
          , href)
        }

        this.forEachSelectors(function(el) {
          this.parseDOM(el)
        }, this)

        // Fire Events
        Pjax.trigger(document,"pjax:complete pjax:success", options)

        options.analytics()

        // Scroll page to top on new page load
        if (options.scrollTo !== false) {
          if (options.scrollTo.length > 1) {
            window.scrollTo(options.scrollTo[0], options.scrollTo[1])
          }
          else {
            window.scrollTo(0, options.scrollTo)
          }
        }
      }.bind(this))
    }
  }

  Pjax.switches = {
    outerHTML: function(oldEl, newEl, options) {
      oldEl.outerHTML = newEl.outerHTML
      this.onSwitch()
    }

  , innerHTML: function(oldEl, newEl, options) {
      oldEl.innerHTML = newEl.innerHTML
      oldEl.className = newEl.className
      this.onSwitch()
    }

  , sideBySide: function(oldEl, newEl, options, switchOptions) {
      var forEach = Array.prototype.forEach
        , elsToRemove = []
        , elsToAdd = []
        , fragToAppend = document.createDocumentFragment()
        // height transition are shitty on safari
        // so commented for now (until I found something ?)
        // , relevantHeight = 0
        , animationEventNames = "animationend webkitAnimationEnd MSAnimationEnd oanimationend"
        , animatedElsNumber = 0
        , sexyAnimationEnd = function(e) {
            if (e.target != e.currentTarget) {
              // end triggered by an animation on a child
              return
            }

            animatedElsNumber--
            if (animatedElsNumber <= 0 && elsToRemove) {
              elsToRemove.forEach(function(el) {
                // browsing quickly can make the el
                // already removed by last page update ?
                if (el.parentNode) {
                  el.parentNode.removeChild(el)
                }
              })

              elsToAdd.forEach(function(el) {
                el.className = el.className.replace(el.getAttribute("data-pjax-classes"), "")
                el.removeAttribute("data-pjax-classes")
                // Pjax.off(el, animationEventNames, sexyAnimationEnd, true)
              })

              elsToAdd = null // free memory
              elsToRemove = null // free memory

              // assume the height is now useless (avoid bug since there is overflow hidden on the parent)
              // oldEl.style.height = "auto"

              // this is to trigger some repaint (example: picturefill)
              this.onSwitch()
              //Pjax.trigger(window, "scroll")
            }
          }.bind(this)

      // Force height to be able to trigger css animation
      // here we get the relevant height
      // oldEl.parentNode.appendChild(newEl)
      // relevantHeight = newEl.getBoundingClientRect().height
      // oldEl.parentNode.removeChild(newEl)
      // oldEl.style.height = oldEl.getBoundingClientRect().height + "px"

      switchOptions = switchOptions || {}

      forEach.call(oldEl.childNodes, function(el) {
        elsToRemove.push(el)
        if (el.classList && !el.classList.contains("js-Pjax-remove")) {
          // for fast switch, clean element that just have been added, & not cleaned yet.
          if (el.hasAttribute("data-pjax-classes")) {
            el.className = el.className.replace(el.getAttribute("data-pjax-classes"), "")
            el.removeAttribute("data-pjax-classes")
          }
          el.classList.add("js-Pjax-remove")
          if (switchOptions.callbacks && switchOptions.callbacks.removeElement) {
            switchOptions.callbacks.removeElement(el)
          }
          if (switchOptions.classNames) {
            el.className += " " + switchOptions.classNames.remove + " " + (options.backward ? switchOptions.classNames.backward  : switchOptions.classNames.forward)
          }
          animatedElsNumber++
          Pjax.on(el, animationEventNames, sexyAnimationEnd, true)
        }
      })

      forEach.call(newEl.childNodes, function(el) {
        if (el.classList) {
          var addClasses = ""
          if (switchOptions.classNames) {
            addClasses = " js-Pjax-add " + switchOptions.classNames.add + " " + (options.backward ? switchOptions.classNames.forward : switchOptions.classNames.backward)
          }
          if (switchOptions.callbacks && switchOptions.callbacks.addElement) {
            switchOptions.callbacks.addElement(el)
          }
          el.className += addClasses
          el.setAttribute("data-pjax-classes", addClasses)
          elsToAdd.push(el)
          fragToAppend.appendChild(el)
          animatedElsNumber++
          Pjax.on(el, animationEventNames, sexyAnimationEnd, true)
        }
      })

      // pass all className of the parent
      oldEl.className = newEl.className
      oldEl.appendChild(fragToAppend)

      // oldEl.style.height = relevantHeight + "px"
    }
  }

  if (Pjax.isSupported()) {
    return Pjax
  }
  // if there isn’t required browser functions, returning stupid api
  else {
    var stupidPjax = function() {}
    for (var key in Pjax.prototype) {
      if (Pjax.prototype.hasOwnProperty(key) && typeof Pjax.prototype[key] === "function") {
        stupidPjax[key] = stupidPjax
      }
    }

    return stupidPjax
  }

}));
