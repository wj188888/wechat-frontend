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

          <!--提交成功-->
          <div class="sus-container" v-show="clocker.timeStatus">
            <div class="con-icon">
              <div class="sus-right">
                <img src="../../../../assets/gou.png">
              </div>
            </div>
            <div class="con-info">
              <p>您的信息我们已经收到</p>
              <p>我们将尽快为您报价，请耐心等待</p>
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
        enquiryData: {
          aAddress:{},
          bAddress:{},
        }, //询价信息
        enqueryTimer: '',
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
    },
    destroyed () {
      if (this.enqueryTimer) {
        clearInterval(this.enqueryTimer)
      }
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
            this.enquiryCheckIsQuote()
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

      /**
       * 轮询是否有报价
       */
      enquiryCheckIsQuote () {
        this.enqueryTimer = setInterval(()=> {
          api.enquiryCheckIsQuote(this.enqueryId).then(res => {
            const result = TOOL.toJson(res.data)
            if (result.resultCode == '0') {
              if (result.resultData) {
                clearInterval(this.enqueryTimer)
                let pageRouter = 'companyQuote'
                if (this.enquiryData.notifyType == 1) {
                  pageRouter = 'driverQuote'
                }
                this.$router.replace({
                  name: pageRouter,
                  query: {
                    enqueryId: this.enqueryId
                  }
                })
              }
            } else {
              this.$store.dispatch('showError', data.resultMsg)
            }
          })
        }, 1500);
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
      }
    }
  }
</script>
