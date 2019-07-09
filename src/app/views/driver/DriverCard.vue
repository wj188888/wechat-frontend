<template>
  <main-box :title="title" main-class=" scrollingBox has-abs-bottom" :go-back="goBack">
    <follow-us v-if="driverData.brandName" :is-follow="false"></follow-us>
    <div class="mar20">
      <div class="driver-card">
        <div class="driver-card-intro clearfix">
          <div class="driver-avatar" :style="driverData.driver.avatar ? {backgroundImage:'url(\'' + driverData.driver.avatar + '\')'} : ''">
            <i class="icon-driver-vip" :class="{'icon-driver-novip': driverData.driver.generalRole && driverData.driver.generalRole.qualification != 1}"></i>
          </div>
          <div class="driver-intro">
            <p class="name">
              {{driverData.driver.fullName}}
              <span class="score">{{driverData.driver.score ? driverData.driver.score.toFixed(1) : '5.0'}}</span>
            </p>
            <p class="age"><span class="company-name">{{driverData.driver.companyName}}</span>·{{driverData.driver.driveAge ? driverData.driver.driveAge + '年驾龄' : '3年以上驾龄'}}</p>
            <p class="car" v-if="driverData.driver.driveCar">
              {{driverData.driver.driveCar.brandName}}·{{driverData.driver.driveCar.totalSeats}}座·{{driverData.driver.driveCar.licensePlatProvince}}{{driverData.driver.driveCar.licensePlat}}
            </p>
            <p class="car" v-else>暂无车辆信息</p>
          </div>
        </div>
        <!--<p class="driver-text">个人简介：服务态度良好，车技好，欢迎来电咨询</p>-->
      </div>

      <div class="page-box">
        <h2>
          <i class="shu"></i>我的服务
          <p class="select" v-if="driverData.serverProduct">
            <input type="text" placeholder="请选择具体车辆" v-selector:selectConfig="productType" readonly/>
            <i class="icon-r-jt"></i>
          </p>
        </h2>
        <div v-if="driverData.serverProduct">
          <ul class="driver-ticket-list" v-for="(skus, key) in driverData.serverProduct" v-show="key == productType">
            <li class="line line-x-t" v-for="sku in skus" @click="buyTicket(sku)">
              <div class="driver-ticket-time">
                <p>{{ sku.startupTime | formatDate('monthDay') }}</p>
                <p>{{ sku.startupTime | formatDate('time') }}</p>
              </div>
              <ul class="driver-ticket-address">
                <li>
                  <i class="circle-bg-start">始</i>
                  <div class="shu"></div>
                  <span>{{sku.aAddress.city}}{{sku.aAddress.detailAddress ? '·' + sku.aAddress.detailAddress : ''}}</span>
                </li>
                <li>
                  <i class="circle-bg-end">终</i>
                  <span>{{sku.bAddress.city}}{{sku.bAddress.detailAddress ? '·' + sku.bAddress.detailAddress : '' }}</span>
                </li>
              </ul>
              <a class="driver-buy-button">购买</a>
            </li>
          </ul>
        </div>
        <div class="no-service line line-x-t" v-if="!driverData.serverProduct">该司机暂无服务产品</div>
      </div>

      <div class="page-box" v-if="menuLength">
        <h2 class="line line-x-b"><i class="shu"></i>公司服务</h2>
        <button-nav></button-nav>
      </div>
      <p class="driver-card-tips">
        <!--如有购票疑问，请拨打公司电话 {{driverData.driver.phone}}-->
      </p>
    </div>

    <div slot="footer">
      <div class="abs-bottom-box line line-x-t">
        <div class="buy-left line line-y-r" @click="showShare = true">
          <a class="button"></a>
        </div>
        <div class="buy-right buy-w100" @click="callService(driverData.driver.phone, 'driver')">
          <a class="button"></a>
        </div>
      </div>

      <div class="share-box" v-show="showShare" @click="showShare = false">
        <div class="share-tips">
          <p>点击右上角进行分享</p>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import FollowUs from 'components/followUs/index'
  import buttonNav from 'appComponents/buttonNav/index'
  import selector from 'directives/select'
  import phone from 'mixins/phone'

  export default {
    directives: {
      selector
    },
    components: {
      MainBox,
      FollowUs,
      buttonNav
    },
    mixins: [phone],
    data () {
      return {
        title: this.$route.meta.title,
        showDialog: false,
        driverId: '',
        driverData:{
          driver:{},
          serverProduct:{},
          driverCard:{}
        },
        selectConfig:'',
        productType:'',
        showShare: false
      }
    },
    computed: {
      menuLength () {
        if(appStorage.get('productAliasItems')) {
          let productAliasItems = JSON.parse(appStorage.get('productAliasItems'))
          return productAliasItems.length
        }else{
          return 0
        }
      }
    },
    mounted(){
      this.driverId = this.$route.query.driverId
//      this.driverId = 'driver_CC9BA03DDDEB0ECFA2B25B97B9C7504FA698F062BC0BA7D2D97109205D60F0F4'
      this.driverGetDriverCard()
    },
    methods: {
      goBack () {
        this.$router.push({
          name: appStorage.get('indexRouter')
        })
      },

      /**
       * 查找司机详情
       */
      driverGetDriverCard () {
        this.$store.commit('UPDATE_LOADING', true)
        api.driverGetDriverCard(this.driverId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.driverData = data.resultData
            if(this.driverData.serverProduct){
              let selectData = []
              for(let i in this.driverData.serverProduct){
                if(this.driverData.serverProduct.hasOwnProperty(i)){
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
              this.productType = selectData[0].value
            }
  
            interfaceApi.share({
              share: true,
              shareUrl: location.href,
              shareTitle: this.driverData.driver.driverCard.title,
              shareDesc: this.driverData.driver.driverCard.content,
              shareImgUrl: this.driverData.driver.driverCard.avatarUrl
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
            if(sku.productTypeLevelTwo == 'CITY_EXPRESS_BUS'){
              pageRouter = 'busDetail'
            }else if(sku.productTypeLevelTwo == 'CITY_SPECIAL_BUS'){
              pageRouter = 'appointBus'
              query = {
                productId: sku.productId,
                startPlace: sku.aAddress.city,
                endPlace: sku.bAddress.city,
              }
            }
            break;
          case 'AIRPORT_BUS':
            if(sku.productTypeLevelTwo == 'AIRPORT_EXPRESS_BUS'){
              pageRouter = 'airportTicket'
            }
            break;
          case 'TRAIN_STATION_BUS':
            if(sku.productTypeLevelTwo == 'TRAIN_EXPRESS_BUS'){
              pageRouter = 'trainstationTicket'
            }
            break;
          case 'WORK_BUS':
            if(sku.productTypeLevelTwo == 'WORK_SHUTTLE_BUS'){
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
          case 'SCHOOL_BUS':
            if(sku.productTypeLevelTwo == 'SCHOOL_EXPRESS_BUS'){
              pageRouter = 'schoolSearch'
            }else if(sku.productTypeLevelTwo == 'SCHOOL_SPECIAL_BUS'){
              pageRouter = 'schoolBusSpecial'
              query = {
                productId: sku.productId,
                startPlace: sku.aAddress.city,
                endPlace: sku.bAddress.city,
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
  .driver-card {
    padding-top: 42px;
    padding-bottom: 42px;
    padding-left: 32px;
    margin-bottom: 20px;
    border-radius: 6px;
    background: #fff;
  }

  .driver-avatar {
    position: relative;
    float: left;
    width: 130px;
    height: 130px;
    background: url("../../../assets/driver.png") no-repeat center center;
    background-size: 130px 130px;
    border-radius: 50%;
  }

  .icon-driver-vip{
    position: absolute;
    display: block;
    width: 50px;
    height:38px;
    right:-3PX;
    bottom:-8px;
    background:url("../../../assets/vip.png") no-repeat 0 bottom;
    background-size:48px 35px;
  }
  .icon-driver-novip{
    background:url("../../../assets/novip.png") no-repeat 0 bottom;
    background-size:49px 35px;
  }

  .driver-intro {
    margin-left: 170px;
    font-size: 24px;
    color: #4c4c4c;
  }

  .driver-intro .name {
    padding-top: 10px;
    margin-bottom: 20px;
    font-size: 32px;
    color: #121212;
  }

  .score{
    position:relative;
    top:-3PX;
    padding-left:32px;
    font-size:24px;
    color:#ff6600;
    &:before{
       content: "";
       display:block;
       position: absolute;
       top:-2px;
       left:0;
       width: 30px;
       height:28px;
       background:url("../../../assets/car/star_yellow.png") no-repeat 2px center;
       background-size:26px 26px;
     }
  }
  .driver-intro .age {
    margin-bottom: 12px;
  }

  .driver-intro .company-name{
    display: inline-block;
    max-width:300px;
    vertical-align: bottom;
    white-space: nowrap;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    overflow:hidden;
  }

  .driver-text {
    padding: 26px 0 40px;
    font-size: 24px;
    color: #4c4c4c;
  }

  .page-box {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 6px;
  }

  .page-box h2 {
    height: 86px;
    line-height: 86px;
    font-size: 28px;
    color: #121212;
    font-weight: normal;
    padding: 0 20px;
  }

  .page-box h2 .shu {
    display: inline-block;
    position: relative;
    top: -3px;
    width: 4px;
    height: 24px;
    margin-right: 10px;
    background: #ff6600;
    vertical-align: middle;
  }

  .page-box h2 .select {
    position: relative;
    float: right;
    padding-right: 20px;
  }

  .page-box h2 .select .icon-r-jt:after{
    right:0;
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
  }

  .driver-ticket-time {
    float: left;
    width: 160px;
  }

  .driver-ticket-time p:last-child {
    padding-top: 8px;
  }

  .driver-ticket-address {
    margin-left: 160px;
    margin-right: 90px;
  }

  .driver-ticket-address li {
    position: relative;
    line-height:1.1;
  }

  .driver-ticket-address .shu {
    position: absolute;
    left: 12px;
    top: 36px;
    width: 1PX;
    height: 46px;
    background-color: #dbdedc;
  }

  .driver-ticket-address i {
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

  .driver-ticket-address span{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
    width: 80%;
  }

  .driver-ticket-time p:first-child,
  .driver-ticket-address li:first-child {
    margin-bottom: 50px;
  }

  .driver-buy-button {
    position: absolute;
    right: 20px;
    top: 50%;
    width: 86px;
    height: 46px;
    line-height:46px;
    margin-top: -23px;
    color: #fff;
    text-align:center;
    background-color:#ff6600;
    border-radius:5px;
  }

  .driver-card-tips {
    padding-bottom: 100px;
    font-size: 20px;
    color: #888;
    text-align: center;
  }

  .buy-left a {
    background: url("../../../assets/share.png") no-repeat center center;
    background-size: 48px 42px;
  }

  .buy-right a {
    background: url("../../../assets/driver_card_phone.png") no-repeat center center;
    background-size: 46px 46px;
  }

  .share-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color:rgba(0, 0, 0, 0.7);
    z-index: 210;
  }

  .share-tips {
    position: relative;
    padding-top: 280px;
    background: url('../../../assets/charter/share_jt.png') no-repeat right 0;
    background-size: 71px 312px;
    text-align: center;
    font-size: 28px;
    color: #fff;
    z-index: 200;
  }

  .share-tips p:first-child {
    margin-bottom: 30px;
  }

  .share-tips em {
    color: #ff6600;
    font-size: 36px;
  }
</style>

