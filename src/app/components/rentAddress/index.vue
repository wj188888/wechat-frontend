<template>
  <div class="car-box-inner">
    <div class="car-content">
      <div class="car-icon car-type-0">
        <img :src="carImg" alt=""
             onerror="javascript:this.src='https://obfiwfjx9.qnssl.com/carImg/%E9%98%BF%E5%B0%94%E6%B3%95%E7%BD%97%E5%AF%86%E6%AC%A7Giulia.jpg';"
        >
      </div>
      <div class="car-msg-box">
        <div class="car-type-msg">
          <p class="car-name">{{detailData | getCarBrandName}}</p>
          <p class="car-detail">
            <span>{{detailData.vehicleModel}}</span>
            <span>∣</span>
            <span>{{detailData.seats}}座</span>
            <span>∣</span>
            <span>{{detailData.displacement | getCarDisplacement}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="address-box line line-x-t" v-if="showTime">
      <p class="start-dian">{{detailData.aAddress.detailAddress}}</p>
      <p>
        {{detailData.aAddress.province}} {{detailData.aAddress.city}} {{detailData.aAddress.detailAddress}}
      </p>
      <p class="end-dian">{{detailData.bAddress.detailAddress}}</p>
      <p>
        {{detailData.bAddress.province}} {{detailData.bAddress.city}} {{detailData.bAddress.detailAddress}}
      </p>
    </div>
    <div class="data-box line line-x-b" v-if="showTime">
      <div class="data-box-item text-left time pad-l-30">
        <p class="p-t">取车时间</p>
        <p class="p-b">{{getDate(detailData.startTime)}} {{getTime(detailData.startTime)}}</p>
      </div>
      <div class="data-box-item text-center">
        <p class="text-center p-t total-day">
          {{detailData.allTime.day}}天{{detailData.allTime.hour}}小时
        </p>
        <div class="allow-right"></div>
      </div>
      <div class="data-box-item text-right">
        <p class="p-t">还车时间</p>
        <p class="p-b">{{getDate(detailData.endTime)}} {{getTime(detailData.endTime)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
      export default{
        data(){
            return{
                msg:'hello vue',
                carImg: 'https://obfiwfjx9.qnssl.com/carImg/%E9%98%BF%E5%B0%94%E6%B3%95%E7%BD%97%E5%AF%86%E6%AC%A7Giulia.jpg'
            }
        },
        props: {
          detailData: {
              type: Object,
              default() {
                  return  {
                        aAddress:{},
                        bAddress:{},
                        allTime:{}
                      }
              }
          },
          showTime: {
              type: Boolean,
              default: true
          }
        },
        watch: {
          detailData() {
            this.carImg = `https://obfiwfjx9.qnssl.com/carImg/${this.detailData.model}.jpg`;
          }
        },
        created() {
            this.carImg = `https://obfiwfjx9.qnssl.com/carImg/${this.detailData.model}.jpg`;
        },
        methods: {
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
        },
        components:{

        }
    }
</script>
<style lang="less" scoped>
  .car-box-inner {
    width: 100%;
    height: auto;
    border: 1PX solid #e5e5e5;
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
  .time {
    background: url("../../../assets/order_time.png") no-repeat left 22px;
    background-size: 16px 16px;
  }
  .data-box {
    display: flex;
    justify-content: space-between;

    width: 100%;
    height: 100px;
    padding: 0 20px;

    background: #fff;

    .p-t {
      font-size: 24px;
      color: #888;
      margin: 20px 0;
    }
    .p-b {
      font-size: 24px;
      color: #4c4c4c;
    }
  }
  .data-box-item {
    flex: 1;
  }
  .total-day {
    margin: 35px 0 0 0 !important;
  }
  .allow-right {
    width: 100%;
    height: 6px;

    background: url("../../../assets/rent/allow-right.png") no-repeat center center;
    background-size: 160px 6px;
  }
  .pad-l-30 {
    padding-left: 30px;
  }
</style>
