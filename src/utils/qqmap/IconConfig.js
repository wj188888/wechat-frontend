export default class IconConfig {
  data = {
    cartype: {
      260: {klass: "car-fastcar", width: 24, height: 42, angle: true},
      2600: {klass: "car-fastcar", width: 24, height: 42, angle: true},
      258: {klass: "car-udache", width: 24, height: 42, angle: true},
      2580: {klass: "car-udache", width: 24, height: 42, angle: true},
      257: {klass: "car-taxi", width: 24, height: 42, angle: true},
      2570: {klass: "car-taxi", width: 24, height: 42, angle: true},
      273: {klass: "car-sofa", width: 24, height: 42, angle: true},
      2730: {klass: "car-sofa", width: 24, height: 42, angle: true},
      274: {klass: "car-bus", width: 24, height: 42, angle: true},
      2740: {klass: "car-bus", width: 24, height: 42, angle: true},
      261: {klass: "car-daijia-user", width: 30, height: 42, angle: false},
      2610: {klass: "car-daijia-car", width: 24, height: 42, angle: true},
      259: {klass: "car-alift", width: 24, height: 42, angle: true},
      2590: {klass: "car-alift", width: 24, height: 42, angle: true}
    },
    pointertype: {
      0: {klass: "start", width: 26, height: 42.5, offset: {x: 0, y: -21.25}},
      1: {klass: "end", width: 26, height: 42.5, offset: {x: 0, y: -21.25}},
      2: {klass: "pointer_custom", width: 26, height: 42.5, offset: {x: 0, y: -21.25}},
      3: {klass: "start1", width: 26, height: 42.5, offset: {x: 0, y: -21.25}},
      4: {klass: "end1", width: 26, height: 42.5, offset: {x: 0, y: -21.25}},
      5: {klass: "start2", width: 22, height: 30, offset: {x: 0, y: -15}},
      6: {klass: "end2", width: 22, height: 30, offset: {x: 0, y: -15}},
      7: {klass: "station_num_start", width: 20, height: 20, offset: {x: 0, y: -10}},
      8: {klass: "station_num_end", width: 20, height: 20, offset: {x: 0, y: -10}},
      9: {klass: "station_num", width: 20, height: 20, offset: {x: 0, y: -10}},
    },
    stationtype: {
      0: {klass: "blue", width: 14, height: 14},
      1: {klass: "green", width: 14, height: 14},
      2: {klass: "orange", width: 14, height: 14},
      3: {klass: "station_custom", width: 14, height: 14},
      4: {klass: "station_point", width: 10, height: 10, offset: {x: 0, y: -5}},
      5: {klass: "start", width: 26, height: 42.5, offset: {x: 0, y: -21.25}},
      
      6: {klass: "bus_station", width: 13, height: 13, offset: {x: 0, y: -10}},
      7: {klass: "bus_station_current", width: 17, height: 17, offset: {x: 0, y: -8.5}},
      8: {klass: "bus_station_start", width: 22, height: 22, offset: {x: 0, y: -11}},
      9: {klass: "bus_station_end", width: 22, height: 22, offset: {x: 0, y: -11}},
      
      10: {klass: "bus_station_first", width: 13, height: 13, offset: {x: 0, y: -10}},
      11: {klass: "bus_station_last",  width: 13, height: 13, offset: {x: 0, y: -10}},
      
      12: {klass: "subway_station_start", width: 22, height: 22, offset: {x: 0, y: -11}},
      13: {klass: "subway_station_end", width: 22, height: 22, offset: {x: 0, y: -11}},
      14: {klass: "subway_station", width: 13, height: 13, offset: {x: 0, y: -10}},
      
      15: {klass: "urban_station", width: 13, height: 13, offset: {x: 0, y: -10}},
      
      16: {klass: "transfer_station", width: 22, height: 22, offset: {x: 0, y: -11}},
    },
    usertype: {
      0: {klass: "user", width: 44, height: 44},
      1: {klass: "partner", width: 22, height: 34.5, offset: {x: 0, y: -17.25}}
    },
    storetype: {
      0: {klass: "store-min", width: 20, height: 20},
      1: {klass: "store-max", width: 20, height: 30, offset: {x: 0, y: -20}},
      2: {klass: "station-min", width: 20, height: 20},
      3: {klass: "station-max", width: 20, height: 30, offset: {x: 0, y: -20}},
    },
  }

  get (t, e) {
    var n = this.data;
    (t || "").split(".").forEach(function (t) {
      if(t && "undefined" != typeof n){
        n = n[t]
      }
    });
    return "undefined" != typeof n ? n : e
  }

  set (t, e) {
    var _this = this;
    if("undefined" == typeof e){
      this.data = t
    }else{
      t = String(t || "").trim()
      if(t){
        !function () {
          var r = t.split("."),
            i = r.pop(),
            a = _this.data || {};
          r.forEach(function (t) {
            var e = a[t];
            if ("object" === ("undefined" == typeof e ? "undefined" : n(e)))a = a[t]; else {
              if ("undefined" != typeof e)throw new Error("forbidden to set property[" + t + "] of [" + e + "] data");
              a = a[t] = {}
            }
          });
          a[i] = e
        }()
      }
    }
  }
}
