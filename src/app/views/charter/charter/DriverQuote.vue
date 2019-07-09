<template>
  <div>
    <c-header :title="title"></c-header>
    <div class="app-container">
      <div class="app-main">
        <div class="ch-container">
          <div class="success-nav">
            <div class="a-address">
              <p v-text="enquiryData.aAddress.detailAddress"></p>
            </div>
            <div class="sus-line" v-show="enquiryData.type==0">
              <span class="am">{{ enquiryData.startupTime | formatDate('date') }}</span>
              <span class="pm">{{ enquiryData.returnTime | formatDate('date') }}</span>
              <p class="suc-bd border-top">
                <i class="com-jt right"></i>
              </p>
              <p class="suc-bd border-bot">
                <i class="com-jt left"></i>
              </p>
            </div>
            <div class="sus-line" v-show="enquiryData.type==1 || enquiryData.type==3">
              <span class="am">{{ enquiryData.startupTime | formatDate('date') }}</span>
              <p class="suc-bd">
                <i class="com-jt right"></i>
              </p>
            </div>
            <div class="b-address">
              <p v-text="enquiryData.bAddress.detailAddress"></p>
            </div>
          </div>
          <div class="clocker-box">
            <p v-html="clocker.timeText"></p>
            <div class="counter-time">
              <clocker :time="clocker.time" slot="value" @on-finish="finish">
                <span class="day">%_H1</span>
                <span class="day">%_H2</span>
                <span class="split-tag">:</span>
                <span class="day">%_M1</span>
                <span class="day">%_M2</span>
                <span class="split-tag">:</span>
                <span class="day">%_S1</span>
                <span class="day">%_S2</span>
              </clocker>
            </div>
          </div>

          <!--司机报价-->
          <div class="driver-nav line line-x-t line-x-b"
               v-show="clocker.timeStatus && quoteData.length > 0">
            <div class="nav-box clearfix">
              <div class="nav-item" :class="seatsClass" @click="serachQuote('seats', 'sortTypeSeat', 'sortTypePrice')">
                <div class="choose-name">座位 <i class="icon-b-jt"></i></div>
              </div>
              <div class="nav-item" :class="priceClass" @click="serachQuote('price', 'sortTypePrice', 'sortTypeSeat')">
                <div class="choose-name">价格 <i class="icon-b-jt"></i></div>
              </div>
            </div>
          </div>
          <div class="driver-box clearfix"
               v-show="clocker.timeStatus && quoteData.length > 0">
            <div class="der-item line line-box radius-box"
                 @click="checkDriver(quote.id)"
                 v-for="quote in quoteData">
              <div class="photo">
                <div class="driver-avator"
                     @click.stop="goDriverDetail(quote.driverId)"
                     :style="quote.avatar ? {backgroundImage:'url(\'' + quote.avatar + '\')'} : ''"></div>
              </div>
              <div class="der-info">
                <p>
                  <span class="name" v-text="quote.firstName + '师傅'">李师傅</span>
                  <span class="star-small-box" v-html="starHtml(quote.star)"></span>
                </p>
                <p v-text="quote.firmName">巴运集团</p>
                <p>
                  <span v-text="quote.driveAge + '年'">3年</span>&nbsp;&nbsp;
                  <span v-if="quote.seats" v-text="quote.seats + '座'">38座</span>&nbsp;&nbsp;
                  <span v-if="quote.carBrand" v-text="quote.carBrand">沃尔沃</span></p>
              </div>
              <div class="der-price">
                <p class="prc-top">
                  <span class="large" v-text="quote.price">300</span>
                  <span class="small">元/天</span>
                </p>
                <p class="prc-bot">{{quote.createdTime | customTime}}报价</p>
              </div>
              <input class="hide" type="checkbox" v-model="quotes" :value="quote.id">
              <i class="choose-icon"></i>
            </div>
          </div>

          <!--司机报价支付-->
          <div class="detail-footer" v-show="clocker.timeStatus && quoteData.length > 0">
            <div class="apply-left" @click="showDriverPriceDetail = !showDriverPriceDetail">
              <label>共计</label>
              <span v-text="'¥' + totalPrice.price"></span>
              <span class="detail" v-show="totalPrice.price">详情</span>
              <i class="yellow-jt-up" v-show="totalPrice.price"></i>
            </div>
            <div class="apply-right">
              <input type="button" @click="createCustomerCharter" class="button button-primary button-no-radius" value="确认订单"/>
            </div>
          </div>
          <div class="price-detail" v-show="totalPrice.price && showDriverPriceDetail">
            <div class="price-mask" @click="showDriverPriceDetail = false"></div>
            <div class="price-detail-box">
              <p>
                <span class="price-d-tit">车辆品牌</span>
                <span v-text="totalPrice.carBrands?totalPrice.carBrands:'请选择车辆'"></span>
              </p>
              <p>
                <span class="price-d-tit">使用天数</span>
                <span v-text="travelDays + '天'"></span>
              </p>
              <p>
                <span class="price-d-tit">车辆费用</span>
                <span v-text="totalPrice.carPrice?totalPrice.carPrice:'请选择车辆'"></span>
              </p>
              <p>
                <span class="price-d-tit">用车数量</span>
                <span v-text="quotes.length + '辆'"></span>
              </p>
              <p v-if="commissionPrice > 0">
                <span class="price-d-tit">服务费用</span>
                <span v-text="commissionPrice + '元'"></span>
              </p>
              <p v-if="!enquiryData.supplySleep">
                <span class="price-d-tit">住宿补贴</span>
                <span v-text="enquiryData.subsidizedAccommodation + '元'"></span>
              </p>
              <p v-if="!enquiryData.supplyFood">
                <span class="price-d-tit">餐饮补贴</span>
                <span v-text="enquiryData.subsidizedFood + '元'"></span>
              </p>
              <p v-if="invoicePrice > 0">
                <span class="price-d-tit">发票费用</span>
                <span v-text="invoicePrice + '元'"></span>
              </p>
              <p v-if="enquiryData.serviceFee > 0">
                <span class="price-d-tit">服务费用</span>
                <span v-text="enquiryData.serviceFee + '元'"></span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import CHeader from 'components/c-header/index.vue'
  import { Clocker } from 'vux'

  export default {
    components: {
      CHeader,
      Clocker
    },
    data () {
      return {
        title: this.$route.meta.title,
        commissionPrice: 0,//服务费用
        invoicePrice: 0,//发票费用

        seatsClass: '',
        sortTypeSeat: 2, //座位升降序
        priceClass: '',
        sortTypePrice: 2, //价格升降序

        enqueryId: '', //询价id
        travelDays: '', //包车天数

        quotes: [],  //司机报价id列表
        quoteData: [],  //报价信息

        enquiryData: {
          aAddress:{},
          bAddress:{},
        }, //询价信息
        showDriverPriceDetail: false,  //司机报价价格详情

        clocker: {
          timeText: '距离报价结束还有',
          time: TOOL.newGetDate({date: new Date(), type: 'future'}),
          timeStatus: true
        },
        customerCharterOrderDTO: {
          formId: TOOL.getTimeStamp(), //防重复提交字段
          productTypeLevelOne: '',//产品类别
          enqueryId: '',//询价id
          productId: '',//产品id
        },
        disableBtn: false
      }
    },
    computed: {
      //司机报价价格计算
      totalPrice () {
        let price = 0,
          carBrands = [],
          carPrice = [];
        //选择了司机
        if (this.quotes.length > 0) {
          for (let d = 0; d < this.quotes.length; d++) {
            for (let q = 0; q < this.quoteData.length; q++) {
              if (this.quotes[d] == this.quoteData[q].id) {
                price += this.quoteData[q].price
                carBrands.push(this.quoteData[q].carBrand)
                carPrice.push('¥' + this.quoteData[q].price + '元/天')
              }
            }
          }
          price = price * parseInt(this.travelDays) + (this.detailData.serviceFee || 0)

          //住宿费
          if (!this.enquiryData.supplySleep) {
            price = price + this.enquiryData.subsidizedAccommodation
          }

          //发票费
          if (!this.enquiryData.supplyFood) {
            price = price + this.enquiryData.subsidizedFood
          }

          //计算服务费和发票费
          let commissionPrice = price * this.enquiryData.commissionRate / 100
          let invoicePrice = price * this.enquiryData.invoiceRate / 100

          this.commissionPrice = commissionPrice.toFixed(2)
          this.invoicePrice = invoicePrice.toFixed(2)
          price = (price + commissionPrice + invoicePrice).toFixed(2)

        } else {
          this.commissionPrice = 0
          this.invoicePrice = 0
        }
        return {
          price: price,
          carBrands: carBrands.join('、'),
          carPrice: carPrice.join('、')
        }
      },
    },
    mounted () {
      this.enqueryId = this.$route.query.enqueryId
      this.enquiryFindById()
      this.quoteFind({enquiryId: this.enqueryId})
    },
    methods: {
        starHtml (star) {
          return TOOL.renderStar(star)
        },
      /**
       * 定制包车询价查询
       */
      enquiryFindById () {
        api.enquiryFindById(this.enqueryId).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode == '0') {
            this.enquiryData = result.resultData

            this.clocker.time = result.resultData.enquiryInvalidTime
            this.travelDays = result.resultData.travelDays

            this.customerCharterOrderDTO.productTypeLevelOne = result.resultData.productTypeLevelOne
            this.customerCharterOrderDTO.productId = result.resultData.productId
            this.customerCharterOrderDTO.enqueryId = result.resultData.id

            //统计产品详情页面pvuv
            TOOL.saveVisitLogs({
              url: this.$route.name,
              productId: result.resultData.productId,
              productTypeLevelOne: result.resultData.productTypeLevelOne
            })

          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

      /**
       * 查询询价报价列表
       */
      quoteFind (search) {
        api.quoteFind(search).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode == '0') {
            this.quoteData = result.resultData.content
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

      /**
       * 跳转司机详情页面
       */
      goDriverDetail (driverId) {
        this.$router.push({name: 'driver', query: {id: driverId}})
      },

      /**
       * 选择司机报价
       */
      checkDriver (quoteId) {
        if ($.inArray(quoteId, this.quotes) > -1) {
          let index = this.quotes.indexOf(quoteId)
          this.quotes.splice(index, 1)
        } else {
          this.quotes.push(quoteId)
        }
      },

      /**
       * 排序
       */
      serachQuote (sortName, sortType1, sortType2) {
        let search = {};
        search.enquiryId = this.enqueryId
        search.sortName = sortName
        if (this[sortType1] === 0) {
          this[sortType1] = 1
          this[sortName + 'Class'] = 'active-down'
        } else {
          this[sortType1] = 0
          this[sortName + 'Class'] = 'active-up'
        }
        this[sortType2] = ''

        if (sortName == 'seats') {
          this.priceClass = ''
        } else {
          this.seatsClass = ''
        }
        search.sortType = this[sortType1]
        this.quoteFind(search)
      },

      /**
       * 报价结束
       */
      finish () {
        this.clocker.timeText = '<span>报价时间已结束</span>'
        this.clocker.timeStatus = false
        this.$router.replace({
          name: 'charterFail',
          query: {
            enqueryId: this.enqueryId
          }
        })
      },


      /**
       * 司机报价
       */
      createCustomerCharter () {
        if (!appStorage.get('X-Auth-Token')) {
          this.$store.dispatch('showError', TOOL.notLoginText)
          store.dispatch('UPDATE_SHOWLOGIN', true)
          return;
        }

        if (this.quotes.length == 0) {
          this.$store.dispatch('showError', '至少选择一辆车');
          return false;
        }
        this.customerCharterOrderDTO.quotes = this.quotes

        this.disableBtn = true
        this.$store.commit('UPDATE_LOADING', true)
        api.createCustomerCharter(this.customerCharterOrderDTO).then(res => {
          const result = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (result.resultCode == '0') {
            this.$router.push({
              name: 'orderDetail',
              query: {
                orderId: result.resultData
              }
            })
          } else {
            this.disableBtn = false
            this.customerCharterOrderDTO.formId = TOOL.getTimeStamp()
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../styles/theme.less";
  .detail-footer {
    width:100%;
    position: relative;
    margin-top: 200px;
    float: left;
    display: flex;
    height:90px;
    overflow:hidden;
    input{
      height:100%;
    }
  }
</style>
