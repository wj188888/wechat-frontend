<template>
  <div>
    <c-header :title="title"></c-header>
    <div class="app-container">
      <div class="app-main">
        <div class="ch-container scrollingBox has-abs-bottom">
          <div class="success-nav">
            <div class="a-address">
              <p v-text="enquiryData.aAddress.detailAddress"></p>
            </div>
            <div class="sus-line" v-show="enquiryData.type==1 || enquiryData.type==3">
              <span class="am">{{ enquiryData.startupTime | formatDate('date') }}</span>
              <p class="suc-bd">
                <i class="com-jt right"></i>
              </p>
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
          <div class="company-quote">
            <h1 class="company-quote-tit">报价</h1>
            <div class="company-quote-table line line-x">
              <table>
                <tr>
                  <td class="text-left">品牌名</td>
                  <td>座位数</td>
                  <td>车辆数</td>
                  <td class="text-right">价格</td>
                </tr>
                <tr v-for="dataList in quoteData.dataList">
                  <td class="text-left" v-text="dataList.carBrand">别克</td>
                  <td v-text="dataList.seats">7座</td>
                  <td v-text="dataList.carNum">1辆</td>
                  <td class="text-right">{{dataList.charterPrice}}{{quoteData.type == 1 ? '元':'元/天'}}</td>
                </tr>
              </table>
              <div class="company-text mar-t-10">
                <p>使用天数</p>
                <p v-if="quoteData.type == 1">{{enquiryData.travelDays}}天</p>
                <p v-else>&times;{{enquiryData.travelDays}}</p>
              </div>
              <div class="company-text mar-t-10" v-if="quoteData.invoicePrice > 0">
                <p>发票费用</p>
                <p>{{ quoteData.invoicePrice | formatPrice }}</p>
              </div>
              <div class="company-text mar-t-10" v-if="quoteData.subsidizedFood > 0">
                <p>餐饮补贴</p>
                <p>{{ quoteData.subsidizedFood | formatPrice }}</p>
              </div>
              <div class="company-text mar-t-10" v-if="quoteData.subsidizedAccommodation > 0">
                <p>住宿补贴</p>
                <p>{{ quoteData.subsidizedAccommodation | formatPrice }}</p>
              </div>
              <div class="company-text mar-t-10" v-if="quoteData.serviceFee > 0">
                <p>服务费用</p>
                <p>{{ quoteData.serviceFee | formatPrice }}</p>
              </div>
            </div>
            <div class="quote-total-price">
              <p class="pull-left">合计</p>
              <p class="pull-right">{{ quoteData.totalPrice | formatPrice }}</p>
            </div>
          </div>
          <div class="abs-bottom-box">
            <div class="buy-right buy-w100">
              <a class="button button-primary" @click="jumpToCompanyQuoteOrder">马上去下单</a>
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
        enqueryId: '', //询价id
        quoteData: [],  //报价信息
        enquiryData: {
          aAddress:{},
          bAddress:{},
        }, //询价信息
        clocker: {
          timeText: '距离报价结束还有',
          time: TOOL.newGetDate({date: new Date(), type: 'future'}),
          timeStatus: true
        }
      }
    },
    mounted () {
      this.enqueryId = this.$route.query.enqueryId
      this.enquiryFindById()
      this.quoteFind()
    },
    methods: {
      /**
       * 定制包车询价查询
       */
      enquiryFindById () {
        api.enquiryFindById(this.enqueryId).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode == '0') {
            this.enquiryData = result.resultData
            this.clocker.time = result.resultData.enquiryInvalidTime

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
      quoteFind () {
        api.quoteFind({
          enquiryId: this.enqueryId
        }).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode == '0') {
            if(result.resultData.content.length){
              this.quoteData = result.resultData.content[0]
            }else{
              this.$router.replace({
                name: 'charterFail',
                query: {
                  enqueryId: this.enqueryId
                }
              })
            }
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
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
       * 跳转下单页面
       */
      jumpToCompanyQuoteOrder () {
        this.$router.push({
          name: 'companyQuoteOrder',
          query: {
            enqueryId: this.enqueryId,
            firmQuoteId: this.quoteData.id
          }
        })
      }
    }
  }
</script>
<style scoped>
  .company-quote {
    margin: 40px 20px 0;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    background-color: #fff;
    overflow: hidden;
  }

  .company-quote-tit {
    display: block;
    height: 96px;
    line-height: 96px;
    text-align: center;
    color: #4C4C4C;
    background-color: #fff;
    font-size: 36px;
  }

  .company-quote-table {
    padding: 0 40px;
    font-size: 28px;
    color: #4C4C4C;
  }

  .company-quote-table table {
    width: 100%;
  }

  .company-quote-table td {
    line-height: 50px;
    text-align: center;
  }

  .company-quote-table td.text-left {
    text-align: left;
  }

  .company-quote-table td.text-right {
    text-align: right;
  }

  .company-text {
    line-height: 50px;
    overflow: hidden;
  }

  .company-text p {
    float: left;
  }

  .company-text p:last-child {
    float: right;
  }

  .company-text.mar-t-10 {
    margin-top: 10px;
  }

  .quote-total-price {
    padding:0 40px;
    height:68px;
    line-height:68px;
    font-size:32px;
    color:#ff6600;
  }

</style>
