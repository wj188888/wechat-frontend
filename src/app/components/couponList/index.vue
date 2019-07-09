<template>
  <div class="coupon-box" v-if="datas">
    <ul class="coupon-list">
      <li class="coupon-item line line-box radius-box" :class="{'no-use': data.status === 2 || data.status === 1 || data.takeOrUseStatus === 2}" v-for="data in datas">
        <div class="circle left-circle"></div>
        <div class="circle right-circle"></div>
        <div class="coupon-info">
          <div class="coupon-price-box">
            <p class="coupon-price">
              ¥ <em v-if="data.amountType === 1 ">{{data.minAmount + ' ~ ' + data.maxAmount}}</em>
                <em v-else>{{data.amount}}</em>
            </p>
            <p>{{data.useAmountLimit ? `满${data.useAmount}元可用` : '无门槛使用'}}</p>
          </div>
          <div class="coupon-detail">
            <h2 class="coupon-name">{{data.name}}</h2>
            <div class="coupon-time">
              <p>{{data.activeTime | formatDate('date')}} ~ {{data.invalidTime | formatDate('date')}}</p>
              <p>
                <span v-if="data.weekLimit">{{data.weekList | weekText}}</span>
                <span v-if="!data.weekLimit && data.startupTimeLimit">每天</span>
                <span>{{ data.startupTimeLimit ? data.startupBeginTime + ' - ' + data.startupEndTime : '不限时段'}} 使用</span>
              </p>
            </div>
          </div>
          <!--0：领取，1使用，2 已领取（领取且达到限领数量）-->
          <div class="coupon-status" v-if="data.takeOrUseStatus === 0">
            <div v-if="data.receiveType == 0">
              <div class="coupon-percent">
                <p class="percent" :style="{width: data.receivedRate * 120 / 20 + 'rem'}"></p>
              </div>
              <p class="coupon-percent-txt">已抢{{parseInt(data.receivedRate * 100)}}%</p>
              <a class="button button-empty-primary button-size" @click="wxUserCouponTakeCoupon(data)">立即领取</a>
            </div>
            <div v-if="data.receiveType == 1">
              <div class="coupon-percent-normal">
                消耗积分
              </div>
              <p class="coupon-percent-txt">{{data.integralPrice}}</p>
              <a class="button button-empty-primary button-size" @click="exchangeCoupon(data)">立即兑换</a>
            </div>
          </div>

          <div class="coupon-status" v-if="data.takeOrUseStatus === 1 || data.status === 0">
            <a class="button button-primary button-size" @click="jumpToUseCoupon(data)">立即使用</a>
          </div>
          <!--<div class="coupon-status" v-if="data.status === 3">
            <a class="button button-empty-primary button-size">立即使用</a>
          </div>-->

          <!--<div class="coupon-status" v-if="type === 'select'">-->
            <!--<div class="check-box">-->
              <!--<input class="hide" type="radio" v-model="couponId" :value="data.id">-->
              <!--<i class="icon-check"></i>-->
            <!--</div>-->
          <!--</div>-->

          <div class="coupon-status coupon-used" v-if="data.status === 1"></div>
          <div class="coupon-status coupon-none" v-if="data.takeOrUseStatus === 2"></div>

        </div>
        <p class="coupon-use line line-x-t" @click="openInfoDialog(data)">使用说明</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props:['datas', 'type', 'fromPage'],
    data() {
      return {
        couponId:''
      }
    },
    mounted() {

    },
    methods: {
      openInfoDialog (data) {
        this.$emit('openInfoDialog', data)
      },

      exchangeCoupon(couponData) {
        this.$emit('exchangeCoupon', couponData.id)
      },

      wxUserCouponTakeCoupon (couponData) {
        if (!appStorage.get('X-Auth-Token')) {
          this.$router.push({
            name: 'getCoupon',
            query:{
              couponId: couponData.id,
            }
          })
        }else{
          api.wxUserCouponTakeCoupon(couponData.id).then(res=>{
            const data = TOOL.toJson(res.data)
              console.log(data);
            if (data.resultCode === '0') {
              if(this.fromPage){
                if(couponData.receiveType === 1) {
                    this.$store.dispatch('showSuccess', '兑换成功');
                } else {
                    this.$store.dispatch('showSuccess', '领取成功');
                }

                this.$router.go(-1)
              }else{
                this.$router.push({
                  name: 'getCouponSuccess',
                  query:{
                    myCouponId: data.resultData.id,
                    couponId: couponData.id,
                  }
                })
              }
            } else {
              this.$store.dispatch('showError', data.resultMsg);
            }
          })
        }
      },

      jumpToUseCoupon (data) {
        //0：所有产品，1：按类型选，2：按线路选，3：按班次选
        let router;
        if(data.suitProductTypeLevelOnes && data.suitProductTypeLevelOnes.length === 1){
          let productTypeLevelOne = data.suitProductTypeLevelOnes[0];
          let routers = {
            'CITY_BUS': 'city',
            'STATION_BUS': 'city',
            'AIRPORT_BUS': 'airportPickSearch',
            'TRAIN_STATION_BUS': 'trainPickSearch',
            'SCHOOL_BUS': 'schoolSearch',
            'SCENIC_BUS': 'scenicSearch',
            'TOUR_BUS': 'sights',
            'WORK_BUS': 'work',
            'LINE_BUS': 'lineCar',
            'CUSTOM_BUS': 'charterList',
            'CAR_HAILING': 'carHailingSearch',
            'TAXI': 'taxiSearch'
          }
          router = routers[productTypeLevelOne]
        }
        if(!router){
          router = appStorage.get('indexRouter');
        }
        this.$router.push({
          name: router
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .coupon-box{
    position: relative;
    padding:30px 20px 0;
  }
  .coupon-item{
    position: relative;
    margin-bottom: 30px;
    background-color: @bg-fff;
    font-size:24px;
    color:#888;
    &:last-child{
      margin-bottom: 0;
    }
    .circle{
      position: absolute;
      bottom:50px;
      width:20px;
      height:20px;
      background-color: @bg-f2f2f2;
      border-radius: 50%;
      z-index:100;
    }
    .left-circle{
      left: -10px;
      border-right:1px solid @bc-e5e5e5;
    }
    .right-circle{
      right: -10px;
      border-left:1px solid @bc-e5e5e5;
    }
    .coupon-info{
      position: relative;
      display: flex;
      height:175px;
      padding:30px 160px 20px 0;
    }
    .coupon-price-box{
      white-space: nowrap;
      padding:0 20px 24px;
      text-align: center;
      border-right:1px dashed @bc-e5e5e5;
    }
    .coupon-price{
      margin-bottom:30px;
      font-size:28px;
      color: @fc-ff6600;
      em{
        font-size:40px;
      }
    }
    &.no-use{
      .coupon-price,
      .coupon-name{
        color: @fc-888;
      }
    }
    .coupon-detail{
      position: relative;
      flex:1;
      padding:0 20px 0 30px;
      font-size:20px;
    }
    .coupon-name{
      width: 300px;
      margin-bottom:40px;
      line-height:1.4;
      font-size:32px;
      color:#121212;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .coupon-time{
      position: absolute;
      bottom: 0;
      left:30px;
      line-height: 1.6;
      p{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 300px;
      }
    }
    .coupon-use{
      line-height:60px;
      text-align:center;
    }
    .coupon-status{
      position: absolute;
      right:20px;
      bottom:24px;
      .button-size{
        width:120px;
        height:50px;
        line-height:50px;
        font-size:24px;
      }
      &.coupon-used{
        top:0;
        bottom:0;
        width:120px;
        background:url("../../../assets/my/used.png") no-repeat right center;
        background-size:100px 100px;
      }
      &.coupon-none{
        top:0;
        bottom:0;
        width:120px;
        background:url("../../../assets/my/none.png") no-repeat right center;
        background-size:100px 100px;
      }
      .coupon-percent{
        position: relative;
        width:120px;
        height:20px;
        margin-bottom:15px;
        border-radius:10px;
        background-color: @bg-ffe1cd;
        overflow:hidden;
        .percent{
          position: absolute;
          left:0;
          height:20px;
          border-radius:10px;
          transition: width 1s;
          background-color: @bg-ff6600;
        }
      }
      .coupon-percent-normal {
        width: 120px;
        height: 35px;

        text-align: center;
      }
      .coupon-percent-txt{
        text-align: center;
        margin-bottom:15px;
        color: @fc-ff6600;
      }
    }
  }
</style>
