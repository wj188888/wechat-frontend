<template>
  <main-box :title="title" main-class=" scrollingBox has-abs-bottom" :show-back="false" :show-more="false">
    <div class="car-info-box mar-b-20">
      <img class="car-type" :src="carImage"/>
      <p class="car-number">{{car.licensePlatProvince}}{{car.licensePlat}}</p>
      <p class="car-company">{{car.firmName}}</p>
      <ul class="car-info-list">
        <li>{{car.grade | getCarType}}</li>
        <li>{{car.brandName}}</li>
        <li>{{car.totalSeats}}座</li>
      </ul>
      <P class="car-location line line-x-t">当前定位：{{address}}</P>
    </div>
    <div class="page-box">
      <h2>
        <i class="shu"></i>最近班次
                <p class="select" v-show="typeSkus">
        <input type="text" placeholder="请选择" v-selector:selectConfig="productType" readonly/>
        <i class="icon-r-jt"></i>
      </p>
      </h2>
      <div v-if="typeSkus">
        <ul class="driver-ticket-list" v-for="(typeSku, key) in typeSkus" v-show="key == productType">
          <li class="line line-x-t" v-for="sku in typeSku" @click="buyTicket(sku)">
            <div class="driver-ticket-time">
              <p>{{ sku.startupTime | formatDate('monthDay') }}</p>
              <p>{{ sku.startupTime | formatDate('time') }}</p>
            </div>
            <ul class="driver-ticket-address">
              <li><i class="circle-bg-start">始</i>
                <div class="shu"></div> {{sku.aAddress.city}}·{{sku.aAddress.detailAddress}}
                            </li>
              <li>
                <i class="circle-bg-end">终</i> {{sku.bAddress.city}}·{{sku.bAddress.detailAddress}}
                            </li>
            </ul>
            <a class="driver-buy-button">购买</a>
          </li>
        </ul>
      </div>
      <div class="no-service line line-x-t" v-if="!typeSkus">该车辆暂无服务产品</div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Selector from 'directives/select'
  
  export default {
    directives: {
      Selector
    },
    components: {
      MainBox,
    },
    data () {
      return {
        title: this.$route.meta.title,
        carId: '',
        car:{},
        typeSkus:{},
        address:'正在获取定位信息...',
        carImage: '',
        productType:'',
        selectConfig:{},
      }
    },
    mounted(){
      this.storeId = this.$route.query.StoreId || appStorage.get('StoreId')
      this.carId = this.$route.query.carId
      this.carGetCarCard()
    },
    methods: {
      
      /**
       * 查找司机详情
       */
      carGetCarCard () {
        api.carGetCarCard(this.carId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.car = data.resultData.car
            this.typeSkus = data.resultData.typeSkus
            this.carImage = data.resultData.carImage
            let point = data.resultData.point
            if(point){
              let _this = this
              let pt = new BMap.Point(point.longitude, point.latitude);
              let geoc = new BMap.Geocoder();
              geoc.getLocation(pt, function(rs){
                let addComp = rs.addressComponents;
                _this.address = addComp.city + addComp.district + addComp.street + addComp.streetNumber
              });
            }else{
              this.address = '暂时无法获取到定位信息'
            }
            if(this.typeSkus){
              let selectData = []
              for(let i in this.typeSkus){
                if(this.typeSkus.hasOwnProperty(i)){
                  selectData.push({
                    text: TOOL[i],
                    value: i
                  })
                }
              }
              this.selectConfig = {
                theme: 'ios',
                lang: 'zh',
                display: 'bottom',
                data: selectData
              }
              this.$nextTick(()=>{
                this.productType = selectData[0].value
              })
            }
            interfaceApi.share({
              share: true,
              shareUrl: location.href,
              shareTitle: this.car.licensePlatProvince + this.car.licensePlat + '行程分享',
              shareDesc: '点击即可查看车辆最新定位信息与最新班次行程',
              shareImgUrl: this.carImage
            });
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      
      /**
       * 购票
       */
      buyTicket (sku) {
        let query = {
          skuId: sku.id,
          price: sku.price
        }
        let time = TOOL.newGetDate({date:sku.startupTime, type: 'time'})
        let pageRouter
        switch (sku.productTypeLevelOne){
          case 'CITY_BUS':
            if(sku.productTypeLevelTwo === 'CITY_EXPRESS_BUS'){
              pageRouter = 'busDetail'
            }
            break;
          case 'AIRPORT_BUS':
            if(sku.productTypeLevelTwo === 'AIRPORT_EXPRESS_BUS'){
              pageRouter = 'airportTicket'
            }
            break;
          case 'TRAIN_STATION_BUS':
            if(sku.productTypeLevelTwo === 'TRAIN_EXPRESS_BUS'){
              pageRouter = 'trainstationTicket'
            }
            break;
          case 'SCHOOL_BUS':
            if(sku.productTypeLevelTwo === 'SCHOOL_EXPRESS_BUS'){
              pageRouter = 'schoolBusExpress'
            }
            break;
          case 'SCENIC_BUS':
            if(sku.productTypeLevelTwo === 'SCENIC_EXPRESS_BUS'){
              pageRouter = 'scenicBusExpress'
            }
            break;
          case 'WORK_BUS':
            if(sku.productTypeLevelTwo === 'WORK_SHUTTLE_BUS'){
              pageRouter = 'workTicket'
              query = {
                storeId: sku.storeId,
                skuId: sku.id,
                flightId: sku.flightId,
                time: time,
                aAddress: sku.aAddress.detailAddress,
                firmName: sku.firmName,
                bAddress: sku.bAddress.detailAddress,
              }
            }
            break;
        }
        this.$router.push({
          name: pageRouter,
          query: query
        })
      },
      
    }
  }
</script>
<style lang="less" scoped>
  .car-info-box{
    text-align:center;
    background:#fff;
    .car-type{
      width: 310px;
      height: 170px;
      margin-top:75px;
      margin-bottom:40px;
    }
    .car-number{
      font-size:36px;
      color:#121212;
    }
    .car-company{
      margin: 14px 0;
      font-size:24px;
      color:#4c4c4c;
    }
    .car-info-list{
      margin-bottom:40px;
      text-align:center;
      li{
        display:inline-block;
        margin-left:13px;
        font-size:22px;
        color:#ff6600;
        padding:10px;
        border-radius:4px;
        border:1px solid #dfdfdf;
        &:first-child{
          margin-left:0;
        }
      }
    }
    .car-location{
      padding:20px 20px 20px 52px;
      text-align:left;
      font-size:26px;
      color:#4c4c4c;
      background:url("../../../assets/firm/car_location.png") no-repeat 20px center;
      background-size:17px 24px;
    }
  }
  .page-box {
    margin-bottom: 20px;
    background-color: #fff;
    h2 {
      height: 86px;
      line-height: 86px;
      font-size: 28px;
      color: #121212;
      font-weight: normal;
      padding: 0 20px;
      .shu {
        display: inline-block;
        position: relative;
        top: -3px;
        width: 4px;
        height: 24px;
        margin-right: 10px;
        background: #ff6600;
        vertical-align: middle;
      }
      .select {
        position: relative;
        float: right;
        padding-right: 20px;
      }
      
    }
  }
  
  .no-service{
    position: relative;
    padding: 30px 32px;
    font-size: 26px;
    color: #4c4c4c;
  }
  
  .driver-ticket-list > li {
    position: relative;
    padding: 30px 20px;
    font-size: 26px;
    color: #4c4c4c;
    .driver-ticket-time {
      float: left;
      width: 160px;
      p:last-child {
        padding-top: 8px;
      }
    }
  }
  
  .driver-ticket-address {
    margin-left: 160px;
    margin-right: 60px;
    li {
      position: relative;
      line-height:1.1;
    }
    .shu {
      position: absolute;
      left: 12px;
      top: 36px;
      width: 1PX;
      height: 46px;
      background-color: #dbdedc;
    }
    i {
      display: inline-block;
      width: 26px;
      height: 26px;
      line-height: 26px;
      margin-right: 16px;
      font-size: 16px;
      text-align: center;
      color: #ffffff;
      border-radius: 50%;
    }
  }
  
  .driver-ticket-time p:first-child,
  .driver-ticket-address li:first-child {
    margin-bottom: 50px;
  }
  
  .driver-buy-button {
    position: absolute;
    right: 20px;
    top: 50%;
    width: 60px;
    margin-top: -14px;
    color: #ff6600;
  }

</style>