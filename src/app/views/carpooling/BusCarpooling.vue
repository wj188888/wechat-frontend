<template>
  <main-box :title="title">
    <div class="mar-tb-20 bg-fff radius-box">
      <div class="inline-box">
        <label class="icon-carhailing-start"></label>
        <input type="text" placeholder="您在哪上车" v-model="from" readonly @click="jumpToSetPosition('from')"/>
      </div>
      <div class="inline-box">
        <label class="icon-carhailing-end"></label>
        <input type="text" placeholder="您要去哪里" v-model="to" readonly @click="jumpToSetPosition('to')"/>
      </div>
      <div class="inline-box"
           @click="addressWarning"
           v-show="!this.productId || !from || !to">
        <label class="icon-carhailing-time"></label>
        <input type="text" placeholder="何时出发" readonly/>
      </div>
      <div class="inline-box" v-show="this.productId && from && to">
        <label class="icon-carhailing-time"></label>
        <date-time
          :start-config="startConfig"
          v-model="localData.startTime"
          holder="何时出发"
          @input="setStartTime"
          ref="dateInput"></date-time>
      </div>
      <div class="inline-box" @click="openPeplePicker">
        <label class="icon-passenger-num"></label>
        <span :class="{'active': localData.passengerNum}">
            {{localData.passengerNum ? localData.passengerNum + '人' : '乘车人数'}}
          </span>
      </div>
      <div class="carpooling-tab line line-x-t" v-if="carpoolPriceData.carpoolPrice || carpoolPriceData.charterePrice">
        <div class="split" v-if="carpoolPriceData.carpoolPrice && carpoolPriceData.charterePrice"></div>
        <div class="tab"
             v-if="carpoolPriceData.carpoolPrice"
             :class="{'active': orderData.tripType === 1}" @click="selectTripType(1)">
          <p class="carpooling-price" :class="{'row-1': !carpoolPriceData.carpoolDiscount || !carpoolPriceData.carpoolDiscount.discountAmount}">
            拼车 <em>{{(carpoolPriceData.carpoolPrice - (carpoolPriceData.carpoolDiscount ? carpoolPriceData.carpoolDiscount.discountAmount : 0) + carpoolPriceData.serviceFee).toFixed(2)}}</em> 元
          </p>
          <p class="carpooling-coupon" v-if="carpoolPriceData.carpoolDiscount && carpoolPriceData.carpoolDiscount.discountAmount">
            优惠抵扣 <em>{{ carpoolPriceData.carpoolDiscount.discountAmount }}</em> 元
          </p>
        </div>
    
        <div class="tab"
             v-if="carpoolPriceData.charterePrice"
             :class="{'active': orderData.tripType === 2}" @click="selectTripType(2)">
          <p class="carpooling-price" :class="{'row-1': !carpoolPriceData.charterDiscount || !carpoolPriceData.charterDiscount.discountAmount}">
            包车 <em>{{ (carpoolPriceData.charterePrice - (carpoolPriceData.charterDiscount ? carpoolPriceData.charterDiscount.discountAmount : 0) + carpoolPriceData.serviceFee).toFixed(2)}}</em> 元
          </p>
          <p class="carpooling-coupon" v-if="carpoolPriceData.charterDiscount && carpoolPriceData.charterDiscount.discountAmount">
            优惠抵扣 <em>{{ carpoolPriceData.charterDiscount.discountAmount }}</em> 元
          </p>
        </div>
      </div>
      <div class="change-tel "
           v-if="carpoolPriceData.carpoolPrice || carpoolPriceData.charterePrice"
           @click="showTelDialog = true"><i class="icon-carhailing-phone"></i> {{isSelf ? localData.contactTelephone : '换乘车人'}}
        </div>
    </div>

    <div slot="footer">
      <div class="dialog-demo" v-show="showPriceDialog">
        <div class="company-quote" v-if="orderData.tripType === 1">
          <h1 class="company-quote-tit">费用明细</h1>
          <p class="price-total">
            <em>{{(carpoolPriceData.carpoolPrice - (carpoolPriceData.carpoolDiscount ? carpoolPriceData.carpoolDiscount.discountAmount : 0) + carpoolPriceData.serviceFee) | formatPrice('normal')}}</em>
            <i> 元</i>
          </p>
          <div class="company-quote-table">
            <div class="company-text mar-t-10">
              <p>拼车费用 <span v-if="localData.passengerNum">({{localData.passengerNum}}人)</span></p>
              <p>{{carpoolPriceData.carpoolPrice | formatPrice('normal')}}元</p>
            </div>
            <div class="company-text mar-t-10">
              <p>服务费用</p>
              <p>{{carpoolPriceData.serviceFee | formatPrice('normal')}}元</p>
            </div>
            <div class="company-text mar-t-10" v-if="carpoolPriceData.carpoolDiscount && carpoolPriceData.carpoolDiscount.activityAmount">
              <p>优惠活动抵扣</p>
              <p>- {{carpoolPriceData.carpoolDiscount.activityAmount | formatPrice('normal')}}元</p>
            </div>
            <div class="company-text mar-t-10" v-if="carpoolPriceData.carpoolDiscount && carpoolPriceData.carpoolDiscount.couponAmount">
              <p>优惠券抵扣</p>
              <p>- {{carpoolPriceData.carpoolDiscount.couponAmount | formatPrice('normal')}}元</p>
            </div>
          </div>
        </div>
        <div class="company-quote" v-if="orderData.tripType === 2">
          <h1 class="company-quote-tit">费用明细</h1>
          <p class="price-total">
            <em>{{(carpoolPriceData.charterePrice - (carpoolPriceData.charterDiscount ? carpoolPriceData.charterDiscount.discountAmount : 0) + carpoolPriceData.serviceFee)  | formatPrice('normal')}}</em>
            <i> 元</i>
          </p>
          <div class="company-quote-table">
            <div class="company-text mar-t-10">
              <p>包车费用</p>
              <p>{{carpoolPriceData.charterePrice | formatPrice('normal')}}元</p>
            </div>
            <div class="company-text mar-t-10" v-if="carpoolPriceData.serviceFee">
              <p>服务费用</p>
              <p>{{carpoolPriceData.serviceFee | formatPrice('normal')}}元</p>
            </div>
            <div class="company-text mar-t-10" v-if="carpoolPriceData.charterDiscount && carpoolPriceData.charterDiscount.activityAmount">
              <p>优惠活动抵扣</p>
              <p>- {{carpoolPriceData.charterDiscount.activityAmount | formatPrice('normal')}}元</p>
            </div>
            <div class="company-text mar-t-10" v-if="carpoolPriceData.charterDiscount && carpoolPriceData.charterDiscount.couponAmount">
              <p>优惠券抵扣</p>
              <p>- {{carpoolPriceData.charterDiscount.couponAmount | formatPrice('normal')}}元</p>
            </div>
          </div>
        </div>
        <div class="close-icon" @click="showPriceDialog = false"></div>
      </div>

      <x-dialog :show="showTelDialog" class="tel-dialog">
        <div class="tel-dialog-body line line-x-b">
          <a class="close" @click="showTelDialog = false"></a>
          <p class="tips">
            请输入乘车人联系电话
            <span class="error" v-show="errorPhoneText">{{errorPhoneText}}</span>
          </p>
          <div class="telephone line line-x-b">
            <input type="tel" placeholder="请输入手机号码" maxlength="11" v-model="contactTelephone">
          </div>
          <p class="warning">1、乘车人手机号码将收到系统发送的乘车信息。</p>
          <p class="warning">2、如果没有更换过乘车人，则默认为登录账户的手机号码</p>
        </div>
        <input type="button" value="确定" class="button button-no-radius button-empty-white" @click="setTelephone">
      </x-dialog>
      <div class="abs-bottom-box">
        <div class="buy-right buy-w100">
          <input type="button" class="button button-primary" :disabled="disableBtn" @click="carpoolOrderCreate" value="立即用车" />
        </div>
      </div>
    </div>

  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import DateTime from 'components/dateTime/dateTime'
  import {XDialog} from 'vux'
  import { mapState } from 'vuex'

  import phone from 'mixins/phone'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'

  export default {
    components: {
      MainBox,
      XDialog,
      DateTime,
    },
    mixins: [phone, checkLogin, createOrder, service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,

        productId: '',
        productTypeLevelOne: 'CITY_BUS',
        productTypeLevelTwo: 'CITY_CAR_POOL_BUS',
        product: {},
        peoplePicker: '',
        peoplePickerData: [],
        peoplePickerIndex: '',

        showTelDialog: false,
        errorPhoneText: '',

        from: '',
        to: '',
        contactTelephone: '',
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
        },
        startConfig: TOOL.getDateTimeConfig(),
        orderData: {
          formId: TOOL.getTimeStamp(), //表单ID
          productId : '',
          productTypeLevelOne: 'CITY_BUS',
          contactTelephone: '',
          onStation: '',
          offStation: '',
          passengerNum: 0,
          startTime: '',
          tripType: 1, // 1：拼车 2：包车
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          useActivity: true,
          type:'',
        },
        carpoolPriceData: {
          carpoolDiscount:{},
          charterDiscount:{},
        },
        disableBtn: true,
        showPriceDialog: false
      }
    },
    computed: {
      isSelf () {
        if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          return (this.localData.contactTelephone && usrInfo.phone !== this.localData.contactTelephone)
        }else{
          return false
        }
      }
    },
    watch: {
      localData:{
        handler () {
          this.carpoolOrderCalPrice()
        },
        deep:true
      },
    },
    mounted () {
      this.productId = this.$route.query.productId
      this.orderData.type = parseInt(this.$route.query.lineType)
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.productTypeLevelTwo = this.$route.query.productTypeLevelTwo
      
      if(appStorage.get(this.pageRouter)){
        let localData = JSON.parse(appStorage.get(this.pageRouter))
        this.localData = Object.assign(this.localData, localData)
        
        if(this.localData.from && this.localData.from.detailAddress){
          this.from = this.localData.startPlace + '·' + this.localData.from.name
        }
        if(this.localData.to && this.localData.to.detailAddress){
          this.to = this.localData.endPlace + '·' + this.localData.to.name
        }
        
        if(this.localData.productId){
          this.productId = this.localData.productId
          this.orderData.type = parseInt(this.localData.lineType)
          this.carpoolProductFindDetail()
        }
      }
  
      if (appStorage.get('X-Auth-Token')) {
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        this.localData.contactTelephone = this.localData.contactTelephone || usrInfo.phone
        this.contactTelephone = this.contactTelephone || usrInfo.phone
      }
      TOOL.saveVisitLogs({
        url: this.$route.name,
        productTypeLevelOne: 'CITY_BUS',
        productTypeLevelTwo: 'CITY_CAR_POOL_BUS'
      })
    },
    methods: {
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      jumpToSetPosition (dataKey) {
        this.saveForm()
        this.$router.push({
          name: 'building',
          query:{
            pageRouter: this.pageRouter,
            productTypeLevelOne: this.productTypeLevelOne,
            productTypeLevelTwo: this.productTypeLevelTwo,
            productId: this.productId,
            dataKey: dataKey,
            lineType: this.orderData.type,
            pageActive: false
          }
        })
      },

      carpoolProductFindDetail () {
        this.$store.commit('UPDATE_LOADING', true)
        api.carpoolProductFindDetail(this.productId, this.productTypeLevelOne).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.product = data.resultData
            for (let i = 1; i <= this.product.seat; i++ ){
              this.peoplePickerData.push({
                text: i + '人',
                value: i
              })
              this.peoplePickerIndex = [0]
            }
            this.peoplePicker = new Picker({
              data: [
                this.peoplePickerData
              ],
              selectedIndex: this.peoplePickerIndex,
              title: '乘车人数'
            });

            this.peoplePicker.on('picker.select', (selectedVal, selectedIndex) => {
              this.localData.passengerNum = selectedVal[0]
            })
            
            this.startConfig = TOOL.getDateTimeConfig(
              this.product.preOrderStartMinute,
              this.product.preOrderEndMinute,
              this.product.responseStartTime,
              this.product.responseEndTime,
              '出发时间')
           
            if(this.from && this.to && !this.localData.startTime){
              this.$nextTick(()=>{
                if(this.$refs.dateInput){
                  this.$refs.dateInput.showDateTimePicker()
                }
              })
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
  
      getStartTime (config) {
        let startDate = TOOL.newGetDate({date: config.min, type:'date'})
        let startTime = TOOL.newGetDate({date: config.min, type:'time'})
        if(config.start && config.end){
          let compare = this.dateCompare(config.start, config.end, 'time')
          if(compare > 0) {
            let compareStart = this.dateCompare(config.end, startTime, 'time')
            let compareEnd = this.dateCompare(config.start, startTime, 'time')
            if(compareStart <= 0 && compareEnd >= 0){
              startTime = '00:00'
            }
          }else{
            let compareStart = this.dateCompare(config.start, startTime, 'time')
            let compareEnd = this.dateCompare(config.end, startTime, 'time')
            if(compareStart >= 0){
              startTime = config.start
            }
            if(compareEnd <= 0){
              startTime = config.start
              startDate = TOOL.changeDate(startDate, 'd', 1)
              startDate = TOOL.newGetDate({date: startDate, type:'date'})
            }
          }
        }
        return startDate + ' ' + startTime
      },
  
      setStartTime (value) {
        this.localData.startTime = value
        if(!this.localData.passengerNum){
          this.openPeplePicker()
        }
      },
      
      openPeplePicker () {
        if(this.peoplePicker){
          this.peoplePicker.show()
        }else {
          this.addressWarning()
        }
      },

      addressWarning () {
        if(!this.from){
          this.$store.dispatch('showError', '请选择您在哪上车');
          return
        }

        if(!this.to){
          this.$store.dispatch('showError', '请选择您要去哪里');
          return
        }

        if(!this.localData.startTime){
          this.$store.dispatch('showError', '请选择何时出发');
        }
      },

      setTelephone () {
        let validata = TOOL.formValidate([
          {value: this.contactTelephone, emptyTips: '手机号码不能为空', regName: 'telephone',regTips: '手机号码格式不正确'},
        ]);

        if (!validata.valid) {
          this.errorPhoneText = validata.msg
          return false;
        }else{
          this.errorPhoneText = ''
        }
        this.localData.contactTelephone = this.contactTelephone
        this.showTelDialog = false
      },



      tanspoint () {
        let fromPoint = TOOL.tencentToBaidu({
          lat: this.localData.from.lat,
          lng: this.localData.from.lng,
        })
        let toPoint = TOOL.tencentToBaidu({
          lat: this.localData.to.lat,
          lng: this.localData.to.lng,
        })
        return {
          fromPoint,
          toPoint
        }
      },

      carpoolOrderCalPrice () {
        let validata = TOOL.formValidate([
          {value: this.localData.from.lat, emptyTips: '出发地不能为空'},
          {value: this.localData.from.detailAddress, emptyTips: '出发地不能为空'},
          {value: this.localData.to.lat, emptyTips: '目的地不能为空'},
          {value: this.localData.to.detailAddress, emptyTips: '目的地不能为空'},
          {value: this.localData.startTime, emptyTips: '出发时间不能为空'},
          {value: this.localData.passengerNum, emptyTips: '出行人数不能为空'},

        ]);
        if (!validata.valid || this.localData.passengerNum === 0) {
          return false;
        }

        this.$store.commit('UPDATE_LOADING', true)
        let fromPoint = this.tanspoint().fromPoint
        let toPoint = this.tanspoint().toPoint

        api.carpoolOrderCalPrice({
          productId: this.productId,
          productTypeLevelOne: this.productTypeLevelOne,
          onSiteId: this.localData.from.siteId,
          aCounty: this.localData.from.county,
          aLongitude: fromPoint.lng,
          aLatitude: fromPoint.lat,
          offSiteId: this.localData.to.siteId,
          bCounty: this.localData.to.county,
          bLongitude: toPoint.lng,
          bLatitude: toPoint.lat,
          passengerNum: this.localData.passengerNum,
          startTime: TOOL.newGetDate({date: this.localData.startTime, type: 'holeDate'}),
          type: this.orderData.type
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.carpoolPriceData = data.resultData
            this.disableBtn = false
            if(!this.carpoolPriceData.carpoolPrice){
              this.orderData.tripType = 2
              if(this.carpoolPriceData.charterDiscount){
                this.orderData.discountInfo.userCouponId = this.carpoolPriceData.charterDiscount.userCouponId
                this.orderData.discountInfo.activityId = this.carpoolPriceData.charterDiscount.activityId
              }
            }else{
              this.orderData.tripType = 1
              if(this.carpoolPriceData.carpoolDiscount){
                this.orderData.discountInfo.userCouponId = this.carpoolPriceData.carpoolDiscount.userCouponId
                this.orderData.discountInfo.activityId = this.carpoolPriceData.carpoolDiscount.activityId
              }
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      selectTripType (tripType) {
         if(tripType === 1){
           if(this.carpoolPriceData.carpoolDiscount){
             this.orderData.discountInfo.userCouponId = this.carpoolPriceData.carpoolDiscount.userCouponId
             this.orderData.discountInfo.activityId = this.carpoolPriceData.carpoolDiscount.activityId
           }
         }else{
           if(this.carpoolPriceData.charterDiscount){
             this.orderData.discountInfo.userCouponId = this.carpoolPriceData.charterDiscount.userCouponId
             this.orderData.discountInfo.activityId = this.carpoolPriceData.charterDiscount.activityId
           }
         }
         if(this.orderData.tripType !== tripType){
           this.orderData.tripType = tripType
         }else{
            this.showPriceDialog = true
         }
      },

      carpoolOrderCreate () {
        let fromPoint = this.tanspoint().fromPoint
        let toPoint = this.tanspoint().toPoint

        this.orderData.productId = this.productId
        this.orderData.productTypeLevelOne = this.productTypeLevelOne
        this.orderData.contactTelephone = this.localData.contactTelephone
        this.orderData.onStation = {
          longitude: fromPoint.lng,
          latitude: fromPoint.lat,
          name: this.localData.from.name,
          county: this.localData.from.county,
          detailAddress: this.localData.from.detailAddress,
          siteId: this.localData.from.siteId
        }
        this.orderData.offStation = {
          longitude: toPoint.lng,
          latitude: toPoint.lat,
          name: this.localData.to.name,
          county: this.localData.to.county,
          detailAddress: this.localData.to.detailAddress,
          siteId: this.localData.to.siteId
        }

        this.orderData.startTime = TOOL.newGetDate({date: this.localData.startTime, type: 'holeDate'})
        this.orderData.passengerNum = this.localData.passengerNum

        this.disableBtn = true
        if (!appStorage.get('X-Auth-Token')) {
          this.disableBtn = false
          this.saveOrder(this.pageRouter, this.orderData)
          return;
        }
        this.orderCreated(this.pageRouter)

      }

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .inline-box {
    border-top:1PX solid #f2f2f2;
    label{
      width:86px;
      background:no-repeat 10px center;
      background-size:30px 30px;
    }
    .icon-carhailing-start{
      background-image:url("../../../assets/order_start.png")
    }
    .icon-carhailing-end{
      background-image:url("../../../assets/order_end.png")
    }
    .icon-carhailing-time{
      background-image:url("../../../assets/order_time.png")
    }
    .icon-passenger-num{
      background-image:url("../../../assets/seats.png");
      background-size: 30px 30px;
      background-position: 14px center;
    }
    span{
      color: #999;
      &.active{
        color: #121212;
      }
    }
  }
  .inline-flex{
    position: relative;
    display:flex;
    .split{
      position: absolute;
      left:50%;
      top:50%;
      margin-top:-20px;
      width: 1PX;
      height: 40px;
      background-color: @bg-e0e0e0;
      z-index:2;
    }
    .inline-box{
      flex: 1;
      label{
        width:60px;
      }
    }
    .icon-carhailing-time{
      background-image:url("../../../assets/order_time.png")
    }
    .icon-passenger-num{
      flex: 1;
      margin-right:20px;
      background-image:url("../../../assets/seats.png");
      background-size: 30px 30px;
      background-position: right center;
    }
    .flex-2{
      flex:2;
    }
  }
  .carpooling-tab{
    position: relative;
    display: flex;
    .split{
      position: absolute;
      left:50%;
      top:50%;
      margin-top:-30px;
      width: 1px;
      height: 60px;
      background-color: @bg-e0e0e0;
    }
    .tab{
      flex:1;
      height:140px;
      text-align:center;
      color:@fc-888;
      &.active{
        .carpooling-price{
          color:@fc-ff6600;
        }
        em{
          color:@fc-ff6600;
        }
      }
    }
    .carpooling-price{
      padding:30px 0 20px;
      font-size:28px;
      &.row-1{
        position: relative;
        top: 24px;
      }
      em{
        font-size: 40px;
        color:@fc-888;
      }
    }
    .carpooling-coupon{
      margin-bottom:42px;
      font-size:22px;
      em{
        color: @fc-888;
      }
    }
  }
  .change-tel{
    height:80px;
    line-height:80px;
    text-align: center;
    font-size:24px;
    color: @fc-888;
    &.active{
      color:@fc-4c4c4c;
    }
    .icon-carhailing-phone{
      display: inline-block;
      width:30px;
      height:30px;
      background:url("../../../assets/order_me.png") no-repeat 0 top;
      background-size: 20px 20px;
      vertical-align: middle;
    }
  }
  .tel-dialog-body {
    text-align:center;
    padding:84px 0 52px;
    .close{
      position: absolute;
      top:20px;
      right:20px;
      width:50px;
      height:50px;
      background:url("../../../assets/close-dialog.png") no-repeat right top;
      background-size:30px 30px;
    }
    .tips{
      position: relative;
      margin-bottom:76px;
      font-size:32px;
      color:#4c4c4c;
      .error{
        position: absolute;
        top:40px;
        left:0;
        width: 100%;
        font-size:20px;
        color:#e4475c;
      }
    }
    .telephone{
      width:420px;
      margin:0 auto;
      input{
        padding:14px 10px;
        font-size:28px;
        text-align: center;
      }
    }
    .warning{
      padding:0 30px;
      margin-top:20px;
      font-size:22px;
      text-align:left;
      color:#888;
    }
  }
  .dialog-demo {
    position: fixed;
    top:0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 1000;
  }

  .close-icon {
    position: fixed;
    bottom: 30px;
    left: 50%;
    width: 95px;
    height: 95px;
    background: url("../../../assets/charter/close.png") no-repeat;
    background-size: 91px 91px;
    margin-left: -45px;
    z-index: 2000;
  }

  .company-quote {
    padding: 20px 30px;
    overflow: hidden;
    margin-top: 150px;
  }

  .company-quote-tit {
    display: block;
    height: 96px;
    line-height: 96px;
    text-align: center;
    color: #888;
    font-size: 36px;
  }

  .price-total{
    margin:80px 0 130px;
    text-align: center;
    font-size:70px;
    color:#4c4c4c;
    i{
      position: relative;
      top:-2px;
      font-size: 36px;
    }
  }

  .company-quote-table {
    padding: 0 40px;
    font-size: 28px;
    color: #4C4C4C;
  }

  .company-text {
    font-size:28px;
    color:#888;
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
</style>
