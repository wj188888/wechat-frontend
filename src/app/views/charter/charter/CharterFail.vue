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
            <div class="sus-line" v-show="enquiryData.type == 0">
              <span class="am">{{ enquiryData.startupTime | formatDate('date') }}</span>
              <span class="pm">{{ enquiryData.returnTime | formatDate('date') }}</span>
              <p class="suc-bd border-top">
                <i class="com-jt right"></i>
              </p>
              <p class="suc-bd border-bot">
                <i class="com-jt left"></i>
              </p>
            </div>
            <div class="sus-line" v-show="enquiryData.type == 1">
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
              <clocker :time="clocker.time" slot="value">
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

          <!--报价失败-->
          <div class="driver-box sus-container clearfix">
            <div class="con-icon fail-mg">
              <div class="sus-right"></div>
            </div>
            <div class="con-info">
              <p class="fail-p">抱歉，暂无任何{{this.enquiryData.notifyType == 1 ? '司机' : '企业'}}报价</p>
            </div>
          </div>

          <!--再次提交-->
          <div class="sus-container">
            <input type="button" class="button fail-but" value="再次提交" v-show="isReBtnShow" @click="enquiryReEdit"/>
            <input type="button" class="button button-primary" value="重新编辑" @click="editCharter"/>
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
        enquiryData: {
          aAddress:{},
          bAddress:{},
        }, //询价信息
        minTime:'',
        maxTime:'',
        isReBtnShow: false,
        charterPayTimer:'',
        clocker:{
          timeText:'报价时间已结束',
          time: TOOL.newGetDate({date: new Date(), type:'holeDate2'}),
          timeStatus: false
        }
      }
    },
    mounted () {
      this.enqueryId = this.$route.query.enqueryId
      this.enquiryFindById()
    },
    destroyed () {
      if (this.charterPayTimer) {
        clearInterval(this.charterPayTimer)
      }
    },
    methods: {

      /**
       * 定制包车询价查询
       */
      enquiryFindById () {
        api.enquiryFindById(this.enqueryId).then(res => {
          const result = TOOL.toJson(res.data)
          if(result.resultCode == '0'){
            this.enquiryData = result.resultData
            this.enquiryData.formId = TOOL.getTimeStamp()

            //再次提交按钮显示隐藏控制
            let startupTime = Date.parse(TOOL.newGetDate({date: this.enquiryData.startupTime, type: 'formatDate'}))
            let minMinute = 0
            let maxMinute = 0
            let nowMs = new Date().getTime()
            if(this.enquiryData.aAddress.province == this.enquiryData.bAddress.province){
              minMinute = this.enquiryData.innerProvinceCharterPreOrderMinMinute
              maxMinute = this.enquiryData.innerProvinceCharterPreOrderMaxMinute
            }else{
              minMinute = this.enquiryData.crossProvinceCharterPreOrderMinMinute
              maxMinute = this.enquiryData.crossProvinceCharterPreOrderMaxMinute
            }
            minMinute = minMinute + nowMs
            maxMinute = maxMinute + nowMs
            if(startupTime > minMinute && minMinute < maxMinute){
              this.isReBtnShow = true
            }
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

      /**
       *  再次提交询价
       *  needPayDeposit 发起询价时，是否需要支付
       *  depositAmount 发起询价时，支付的定金金额
       */
      enquiryReEdit () {
        let reEnquiryText = '是否要再次提交此包车申请？'
        if(this.enquiryData.needPayDeposit){
          reEnquiryText = '再次提交需支付订金' + this.enquiryData.depositAmount + '元，确认提交吗？'
        }

        this.$store.dispatch('showConfirm', {
          content: reEnquiryText,
          onConfirm: () => {
            this.$store.commit('UPDATE_LOADING', true)
            api.enquiryCreate(this.enquiryData).then(res => {
              const result = TOOL.toJson(res.data)
              if (result.resultCode == '0') {
                let enquiryId = result.resultData.id

                if(this.enquiryData.needPayDeposit){
                  interfaceApi.wxPay({
                    enquiryId: enquiryId,
                    productId: this.enquiryData.productId,
                    productTypeLevelOne: 'CUSTOM_BUS_enquiry',
                    wxPaySuccess: TOOL.wxPaySuccess,
                    wxPayFail: TOOL.wxPayFail,
                    price: this.enquiryData.depositAmount
                  })
                }else{
                  this.$router.replace({
                    name: 'charterSuccess',
                    query: {
                      enqueryId: enquiryId
                    }
                  })
                }

              } else {
                this.$store.commit('UPDATE_LOADING', false)
                this.enquiryData.formId = TOOL.getTimeStamp()
                this.$store.dispatch('showError', result.resultMsg);
              }
            })
          }
        })
      },

      /**
       * 重新编辑
       */
      editCharter () {
        this.$router.replace({
          name: 'applyCharter',
          query: {
            enqueryId: this.enqueryId
          }
        })
      }
    }
  }
</script>
