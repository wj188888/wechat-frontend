export default class BrowserAnimation {
  constructor () {
    this.style = {
      transform: this.getAnimationType("transform"),
      transitionTimingFunction: this.getAnimationType("transitionTimingFunction"),
      transitionDuration: this.getAnimationType("transitionDuration"),
      transitionDelay: this.getAnimationType("transitionDelay"),
      transformOrigin: this.getAnimationType("transformOrigin"),
      transitionEnd: this.getAnimationType("transitionEnd")
    }
  }

  getAnimationType(animationType) {
    let elemStyle = document.createElement("div").style;
    let type  = function () {
      let browserAnimationType = {
        webkit: "webkitTransform",
        Moz: "MozTransform",
        O: "OTransform",
        ms: "msTransform",
        standard: "transform"
      };
      for (var key in browserAnimationType){
        if (undefined !== elemStyle[browserAnimationType[key]]){
          return key;
        }
      }
      return false
    }();

    if(type){
      if('standard' === type ){
        return animationType
      }else{
        return type + animationType.charAt(0).toUpperCase() + animationType.substr(1)
      }
    }
    return false
  }

  hasClass (t, e) {
    var n = new RegExp("(^|\\s)" + e + "(\\s|$)");
    return n.test(t.className)
  }

  addClass (t, e) {
    if (!o(t, e)) {
      var n = t.className.split(" ");
      n.push(e), t.className = n.join(" ")
    }
  }

  removeClass (t, e) {
    if (o(t, e)) {
      var n = new RegExp("(^|\\s)" + e + "(\\s|$)", "g");
      t.className = t.className.replace(n, " ")
    }
  }

  createCssTranslateString (x, y) {
    return "translate3d(" + x + "px, " + y + "px, 0)"
  }

}