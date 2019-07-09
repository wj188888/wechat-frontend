<template>
  <div v-if="carpoolProduct && carpoolProduct.id && carpoolProduct.aLatitude">
    <ticket-title :title="title">
      <slot name="title"></slot>
    </ticket-title>
    <div class="address-form">
      <div class="inline-box">
        <label class="icon-carhailing-start"></label>
        <input class="address-start" type="text" placeholder="您在哪上车" v-model="from" readonly @click="jumpToBuilding('from')"/>
      </div>
      <div class="inline-box">
        <label class="icon-carhailing-end"></label>
        <input type="text" placeholder="您要去哪里" v-model="to" readonly @click="jumpToBuilding('to')"/>
      </div>
      <a class="button button-primary" @click="jumpToBuilding('from')">用车</a>
    </div>
    <div class="banner line line-x-t" @click="jumpToBuilding('from')">
      <img src="../../../assets/city/carpoolbanner2.png" alt="">
    </div>
  </div>
</template>
<script>
  import TicketTitle from 'appComponents/title/ticketTitle'

  export default {
    props:['title', 'carpoolProduct', 'productTypeLevelOne', 'productTypeLevelTwo'],
    components:{
      TicketTitle
    },
    data () {
      return {
        localData:{
          from: {
            city: '',
            county: '',
            name:'',
            detailAddress: '',
            lat: '',
            lng: '',
            code: '',
            settingType:'',
            siteId:''
          },
          to: {},
          startTime: '', //出发时间
          contactTelephone: '',
          passengerNum: 0,
          productId:'',
          lineType: '',
          startPlace: '',
          endPlace: '',
          isStart: true, // 判断线路列表入口出发地是否更换
          isEnd: true, // 判断线路列表入口目的地是否更换
        },
        from: '',
        to: '',
      }
    },
    watch: {
      carpoolProduct (newVal) {
        let point1  = this.tanspointBaiduToTencent({
          lat: newVal.aLatitude,
          lng: newVal.aLongitude
        })
        let point2  = this.tanspointBaiduToTencent({
          lat: newVal.bLatitude,
          lng: newVal.bLongitude
        })
        if(newVal){
          this.localData.from = {
            city: newVal.startPlace,
            county: '',
            detailAddress: '',
            lat: point1.lat,
            lng: point1.lng,
            code: newVal.code,
            settingType: newVal.startPlaceSettingType,
            inRange: true,
          }
          this.localData.to = {
            city: newVal.endPlace,
            county: '',
            detailAddress: '',
            lat: point2.lat,
            lng: point2.lng,
            settingType: newVal.endPlaceSettingType,
          }
          this.localData.startPlace = newVal.startPlace
          this.localData.endPlace = newVal.endPlace
          this.localData.productId = newVal.id
          this.localData.lineType = newVal.type
          if(appStorage.get('busCarpooling')) {
            let localData = JSON.parse(appStorage.get('busCarpooling'))
            this.localData = Object.assign(localData, this.localData)
            this.localData.from.code = newVal.code
          }
        }
      }
    },
    mounted () {
//      if(appStorage.get('busCarpooling')){
//        let localData = JSON.parse(appStorage.get('busCarpooling'))
//        this.localData = Object.assign(this.localData, localData)
//
//        if(this.localData.from && this.localData.from.detailAddress){
//          this.from = this.localData.startPlace + '·' + this.localData.from.detailAddress
//        }
//        if(this.localData.to && this.localData.to.detailAddress){
//          this.to = this.localData.endPlace + '·' + this.localData.to.detailAddress
//        }
//      }
    },
    methods:{
      tanspointBaiduToTencent (address) {
        return TOOL.baiduToTencent({
          lat: address.lat,
          lng: address.lng,
        })
      },
      
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        appStorage.set('busCarpooling', JSON.stringify(this.localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove('busCarpooling')
      },

      jumpToBuilding (dataKey) {
        if(dataKey === 'to' && (!this.localData.from.detailAddress || !this.localData.from.lat)){
          this.$store.dispatch('showError', '请先选择出发地');
          return
        }
        this.saveForm()
        this.$router.push({
          name: 'building',
          query:{
            pageRouter: 'busCarpooling',
            pageActive: true,
            productTypeLevelOne: this.productTypeLevelOne,
            productTypeLevelTwo: this.productTypeLevelTwo,
            dataKey: dataKey
          }
        })
      },

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .banner {
    width: 100%;
    height: 200px;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .address-form{
    position: relative;
    .button-primary{
      position:absolute;
      right:20px;
      top:50%;
      width:130px;
      height:80px;
      margin-top:-40px;
    }
  }
  .inline-box {
    padding-right:170px;
    label{
      width:86px;
      background:no-repeat 10px center;
      background-size:30px 30px;
    }
    .address-start{
      border-radius: 0;
      border-bottom: 1PX solid @bc-e5e5e5;
    }
    .icon-carhailing-start{
      background-image:url("../../../assets/order_start.png")
    }
    .icon-carhailing-end{
      background-image:url("../../../assets/order_end.png")
    }
  }
</style>
