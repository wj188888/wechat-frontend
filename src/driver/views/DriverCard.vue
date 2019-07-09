<template>
<div class="product-bg" v-show="showBg">
    <div class="product-container scrollingBox fix-top">
        <div class="mar20">
            <div class="driver-card" @click="editDriver">
                <div class="driver-card-intro clearfix">
                    <div class="driver-avatar" id="avatar" :style="driverData.driver.avatar ? {backgroundImage:'url(\'' + driverData.driver.avatar + '\')'} : ''">
                        <i class="icon-driver-vip" :class="{'icon-driver-novip': driverData.driver.generalRole && driverData.driver.generalRole.qualification != 1}"></i>
                    </div>
                    <div class="driver-intro">
                        <p class="name" id="name">
                            {{driverData.driver.fullName}}
                            <span class="score">{{driverData.driver.score ? driverData.driver.score.toFixed(1) : '5.0'}}</span>
                        </p>
                        <p class="age" id="age">{{driverData.driver.companyName}}·{{driverData.driver.driveAge ? driverData.driver.driveAge + '年驾龄' : '3年以上驾龄'}}</p>
                        <p class="car" v-if="driverData.driver.driveCar">
                        {{driverData.driver.driveCar.brandName}}·{{driverData.driver.driveCar.totalSeats}}座·{{driverData.driver.driveCar.licensePlatProvince}}{{driverData.driver.driveCar.licensePlat}}
                        </p>
                        <p class="car" v-else>暂无车辆信息</p>
                    </div>
                    <!--<i class="icon-r-jt"></i>-->
                </div>
                <!--<p class="driver-text">个人简介：服务态度良好，车技好，欢迎来电咨询</p>-->
            </div>

            <div class="page-box">
                <h2>
                    <i class="shu"></i>我的服务
                    <p class="select" v-if="driverData.serverProduct">
                        <input type="text" placeholder="请选择具体车辆" v-selector:selectConfig="selected" readonly/>
                        <i class="icon-r-jt"></i>
                    </p>
                </h2>
                <div v-if="driverData.serverProduct">
                    <ul class="driver-ticket-list" v-for="(skus, key) in driverData.serverProduct" v-show="key == selected">
                        <li class="line line-x-t" v-for="sku in skus">
                            <div class="driver-ticket-time">
                                <p>{{ sku.startupTime | formatDate('monthDay') }}</p>
                                <p>{{ sku.startupTime | formatDate('time') }}</p>
                            </div>
                            <ul class="driver-ticket-address">
                                <li><i class="circle-bg-start">始</i>
                                    <div class="shu"></div> {{sku.aAddress.city}}{{sku.aAddress.detailAddress ? '·' + sku.aAddress.detailAddress : ''}}
                                </li>
                                <li>
                                    <i class="circle-bg-end">终</i> {{sku.bAddress.city}}{{sku.bAddress.detailAddress ? '·' + sku.bAddress.detailAddress : ''}}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="no-service line line-x-t" v-if="!driverData.serverProduct">该司机暂无服务产品</div>
            </div>

            <div class="page-box" v-if="menuLength">
                <h2 class="line line-x-b"><i class="shu"></i>公司服务</h2>
                <button-nav type="link"></button-nav>
            </div>
            <p class="driver-card-tips">
                <!--如有购票疑问，请拨打司机电话 {{driverData.driver.phone}}-->
            </p>
        </div>

        <div class="fix-bottom-box line line-x-t">
            <div class="buy-left line line-y-r" @click="shareCard">
                <a class="button"></a>
            </div>
            <div class="buy-right" @click="callTelphone">
                <a class="button"></a>
            </div>
        </div>
    </div>
</div>
</template>
  <script>
  import selector from 'directives/select'
  import buttonNav from 'appComponents/buttonNav/index'
  
  export default {
    directives: {
      selector
    },
    components: {
      buttonNav,
    },
    data () {
      return {
        selected:'',
        productType:[],
        companyProduct:[],
        taskShareGetQrCode: '',
        driverId: '',
        driverData:{
          driver:{},
          serverProduct:{},
          driverCard:{}
        },
        selectConfig:'',
        storeId:'',
        showBg:false
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
//      this.driverId = 'driver_3D1CAFFDDA79DF22EB9A37AD27AA6968C428CA6FC080FDB925041432169510AD'
      this.driverGetDriverCard()
    },
    methods: {

      /**
       * 查找司机详情
       */
      driverGetDriverCard () {
          this.$store.commit('UPDATE_LOADING', true)
        api.driverGetDriverCard(this.driverId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.driverData = data.resultData
            this.productType = []
            this.storeId = data.resultData.storeId
            let brandName = data.resultData.brandName
            if(this.driverData.serverProduct){
              let selectData = []
                for(let i in this.driverData.serverProduct){
                  let obj = {}
                   obj.text = TOOL[i]
                   obj.value = i
                   this.productType.push(i)
                   selectData.push(obj)
                }
                this.selected = this.productType[0]
                this.selectConfig = {
                   theme: 'ios',
                   lang: 'zh',
                   display: 'bottom',
                   data: selectData
                }
            }
            this.getMenu(this.storeId)
            this.showBg = true
            myJSInterface.hideProgress()
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      getMenu (StoreId) {
        localStorage['StoreId'] = StoreId
        let resource = api.storeFind()
        $.ajax({
          url: resource.url,
          async: false,
          dataType: 'json',
          data: {
            storeId: StoreId
          },
          success: function (data) {
            if (data.resultCode === '0') {
              let result = data.resultData;
              if(result.productAlias && result.productAlias.productAliasItems){
                appStorage.set('productAliasItems', JSON.stringify(result.productAlias.productAliasItems))
              }
              
            }
          }
        })
      },
      
      /**
       * 打电话
       */
      callTelphone() {
        myJSInterface.callUp(this.driverData.driver.phone)
      },
      shareCard () {
          myJSInterface.shareIDCard()
      },
      editDriver () {
        myJSInterface.editDriver()
      },
    }
  }
</script>
<style lang="less" scoped>
  .fix-top {
    padding-bottom: 5.5rem;
  }
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
    background: url("../../assets/driver.png") no-repeat center center;
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
      background:url("../../assets/vip.png") no-repeat 0 bottom;
      background-size:48px 35px;
  }
  .icon-driver-novip{
      background:url("../../assets/novip.png") no-repeat 0 bottom;
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
           background:url("../../assets/car/star_yellow.png") no-repeat 2px center;
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
    margin-bottom: 1rem;
    background-color: #fff;
    border-radius: 0.3rem;
}

.page-box h2 {
    height: 4.3rem;
    line-height: 4.3rem;
    font-size: 1.4rem;
    color: #121212;
    font-weight: normal;
    padding: 0 1.6rem;
}

.page-box h2 .shu {
    position: relative;
    top: -0.15rem;
    display: inline-block;
    width: 0.2rem;
    height: 1.2rem;
    margin-right: 0.5rem;
    background: #ff6600;
    vertical-align: middle;
}

.page-box h2 .select {
    position: relative;
    float: right;
    padding-right: 1rem;
}

.page-box h2 .select-product{
    border:0;
    font-size: 1.3rem;
    color: #4c4c4c;
    background:#fff;
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
    margin-right: 60px;
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

  .driver-card-tips {
    padding-bottom: 100px;
    font-size: 20px;
    color: #888;
    text-align: center;
  }

  .share-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height:100%;
    z-index: 210;
    background: no-repeat top right;
    background-color: rgba(0, 0, 0, 0.7);
    background-size: 21rem 17.65rem;
  }

  .share-tips {
    position: relative;
    padding-top: 280px;
    background: url('../../assets/charter/share_jt.png') no-repeat right 0;
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
  .icon-r-jt:after {
    content: " ";
    position: absolute;
    top: 50%;
    right: 0;
    width: .5rem;
    height: .8rem;
    margin-top: -.25rem;
    background: url("../../assets/jt_right.png") no-repeat 0 0;
    background-size: 100%;
}
.fix-bottom-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background-color: #fff;
    overflow: hidden;
}

.buy-left {
    position: relative;
    float: left;
    width: 50%;
    height: 4.5rem;
    background-color: #fff;
}

.buy-right {
    float: left;
    width: 50%;
    height: 4.5rem;
}

.button{
    display: block;
    width: 100%;
    height: 4.5rem;
    line-height: 4.5rem;
    text-align: center;
    font-size: 1.8rem;
    color: #fff;
}

.buy-left a {
    background: url("../../assets/share.png") no-repeat center center;
    background-size: 2.4rem 2.1rem;
}

.buy-right a {
    background: url("../../assets/driver_card_phone.png") no-repeat center center;
    background-size: 2.3rem 2.3rem;
}
</style>

