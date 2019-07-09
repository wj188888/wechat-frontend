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

          <div class="driver-box clearfix" v-show="quoteData.length > 0">
            <div class="der-item line line-box radius-box" v-for="quote in quoteData">
              <div class="photo">
                <div class="driver-avator"
                     @click.stop="goDriverDetail(quote.driverId)"
                     :style="quote.avatar ? {backgroundImage:'url(\'' + quote.avatar + '\')'} : ''"></div>
              </div>
              <div class="der-info">
                <p>
                  <span class="name" v-text="quote.firstName + '师傅'">李师傅</span>
                  <span class="star-small-box" v-html="renderStar(quote.star)"></span>
                </p>
                <p v-text="quote.firmName">巴运集团</p>
                <p>
                  <span v-text="quote.driveAge + '年'">3年</span>&nbsp;&nbsp;
                  <span v-if="quote.seats" v-text="quote.seats + '座'">38座</span>&nbsp;&nbsp;
                  <span v-if="quote.carBrand" v-text="quote.carBrand">沃尔沃</span>
                </p>
              </div>
              <div class="der-price">
                <p class="prc-top">
                  <span class="large" v-text="quote.price">300</span>
                  <span class="small">元/天</span>
                </p>
                <p class="prc-bot">{{quote.createdTime | customTime}}报价</p>
              </div>
              <input class="hide" type="checkbox" checked>
              <i class="choose-icon"></i>
            </div>
          </div>

          <div class="abs-bottom-box">
            <div class="buy-right buy-w100">
              <a class="button button-primary" @click="jumpToOrderDetail">查看订单详情</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import CHeader from 'components/c-header/index.vue'

  export default {
    components: {
      CHeader,
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
          price = price * parseInt(this.travelDays)

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
      this.quoteFindDealQuote()
    },
    methods: {
      renderStar (star) {
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

            this.travelDays = result.resultData.travelDays

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
      quoteFindDealQuote () {
        api.quoteFindDealQuote({enquiryId: this.enqueryId}).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode == '0') {
            this.quoteData = result.resultData
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
       * 跳转订单详情
       * 0报价中, 1已报价, 2已收款, 3已失效, 4已取消, 5已服务, 6已安排
       */
      jumpToOrderDetail () {
        this.$router.push({
          name: 'orderDetail',
          query:{
            orderId: this.enquiryData.orderId
          }
        })
      }
    }
  }
</script>
