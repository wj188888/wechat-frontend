<template>
  <main-box :title="title">
    <div class="car-box-outer mar-b-100">
      <div class="car-box-inner">
        <div class="car-content">
          <div class="car-icon car-type-0"

          >
            <img :src="carImg" alt=""
                 onerror="javascript:this.src='https://obfiwfjx9.qnssl.com/carImg/%E9%98%BF%E5%B0%94%E6%B3%95%E7%BD%97%E5%AF%86%E6%AC%A7Giulia.jpg';"
            >
          </div>
          <div class="car-msg-box">
            <div class="car-type-msg">
              <p class="car-name">{{crOrder | getCarBrandName}}</p>
              <p class="car-detail">
                <span>{{crOrder.vehicleModel}}</span>
                <span>∣</span>
                <span>{{crOrder.seats}}座</span>
                <span>∣</span>
                <span>{{crOrder.displacement | getCarDisplacement}}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="address-box line line-x-t" v-show="showAddress">
            <p class="start-dian" v-if="crOrder.getModel == 1">{{crOrder.getSite.name}}</p>
            <p class="start-dian" v-if="crOrder.getModel == 2">{{crOrder.aAddress.detailAddress}}</p>
            <p>
              {{getDate(crOrder.startTime)}} {{getWeek(crOrder.startTime)}} {{getTime(crOrder.startTime)}}
            </p>
            <p class="end-dian" v-if="crOrder.returnModel == 1">{{crOrder.returnSite.name}}</p>
            <p class="end-dian" v-if="crOrder.returnModel == 2">{{crOrder.bAddress.detailAddress}}</p>
            <p>
              {{getDate(crOrder.endTime)}} {{getWeek(crOrder.endTime)}} {{getTime(crOrder.endTime)}}
            </p>
        </div>
        <div class="rent-money" @click="showAddress=!showAddress">
          <div class="rent-text">
            <i class="icon-b-static allow-position"
               :class="{'icon-allow-active':showAddress}"
            ></i>
          </div>
        </div>
      </div>
      <div class="border mar-tb-20">
        <div class="inline-box" @click="addDriver">
          <label>驾驶员</label>
          <input type="tel" v-show="!localData.driverList" placeholder="请选择车辆驾驶员" maxlength="11"/>
          <div class="driver-msg" v-show="localData.driverList">
            <p class="driver-name" v-text="localData.driverList.realName"></p>
            <p class="driver-card" v-text="localData.driverList.idCard"></p>
          </div>

          <i class="icon-r-jt"></i>
        </div>
        <div v-show="localData.driverList" class="inline-box line line-x-t">
          <label>手机号码</label>
          <input type="tel" v-model="localData.driverList.telephone" placeholder="必填，接收车票信息" maxlength="11"/>
        </div>
      </div>

      <div class="border mar-tb-20 ticket-info-order pad-t-20 pad-b-0 clearfix" style="overflow:hidden;">
        <div class="abs-tit-box orange mar-t-0">
          <p class="abs-tit">车辆租金</p>
          <p class="right-text mar-t-0">
            <span>{{crOrder.orderPrice | formatPrice}}元</span>
          </p>
        </div>
        <div class="abs-tit-box orange">
          <p class="abs-tit">基本保险费</p>
          <p class="right-text">
            <span>{{productList.baseInsurance}}*{{rentDays}}</span><span class="mar-l-10">{{productList.baseInsurance*rentDays | formatPrice}}元</span>
          </p>
        </div>
        <div class="abs-tit-box orange">
          <p class="abs-tit">手续费</p>
          <p class="right-text">
            <span>{{productList.serviceFee | formatPrice}}元</span>
          </p>
        </div>
      </div>

      <div class="border mar-tb-20">
        <div class="inline-box display-block hei-100">
          <label class="pull-left" style="width: auto;">全面保障服务</label>

          <span class="text-right wd100 pull-right">
              <div class="switch-btn-on"
                   :class="{'switch-btn-off': !hasFullInsuranceService}"
                   @click="hasFullInsuranceService=!hasFullInsuranceService"
              ></div>
          </span>
          <span class="pull-right">
            {{productList.fullInsuranceService*rentDays | formatPrice}}元
          </span>
          <span class="pull-right pad-r-20">
            {{productList.fullInsuranceService}}*{{rentDays}}
          </span>


        </div>
      </div>

      <div class="rule-box">
        <div class="rule-box-item">
          <div class="rule-img tip-img"></div>
          <div class="rule-text">
            <p class="rule-title-1">租车须知</p>
            <p class="rule-title-2 change-line">取车凭证：本人身份证+本人驾驶证、副本</p>
            <p class="rule-title-3 change-line">身份证有效期1个月以上，驾驶证有效期2个月以上，否则无法取车</p>
          </div>
        </div>
        <div class="rule-box-item mar-t-64">
          <div class="rule-img notice-img"></div>
          <div class="rule-text">
            <p class="rule-title-1">订单取消规则</p>
            <p class="rule-title-3 change-line">下单成功后15分钟内免费取消， 否则将收取首日租金作为取消费用</p>
          </div>
        </div>
        <div class="rule-box-item mar-t-64">
          <div class="rule-img authority-img"></div>
          <div class="rule-text">
            <p class="rule-title-1">押金预售权</p>
            <p class="rule-title-3 change-line">换车后冻结1500元违章押金，还车15天后无违章，将返还该笔押金</p>
          </div>
        </div>
      </div>

    </div>

    <div slot="footer">
      <div class="abs-bottom-box">
        <div class="buy-left" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span>{{crOrder.orderFee | formatPrice}}</span>
          <span class="detail" v-show="priceMore">详情</span>
          <i class="yellow-jt-up" v-show="priceMore"></i>
        </div>
        <div class="buy-right">
          <input class="button button-primary"
                 type="button" :disabled="!localData.driverList.idCard"
                 @click="createCrOrder"
                 value="提交订单"/>
        </div>
      </div>
      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">车辆租金</span>
            <span class="text-right">
              {{crOrder.orderPrice | formatPrice}}
            </span>
          </p>
          <p>
            <span class="price-d-tit">基本保险费</span>
            <span class="text-right">
              {{productList.baseInsurance | formatPrice}} × {{rentDays}}人
            </span>
          </p>
          <p>
            <span class="price-d-tit">手续费</span>
            <span class=" text-right">
              <!--align-yuan-->
              {{productList.serviceFee | formatPrice}}
            </span>
          </p>
          <p v-if="hasFullInsuranceService">
            <span class="price-d-tit">全面保障服务</span>
            <span class="text-right">
              {{productList.fullInsuranceService | formatPrice}} × {{rentDays}}人
            </span>
          </p>
        </div>
      </div>
    </div>
  </main-box>
</template>

<script>
    import MainBox from 'components/mainBox/index.vue'
    import {XSwitch, Group} from 'vux'

    export default{
        data(){
            return{
                title:this.$route.meta.title,
                localData: {driverList: {}},
                value1: true,
                priceMore: true,
                showPriceDetail: false,
                disableBtn: false,
                showAddress: false,
                hasFullInsuranceService: false, // 是否选择全面服务保障
                crOrder: {},
                posiData: {},
                productList: {},
                rentDays: 1, // 租车时间默认1天
                carImg: 'https://obfiwfjx9.qnssl.com/carImg/%E9%98%BF%E5%B0%94%E6%B3%95%E7%BD%97%E5%AF%86%E6%AC%A7Giulia.jpg'
            }
        },
        components:{
            MainBox,
            XSwitch,
            Group
        },
        watch: {
          hasFullInsuranceService() {
              this.calculateTotalPrice();
          }
        },
        created() {

            if(appStorage.get('crOrder')) {
              this.crOrder = JSON.parse(appStorage.get('crOrder'));
              console.log(this.crOrder);
              this.carImg = `https://obfiwfjx9.qnssl.com/carImg/${this.crOrder.model}.jpg`;
            }
            if(appStorage.get('fillOrder')) {
              this.localData = JSON.parse(appStorage.get('fillOrder'))
            }
            if(appStorage.get('cityMsg')) {
              this.posiData = JSON.parse(appStorage.get('cityMsg'));
              this.carRentalFindByCity();
            }
        },
        methods: {
            addDriver() {
                if(!appStorage.get('fillOrder')) {
                  appStorage.set('fillOrder', JSON.stringify({}))
                }
                this.$router.push({
                  name: 'driverList',
                  query: {
                    page: 'fillOrder',
                    dataKey: 'drivers'
                  }
                })
            },
            getCarClass(type) {
              return 'car-type-'+type;
            },
            getDate(date) {
              return TOOL.getDateName(date);
            },
            getTime(date) {
              return TOOL.getTimeName(date);
            },
            getWeek(date) {
              return TOOL.getWeekName(date);
            },
            carRentalFindByCity() {
              let findData = {
                city: this.posiData.city.replace('市', ''),
                pageNo: 0,
                pageSize: 100
              };
              this.$store.commit('UPDATE_LOADING', true);
              api.carRentalFindByCity(findData).then(res => {
                this.$store.commit('UPDATE_LOADING', false);
                let data = TOOL.toJson(res.data);
                if(data.resultCode == 0) {
                  try {
                    this.productList = data.resultData.content[0];
                    this.rentDays = this.crOrder.allTime.day;
                    if(this.crOrder.allTime.hour >= this.productList.aboveHourToDay) {
                      this.rentDays++;
                    }
                    // 计算订单金额
                    this.calculateTotalPrice();
                  } catch(error) {
                      alert(error);
                  }

                } else {
                  this.$store.dispatch('showError', data.resultMsg);
                }
              }, error => {

              })
            },
            /*
            * 填写订单基本价格
            * */
            fillBasePrice() {
              this.crOrder.baseInsurance = this.productList.baseInsurance*this.rentDays;
              this.crOrder.rentalFee = this.crOrder.orderPrice;
              this.crOrder.serviceFee = this.productList.serviceFee;
              if(this.hasFullInsuranceService) {
                this.crOrder.fullInsuranceService = this.productList.fullInsuranceService*this.rentDays;
              } else {
                this.crOrder.fullInsuranceService = 0;
              }
            },
            calculateTotalPrice() {
                this.crOrder.orderFee = 0;
                this.crOrder.orderFee += this.crOrder.orderPrice;
                this.crOrder.orderFee += this.productList.baseInsurance*this.rentDays;
                this.crOrder.orderFee += this.productList.serviceFee;
                if(this.hasFullInsuranceService) {
                  this.crOrder.orderFee += this.productList.fullInsuranceService*this.rentDays;
                }
            },
            fillBaseInfo() {
                this.crOrder.productId = this.productList.id;
                this.crOrder.province = this.productList.province;
                this.crOrder.city = this.productList.city;
                this.crOrder.contactTelephone = this.localData.driverList.telephone;
                this.crOrder.contactName = this.localData.driverList.realName;
                this.crOrder.idNo = this.localData.driverList.idCard;
                this.crOrder.startTime += ':00';
                this.crOrder.endTime += ':00';
                this.pushSiteToAddress();
            },
            /**
             * 将站点信息保存到address里面去
             */
            pushSiteToAddress() {
                if(this.crOrder.getModel == 1) {
                  this.crOrder.aAddress.detailAddress = this.crOrder.getSite.name;
                  this.crOrder.aAddress.latitude = this.crOrder.getSite.latitude;
                  this.crOrder.aAddress.longitude = this.crOrder.getSite.longitude;
                  if(this.crOrder.getSite.province) {
                      this.crOrder.aAddress.province = this.crOrder.getSite.province.alias;
                  }
                  if(this.crOrder.getSite.city) {
                      this.crOrder.aAddress.city = this.crOrder.getSite.city.alias;
                  }
                  if(this.crOrder.getSite.county) {
                      this.crOrder.aAddress.county = this.crOrder.getSite.county.alias;
                  }
                }
                if(this.crOrder.returnModel == 1) {
                  this.crOrder.bAddress.detailAddress = this.crOrder.returnSite.name;
                  this.crOrder.bAddress.latitude = this.crOrder.returnSite.latitude;
                  this.crOrder.bAddress.longitude = this.crOrder.returnSite.longitude;
                  /*this.crOrder.bAddress.province = this.crOrder.returnSite.province.alias;
                  this.crOrder.bAddress.city = this.crOrder.returnSite.city.alias;
                  this.crOrder.bAddress.county = this.crOrder.returnSite.county.alias;*/
                    if(this.crOrder.returnSite.province) {
                        this.crOrder.bAddress.province = this.crOrder.returnSite.province.alias;
                    }
                    if(this.crOrder.returnSite.city) {
                        this.crOrder.bAddress.city = this.crOrder.returnSite.city.alias;
                    }
                    if(this.crOrder.returnSite.county) {
                        this.crOrder.bAddress.county = this.crOrder.returnSite.county.alias;
                    }
                }

            },
            /**
             * 下订单
             */
            createCrOrder() {
                this.showPriceDetail = false;
                this.$store.dispatch('showConfirm', {
                    content: '取车时请务必携带身份证、驾驶证、副本，否则将无法取车',
                    cancelText:'放弃',
                    confirmText: '继续下单',
                    onConfirm: () => {
                        this.fillBasePrice();
                        this.fillBaseInfo();
                        this.crOrder.orderSource = TOOL.browserType()
                        api.createCrOrder(this.crOrder).then(res => {
                          const data = TOOL.toJson(res.data);
                          if(data.resultCode == 0) {
                              /*appStorage.remove('crOrder');
                               appStorage.remove('rent');
                               appStorage.remove('fillOrder');
                               appStorage.remove('isFirstToRent');*/
                            appStorage.set('isFirstToRent', 'true');

                              /*this.$router.push({
                                  name:'orderList',
                                  query: {
                                      status: -1
                                  }
                              })*/
                              this.$router.push({
                                name: 'rentOrderDetail',
                                query: {
                                  orderId: data.resultData.id
                                }
                              })
                          } else {
                              this.$store.dispatch('showError', data.resultMsg);
                          }
                        })
                    },
                    onCancel: () => {

                    }
                });

            }
        }
    }
</script>
<style lang="less" scoped>
  .border {
    border: 1px solid #e5e5e5;
  }
  .car-box-outer {
    width: 100%;
    height: auto;
    padding: 20px;
  }
  .car-box-inner {
    width: 100%;
    height: auto;
    border: 1px solid #e5e5e5;
    background: #fff;
  }
  .car-content {
    display: flex;

    width: 100%;
    height: 170px;
    padding: 0 20px 0 0;
  }
  .car-msg-box {
    display: flex;
    justify-content: space-between;

    flex: 1;
  .car-type-msg {
    display: inline-block;
    height: 100%;
    .car-name {
      font-weight: bold;
      font-size: 32px;
      color: #121212;
      margin: 25px 0 70px 0;
    }
    .car-detail {
      font-size: 24px;
      color: #4c4c4c;
    }
    }
    .car-money {
      display: inline-block;
      height: 100%;
      padding-top: 20px;

      font-size: 40px;
      color: #121212;

      text-align: right;
    }
  }
  .rent-money {
    width: 100%;
    height: auto;
  }
  .rent-text {
    width: 100%;
    height: 40px;

    text-align: center;

    font-size: 24px;
    color: #4c4c4c;
  }
  .allow-position {
    margin-bottom: 2px;
  }
  .address-box {
    width: 100%;
    height: auto;
    padding: 0 20px;

    overflow: hidden;

    p {
      margin-top: 20px;
      padding-left: 30px;

      font-size: 28px;
      color: #4c4c4c;
    }
  }
  .start-dian {
    background: url("../../../assets/order_start.png") no-repeat left center;
    background-size: 12px 12px;
  }
  .end-dian {
    background: url("../../../assets/order_end.png") no-repeat left center;
    background-size: 12px 12px;
  }
  .driver-msg {
    display: inline-block;
    padding-top: 20px;

    .driver-card, .driver-name {
      font-size: 28px;
      color: #121212;
    }
    .driver-card {
      margin-top: 10px;
    }
  }

  .ticket-info-order {
    padding: 10px 0;
    margin-bottom: 20px;
    background-color: #fff;
    p {
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
      margin-top: 10px;
      font-size: 26px;
      color: #121212;
    &:first-child {
       margin-top: 0;
     }
    }
    .left-span {
      float: left;
      width: 160px;
      height: 30px;
      color: #999;
    }
    .right-span {
      float: right;
      height: 30px;
      color: #999;
    em {
      color: #121212;
    }
    }
    .name {
      display: inline-block;
      min-width: 140px;
    }
    .tel {
      display: inline-block;
      padding-left: 20px;
      margin-left: 16px;
      background: url('../../../assets/phone2.png') no-repeat 0 center;
      background-size: 15px 24px;
    }
    .text-larger .left-span,
    .text-larger .right-span {
      font-size: 30px;
      color: #121212;
    }
    .text-larger .gray {
      color: #999;
    }
    .text-price-total {
      height: 88px;
      line-height: 88px;
    .left-span,
    .right-span {
      height: 88px;
    }
    }
    .abs-tit-box {
      position: relative;
      color: #121212;

      margin: 20px 0;
    .abs-tit {
      position: absolute;
      left: 0;
      top: 0;
      height: 30px;
      color: #121212;
    }
    .right-text {
      height: 30px;
      color: #121212;
      text-align: right;
    }
    .special-tips {
      margin-left: 180px;
      padding-left: 0;
      height: auto;
      text-align: left;
      color: #121212;
    }
    .right-text span {
      display: inline-block;
    }
    .right-text em {
      height: 30px;
      color: #121212;
    }
    }
  }
  .rule-box {
    padding: 35px 20px;

    background: #fff;
  }
  .rule-box-item {
    width: 100%;
    height: auto;

    display: flex;

    .rule-img {
      width: 80px;
      height: 80px;
      margin-right: 30px;

      border-radius: 50%;
      background: #ccc;

      overflow: hidden;
    }
    .authority-img {
      background: url("../../../assets/rent/authority.png") no-repeat center center;
      background-size: 80px 80px;
    }
    .notice-img {
      background: url("../../../assets/rent/notice.png") no-repeat center center;
      background-size: 80px 80px;
    }
    .tip-img {
      background: url("../../../assets/rent/tip.png") no-repeat center center;
      background-size: 80px 80px;
    }
    .rule-text {
      flex: 1;
      height: auto;

      .rule-title-1 {
        font-size: 28px;
        color: #121212;
      }
      .rule-title-2 {
        font-size: 24px;
        color: #4c4c4c;
        margin-top: 24px;

      }
      .rule-title-3 {
        font-size: 20px;
        line-height: 30px;
        color: #888;
        margin-top: 8px;

      }
    }
  }

  .wd100 {
    width: 100px !important;
  }
  .mar-t-64 {
    margin-top: 64px;
  }
  .mar-b-100 {

  }
  .display-block {
    display: block !important;
  }
  .pad-t-20 {
    padding-top: 20px !important;
  }
  .pad-b-0 {
    padding-bottom: 0 !important;
  }
  .hei-100 {
    height: 100px;
    overflow: hidden;
  }

</style>
