class vueTouch {
  constructor (el, binding, type) {
    console.log(111)
    this.obj = el
    this.binding = binding
    this.touchType = type
    this.vueTouches = {x: 0, y: 0}
    this.vueMoves = true
    this.vueLeave = true
    this.longTouch = true
    this.vueCallBack = typeof(binding.value) === 'object' ? binding.value.fn : binding.value
    
    this.obj.addEventListener('touchstart', (e) => {
      this.start(e)
    }, false)
    
    this.obj.addEventListener('touchend', (e) => {
      this.end(e)
    }, false)
    
    this.obj.addEventListener('touchmove', (e) => {
      this.move(e)
    }, false)
    
  }
  
  start (e) {
    this.vueMoves = true
    this.vueLeave = true
    this.longTouch = true
    this.vueTouches = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY}
    this.time = setTimeout(function () {
      if (this.vueLeave && this.vueMoves) {
        this.touchType === 'longtap' && this.vueCallBack(this.binding.value, e)
        this.longTouch = false
      }
    }.bind(this), 1000)
  }
  
  end (e) {
    let disX = e.changedTouches[0].pageX - this.vueTouches.x
    let disY = e.changedTouches[0].pageY - this.vueTouches.y
    clearTimeout(this.time)
    if (Math.abs(disX) > 10 || Math.abs(disY) > 100) {
      this.touchType === 'swipe' && this.vueCallBack(this.binding.value, e)
      if (Math.abs(disX) > Math.abs(disY)) {
        if (disX > 10) {
          this.touchType === 'swiperight' && this.vueCallBack(this.binding.value, e)
        }
      
        if (disX < -10) {
          this.touchType === 'swipeleft' && this.vueCallBack(this.binding.value, e)
        }
      
      } else {
        if (disY > 10) {
          this.touchType === 'swipedown' && this.vueCallBack(this.binding.value, e)
        }
      
        if (disY < -10) {
          this.touchType === 'swipeup' && this.vueCallBack(this.binding.value, e)
        }
      
      }
    
    } else {
      if (this.longTouch && this.vueMoves) {
        this.touchType === 'tap' && this.vueCallBack(this.binding.value, e)
        this.vueLeave = false
      }
    
    }
  }
  
  move () {
    this.vueMoves = false
  }
}

exports.tap = {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'tap')
  }
}

exports.swipe = {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'swipe')
  }
}

exports.swipeleft = {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'swipeleft')
  }
}

exports.swiperight = {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'swiperight')
  }
}

exports.swipedown = {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'swipedown')
  }
}

exports.swipeup = {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'swipeup')
  }
}

exports.longtap = {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'longtap')
  }
}
