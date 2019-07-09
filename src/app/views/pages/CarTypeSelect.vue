<template>
  <main-box :title="title">
    <ul class="car-type-list">
      <li class="check-box" v-for="(avaibleCar, index) in avaibleCarList" @click="selectCarType(avaibleCar, index)">
        <img class="car-type-img" :src="avaibleCar.imgUrl"/>
        <div class="car-type-info">
          <div class="car-type-box">
            <p class="car-type">{{getCarTypeValue(avaibleCar.carType)}}</p>
            <p class="car-type-price" v-if="fromPageRouter === 'scoreBusSpecial'"><em>{{avaibleCar.integralPrice}}积分</em></p>
            <p class="car-type-price" v-else> ¥ <em>{{avaibleCar.price}}</em></p>
          </div>
          <p class="car-total-seats">&times;{{avaibleCar.seats}}</p>
          <p class="car-type-ctg">{{getCarBrandValue(avaibleCar.carBrand)}}</p>
        </div>
        <input class="hide" type="radio" v-model="carTypeId" :value="getCarTypeId(avaibleCar, index)">
        <i class="icon-check"></i>
      </li>
    </ul>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        fromPageRouter:'',
        productId:'',
        placeHolder:'',
        productTypeLevelOne:'',
        carTypeId:'',
        avaibleCarList:[],
        localData:{}
      }
    },
    mounted () {
      this.fromPageRouter = this.$route.query.fromPageRouter
      this.productId = this.$route.query.productId
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      if(appStorage.get(this.fromPageRouter)){
        this.localData = JSON.parse(appStorage.get(this.fromPageRouter))
        if(this.localData.avaibleCar){
          this.carTypeId = this.localData.avaibleCar.carTypeId
        }
      }
      this.findAvaibleCar(this.productTypeLevelOne)
    },
    methods: {

      /**
       * 获取车辆类型名字
       * @param carType 车辆类型Code
       * @returns {*}
       */
      getCarTypeValue (carType) {
        return TOOL.carInfo[carType].value
      },

      /**
       * 拼接车辆品牌
       * @param carBrand 车辆品牌
       * @returns {string}
       */
      getCarBrandValue (carBrand) {
        return carBrand.slice(0, 3).join('、') + '等同级车'
      },

      /**
       * 拼接车辆类型唯一标识
       */
      //todo 后续需优化id
      getCarTypeId (avaibleCar, index) {
        if(avaibleCar.carType || avaibleCar.carType === 0){
          return avaibleCar.carType + '|' + avaibleCar.price + '|' + avaibleCar.seats + '|' + avaibleCar.imgUrl + '|' + index
        }
      },

      /**
       * 根据选择时间获取车辆类型数据
       */
      findAvaibleCar () {
        let resource = 'charterProductFindAvaibleCar'
        if( this.fromPageRouter === 'scoreBusSpecial'){
          resource = 'findSpecialCar'
        }
        api[resource](this.productId, this.productTypeLevelOne).then(res => {
          const result = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (result.resultCode === '0') {
            this.avaibleCarList = result.resultData
          } else {
            this.$store.dispatch('showError', result.resultMsg)
          }
        })
      },

      selectCarType (avaibleCar, index) {
        this.carTypeId = this.getCarTypeId(avaibleCar, index)
        let carData = avaibleCar
        carData.carTypeId = this.carTypeId
        this.localData.avaibleCar = carData
        appStorage.set(this.fromPageRouter, JSON.stringify(this.localData))
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less" scoped>
  .car-type-list{
    margin-top:20px;
    li{
      height:auto;
      line-height:1;
      padding:20px;
      margin-bottom:20px;
      background:#fff;
      .icon-check{
        top:auto;
        right:20px;
        bottom:20px;
        height:34px;
      }
    }
  }
  .car-type-img{
    float:left;
    width:160px;
    height:90px;
    margin-top:14px;
  }
  .car-type-info{
    margin-left:180px;
    .car-type-box{
      display: flex;
    }
    .car-type{
      flex: 1;
      font-size:32px;
      color:#121212;
    }
    .car-type-price{
      flex: 1;
      text-align:right;
      font-size:28px;
      color:#ff6600;
      em{
        font-size:40px;
        color:#ff6600;
      }
    }
    .car-total-seats{
      height:60px;
      line-height:60px;
      padding-left:40px;
      background:url("../../../assets/seats.png") no-repeat 0 center;
      background-size:30px 30px;
    }
    .car-type-ctg{
      font-size:24px;
      color:#4c4c4c;
    }
  }
</style>
