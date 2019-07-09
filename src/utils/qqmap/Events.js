import util from './utils'

export default class Events {
  constructor() {
    this._events = {}
  }

  on (t, e, n) {
    this._events[t] || (this._events[t] = []),
      n = n || this;
    var o = this._events[t].args;
    o ? e.apply(n, o) : this._events[t].push([e, n])
  }

  once (t, e, n) {
    function o() {
      this.off(t, o), r || (r = !0, e.apply(n, arguments))
    }

    var r = !1;
    n = n || this,
      this.on(t, o)
  }

  off (t, e) {
    var n = this._events[t];
    if (n)for (var o = n.length; o--;)n[o][0] === e && (n[o][0] = void 0)
  }

  trigger (t) {
    var e = this._events[t];
    if (e) {
      var o = e.length;
      e = util.arrayClone(e, o);
      for (var r = arguments.length, i = Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++)i[a - 1] = arguments[a];
      for (var s = 0; s < o; s++) {
        var u = e[s], c = u[0], l = u[1];
        c && c.apply(l, i)
      }
    }
  }

  done (t) {
    var e = arguments.length,
        n = Array(e > 1 ? e - 1 : 0);

    for (var o = 1; o < e; o++){
      n[o - 1] = arguments[o]
    }
    var r = this._events[t];
    if(!r){
      r = this._events[t] = []
    }
    r.args = n;
    this.trigger.apply(this, arguments)
  }
}
