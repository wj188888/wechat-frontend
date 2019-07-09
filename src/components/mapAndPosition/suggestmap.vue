<template>
  <div class="suggestmap" v-show="visible">
    <div :id="mapId" class="mapcontainer"></div>
    <div class="info-card-wrapper">
      <div class="info-card" @click="selectAddress">
        <div class="icon">
          <span class="icon-start"></span>
        </div>
        <div class="address-wrapper">
          <div class="address-info noaddress">
            <div class="displayname">
              <span>{{currentStation.detailAddress}}</span>
            </div>
            <!--<div class="marker recommend">asdasdasd</div>-->
          </div>
          <!--<div class="address">{{currentStation.detailAddress}}</div>-->
        </div>
        <div class="tip">
          <span class="text">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import qqMap from '../../utils/qqmap/CreateMap'
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
    },
    data () {
      return {
        realTimeGeo:'',
        mapId: "suggestmap",
        visible: false,
        currentStation: {},
        mapCenter: {
          lat: 0,
          lng: 0
        }
      }
    },
    methods: {
      _initMap () {
        let lat = this.mapCenter.lat,
            lng = this.mapCenter.lng;
        this.map = new qqMap.createMap(this.mapId, {
          lat: lat,
          lng: lng,
          zoom: 16
        })
        this._addProbeControl()
        if(this.appAddress && this.appAddress !== TOOL.locationFail){
          this._addUser(this.appAddress.position)
        }else{
          this.$store.watch((state) => {
            return state.city.appAddress;
          }, (newVal, oldVal) => {
            if(newVal && newVal !== TOOL.locationFail){
              this._addUser(newVal.position)
            }
          }, {deep: true});
        }
      },

      _addProbeControl () {
        this.probeControl = new qqMap.control.ProbeControl({
          map: this.map,
          align: "center",
          probeLatlng: {
            lat: this.mapCenter.lat,
            lng: this.mapCenter.lng
          }
        })
        this.probeControl.on("picked", (address) => {
          this.currentStation = address
          this.$emit('poiChange', address)
        })
      },

      _addUser (point) {
        this.user = new qqMap.component.User({
          map: this.map,
          type: 0,
          geo: false,
          lat: point.lat,
          lng: point.lng
        });
        this.$watch("realTimeGeo", (point) => {
          this.user.setPosition({lat: point.lat, lng: point.lng})
        })
        this._addResetControl()
      },
  
      _addResetControl () {
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          margin: "0 0 66px 10px",
          clickHandler: () => {
            let lat = this.user.getPosition().lat,
              lng = this.user.getPosition().lng;
            this.map.setZoom(16)
            this.map.setCenter(lat, lng);
            this.$emit('reset')
          }
        })
      },

      _removeMap () {
        if(this.map){
          this.map.remove()
        }
      },

      _restore () {
        if(this.resetControl){
          this.resetControl.show()
        }
        if(this.probeControl){
          this.probeControl.show()
        }
      },

      setMapCenter (t, e) {
        this.mapCenter = {lat: t, lng: e}
        if(this.map){
          this.map.setCenter(t, e)
        }
      },

      setCurrentStation (address) {
        this.currentStation = address
      },

      show (from){
        if (from && from.lat) {
          this.visible = true
          this.currentStation = from
          this.mapCenter = {
            lat: from.lat,
            lng: from.lng,
          }
          if(this.map){
            this._restore()
          }else{
            this._initMap()
          }
        }
      },

      hide () {
        if(this.resetControl){
          this.resetControl.hide()
        }
        if(this.probeControl){
          this.probeControl.hide()
        }
      },

      destroy () {
        this._removeMap()
        this.visible = false
      },

      selectAddress () {
        this.$emit('addressSelect', this.currentStation)
      }
    }
  }

</script>
<style lang="less" scoped>
  .suggestmap,.suggestmap .mapcontainer {
    width: 100%;
    height: 100%
  }

  .map-background {
    background:url("../../assets/tag/32.png") repeat 0 0 #e5e3df;
  }

  .suggestmap .info-card-wrapper {
    position: fixed;
    left: 0;
    bottom: 10PX;
    width: 100%
  }

  .suggestmap .info-card-wrapper .info-card {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    box-sizing: border-box;
    width: 94%;
    height: 60PX;
    margin: 0 auto;
    padding: 0 14PX;
    background: #fff;
    border-radius: 2PX;
    box-shadow: 0 1PX 3PX rgba(0,0,0,.1);
    font-size: 0
  }

  .suggestmap .info-card-wrapper .info-card .icon {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 24PX;
    flex: 0 0 24PX;
    width: 24PX
  }

  .suggestmap .info-card-wrapper .info-card .icon .icon-start {
    display: inline-block;
    width: 16PX;
    height: 20PX;
    background-size: 16PX 20PX;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAMAAACo9wirAAAAbFBMVEUAAAAynokynokynokynokynokynokynokynokynokynokynokynokynokynokynok8vKP////Z7+p+zr2v39Q4r5c1qpQ4sJk6tp32+/pwyrbt9/W649rj8+9gxbCk289PwarK6eKY18mL0sPdHCmOAAAAEHRSTlMA/veaCiTq0clXiesyI4qIwapJeAAAATlJREFUOMvdk+lygzAMhI3NnbS1LIcjHLne/x1rHLIOJB2mf/P9YQbW2pWRRCAuVJ5KmeaqiMUriZJV3WhHU1dSJWJJ/CMP+omDLBdVvrJKr6iypyL7FMcDh3QP+7TWb6jTZPbPcH5VI7vnKOG/pip9QKlnerNWyMlEwcCQ1kfjeZgol8AX8F9aMsZOGEKJWBRzgtHajqxl7bCEFIVQoUUcDIJaibyZLZgHYvYZOgiaXOxw3GOoRciJnUCTxzOTS0Bm2WgQdCYIrgwBLDT1TETWC1oDC4QcJ8GJRxqYb3RBSLR5o/ZE/AjLaBMX1VN7f8+Oc7goXHU7HDvqTG/v4KofP2scTvp8tRczE36WSKT+E5lsDMz35shtDe3m2INkY3FcjvJ19f63vFj/KML6vyeK/OOzBZFjJfkFSSE09uBdnOgAAAAASUVORK5CYII=)
  }

  @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) {
    .suggestmap .info-card-wrapper .info-card .icon .icon-start {
      background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA8CAMAAAAXHsnOAAAAllBMVEUAAAAynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynokynok8vKP///8ynol+zr3Z7+qv39Q6t542q5Q7uaE5tJw4r5hgxbA3rZY1qZLj8+9wyrZPwaqk28+649r2+/rF59+Y18nt9/WL0sO8r6m8AAAAGnRSTlMA8xn3FI/82s/McVhPBreUde1pZiW4eiopBDorq+gAAAICSURBVEjH7ZZtc6IwEMcDiChU1Nb2erskPCviU/v9v9xtwYxJTCuO9+rmfi9gnMk/7n93s4FdMYr8OFh63jKI/WjEbjAKp8mmKrMCoMjKapNMw580ru/kGWhkuTd3mZ3fC2cNFtbOYsYsrCZ5AVaKfPKLXfHkVPAtlfPEDF7GJfxAOX5hGs+mWZMsf9biGWdwg2ysRPXulHCT0nmX62eTCgZQTWR2FzkMIl+c6+sUMIjC6Ws+N+orxAnsrOddv3mgg5jCN3gjEoS5VcBRwhUXIQmmaglSAlHQcyc6Gk2QTSmiRNtdIsPimgASl0UbsP4Dtwo2EfMrsJu2CiqfxeU9gjJmgeq55QTikZ7bvcU0ZAHTykyLJULoaZXFZlqS6pSglfQ8CRRwTUICDd4CpQkIu8DTQ4ItRWAIuNZ/S2n6YmJLAjJdnwU1HraqaSOtn7R72leaBNd5LWOjcGkv+Kr0WUC/WrVwRmscv0KSHlAQiB96a7hamj4Qm30v2OGZT6359PausafPGO+oQW1v4wDRrt3GNdjJQ+OINtgAPyDRCGKfpt1LOaLGEDjgDqA9kVWV42UImGOmFe3FD5fU+pi5f5DdPyrZatgwXt077h+5UIZfWcMvxYevXWL25tkvdu9t9sCnwwMfJxI38l+DZZIkwasfuWwoJOje/wX/tCCR/A3BH253wr0PS9/0AAAAAElFTkSuQmCC)
    }
  }

  .suggestmap .info-card-wrapper .info-card .address-wrapper {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    overflow: hidden;
    height: 60PX;
  }

  .suggestmap .info-card-wrapper .info-card .address-wrapper .address-info {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 20PX;
  }

  .suggestmap .info-card-wrapper .info-card .address-wrapper .address-info.noaddress {
    margin-top: 6PX;
  }

  .suggestmap .info-card-wrapper .info-card .address-wrapper .address-info .displayname {
    display: inline-block;
    vertical-align: top;
    font-size: 14PX;
    color: #333
  }

  .suggestmap .info-card-wrapper .info-card .address-wrapper .address-info .marker {
    display: inline-block;
    vertical-align: top;
    position: relative;
    top: -3PX;
    margin-left: 6PX;
    padding: 4PX 6PX;
    border-radius: 2PX;
    font-size: 12PX;
    color: #fff;
    -webkit-transform: scale(.8);
    transform: scale(.8);
    -webkit-transform-origin: left center;
    transform-origin: left center
  }

  .suggestmap .info-card-wrapper .info-card .address-wrapper .address-info .marker.recommend {
    background-color: #3cbca3
  }

  .suggestmap .info-card-wrapper .info-card .address-wrapper .address-info .marker.current {
    background-color: #3ca0e6
  }

  .suggestmap .info-card-wrapper .info-card .address-wrapper .address {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12PX;
    color: #999
  }

  .suggestmap .info-card-wrapper .info-card .tip {
    text-align: right;
    color: #666
  }

  .suggestmap .info-card-wrapper .info-card .tip .text {
    vertical-align: middle;
    font-size: 14PX;
  }
</style>
