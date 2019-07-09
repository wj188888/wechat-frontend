<template>
  <!--<div class="car-box-outer">-->
    <div class="car-box-inner">
      <div class="car-content line line-x-b" @click="selectCar(car)">
        <div class="car-icon"

        >
          <img :src="carImg" alt=""
               onerror="javascript:this.src='https://obfiwfjx9.qnssl.com/carImg/%E9%98%BF%E5%B0%94%E6%B3%95%E7%BD%97%E5%AF%86%E6%AC%A7Giulia.jpg';"
          >
        </div>
        <div class="car-msg-box">
          <div class="car-type-msg">
            <p class="car-name">{{car | getCarBrandName}}</p>
            <p class="car-detail">
              <span>{{car.vehicleModel}}</span>
              <span>∣</span>
              <span>{{car.seats}}座</span>
              <span>∣</span>
              <span>{{car.displacement | getCarDisplacement}}</span>
            </p>
          </div>
          <div class="car-money">
            <span class="font-s-28">¥</span>
            <span>{{firstPrice}}</span>
            <span class="font-s-28">/天</span>
          </div>
        </div>
      </div>
      <div class="rent-money">
        <div class="rent-text" @click="showCalendar=!showCalendar">
          <span class="mar-r-20">每日租金</span>
          <i class="icon-b-static allow-position"
             :class="{'icon-allow-active':showCalendar}"
          ></i>
        </div>
        <rent-calendar
          :crOrder="crOrder"
          :show="showCalendar"
          :startDateTemp="crOrder.startTime"
          :endDateTemp="crOrder.endTime"
          :aboveHourToDay="aboveHourToDay"
          :priceCalendar="car.priceCalendar"
          @getFirstPrice="getFirstPrice"
        ></rent-calendar>
      </div>
    </div>
  <!--</div>-->
</template>
<script>
  import RentCalendar from 'appComponents/rentCalendar/index.vue'

  export default{
        data(){
            return{
              crOrder:{},
              firstPrice: 0,
              showCalendar: false,
              carImg: 'https://obfiwfjx9.qnssl.com/carImg/%E9%98%BF%E5%B0%94%E6%B3%95%E7%BD%97%E5%AF%86%E6%AC%A7Giulia.jpg'
            }
        },
        components:{
            RentCalendar,
        },
        props: {
          car: {
              type: Object,
              default() {
                  return {};
              }
          },
          aboveHourToDay: {
              default: 1
          }
        },
        created() {
          this.carImg = `https://obfiwfjx9.qnssl.com/carImg/${this.car.model}.jpg`;
          if(appStorage.get('crOrder')) {
            this.crOrder = JSON.parse(appStorage.get('crOrder'));
            if(!this.crOrder.firstDayRentalFee) {
              this.crOrder.firstDayRentalFee = 0;
            }
          }
        },
        methods: {
          getCarClass(type) {
            return 'car-type-'+type;
          },
          getFirstPrice(price) {
              this.firstPrice = price;
              this.crOrder.firstDayRentalFee = price;
          },
          selectCar(car) {
              this.crOrder.grade = car.grade;
              this.crOrder.vehicleModel = car.vehicleModel;
              this.crOrder.seats = car.seats;
              this.crOrder.displacement = car.displacement;
              this.crOrder.model = car.model;
              this.crOrder.brand = car.brandName;
  
            appStorage.set('crOrder', JSON.stringify(this.crOrder));

              this.$router.push({
                  name: 'fillOrder',
              })
          }
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
      flex: 4;
    .car-name {
      font-weight: bold;
      font-size: 32px;
      height: 32px;
      color: #121212;
      margin: 25px 0 70px 0;
    }
    .car-detail {
      font-size: 24px;
      color: #4c4c4c;
    }
  }
  .car-money {
    flex: 3;
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
    height: 80px;
    line-height: 80px;
    text-align: center;

    font-size: 24px;
    color: #4c4c4c;
  }
  .allow-position {
    margin-bottom: 2px;
  }

  .mar-t-44 {
    margin-top: 44px;
  }
  .font-s-28 {
    font-size: 28px;
  }
</style>
