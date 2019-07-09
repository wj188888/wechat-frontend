<template>
  <div class="suggestlist">
    <div class="split"></div>
    <div class="list-wrapper" ref="wrapper">
      <div>
        <my-address info-type="show" :set-myaddress="setMyaddress"></my-address>
        <ul class="suggest-list-box" v-show="showList">
          <li v-for="data in dataList"
              @click="selectItem(data)"
              @touchstart="addActiveCls"
              @touchend="removeActiveCls">
            <p class="p1">{{data.name}}</p>
            <p class="p2">{{data.address}}</p>
          </li>
        </ul>
        <div class="noresult" v-show="!showList">
          <div class="warning">
            <div class="warning-icon">
              <span class="mfic-important"></span>
            </div>
          </div>
          <div class="desc">{{noResultDesc}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import MyAddress from 'appComponents/myAddress/index.vue'
  
  export default {
    components: {
      MyAddress
    },
    props: {
      dataList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        address1: '',
        address2: '',
        noResultDesc: "请搜索您要去的地方",
        showList: true,
      }
    },
    watch: {
      dataList (newVal) {
        if(newVal.length){
          this.$nextTick(() => {
            if(this.scroll){
              this.scroll.refresh()
            }else{
              this.scroll = new BScroll(this.$refs.wrapper, {
                click: true
              })
              this.scroll.on('beforeScrollStart', () => {
                this.$emit('beforeScrollStart')
              })
            }
          })
        }else{
          this.noResultDesc = "暂无结果，换个词试试吧~"
        }
        this.showList = !!newVal.length
      }
    },
    mounted () {
    
    },
    methods: {
      selectItem (address) {
        let _this = this;
        let geocoder = new qq.maps.Geocoder({
          complete:function(result){
            let geoAddress = result.detail
            let param  = {
              city: geoAddress.addressComponents.city,
              county: geoAddress.addressComponents.district,
              town: geoAddress.addressComponents.town,
              detailAddress: address.name,
              name: address.name,
              lat: geoAddress.location.lat,
              lng: geoAddress.location.lng
            }
            _this.$emit('addressSelect', param)
          }
        });
        let point = new qq.maps.LatLng(address.latLng.lat, address.latLng.lng)
        geocoder.getAddress(point);
      },
      addActiveCls (elem) {
        $(elem.currentTarget).addClass('active')
      },
      removeActiveCls (elem) {
        $(elem.currentTarget).removeClass('active')
      },
      
      /**
       * 将后台地址转换成百度地图格式
       */
      toTencentAddress (address) {
        if (!address) {
          return ''
        }
        let latLng = TOOL.baiduToTencent({lat:address.latitude, lng:address.longitude})
        return {
          name:address.detailAddress,
          latLng: latLng
        }
      },
      
      /**
       * 设置我的地址信息
       */
      setMyaddress (infoAddress) {
        infoAddress = this.toTencentAddress(infoAddress);
        if (infoAddress && infoAddress.name) {
          this.selectItem(infoAddress)
        } else {
          this.$router.push({name: 'setInfo'})
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .suggestlist {
    width: 100%;
    height: 100%
  }
  
  .suggestlist .split {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 10PX;
    background: #f3f4f5
  }
  
  .suggestlist .list-wrapper {
    width: 95%;
    height: 100%;
    margin: 0 auto;
    border-radius: 2PX;
    background: #fff;
    box-shadow: 0 1PX 3PX rgba(0,0,0,.1)
  }
  
  
  .suggest-list-box{
    padding-bottom:20px;
    li {
      padding: 20px 20px 20px 90px;
      background: url("../../assets/map_no.png") no-repeat 30px center;
      background-size:22px 28px;
      .p1{
        margin-bottom:10px;
        line-height:1.4;
        font-size:28px;
      }
      .p2{
        font-size:24px;
        color:#999;
        line-height:1.4;
      }
      &.active{
        background-color: rgba(0,0,0,.04)
      }
    }
  }

</style>