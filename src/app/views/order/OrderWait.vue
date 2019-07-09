<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="carpolling-radius-box">
      <div class="carpooling-wait-box line line-x-b">
        <p>本次{{detailData.productTypeLevelTwo | getProductTwoName}}订单已成功提交</p>
        <p>系统正在为您调度司机及车辆</p>
        <p>等成功调度后系统将最终出票</p>
        <img src="../../../assets/charter/car.png"/>
      </div>
      <div class="order-ticket">
        <order-base-info :data="detailData"></order-base-info>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import OrderBaseInfo from 'appComponents/orderBaseInfo/index.vue'

  export default {
    components: {
      MainBox,
      OrderBaseInfo
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        productTypeLevelOne: '',
        id: '',
        detailData: {}
      }
    },
    mounted () {
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.id = this.$route.query.id
      this.findDataById()
    },
    methods: {

      /**
       * 根据enquiryId查询定制包车询价
       * 根据skuId查找线路包车
       * 根据skuId查找城际拼车
       */
      findDataById () {
        this.$store.commit('UPDATE_LOADING', true)
        let resource;
        if(this.productTypeLevelOne == 'CUSTOM_BUS'){
          resource = api.enquiryFindById(this.id)
        }else if(this.productTypeLevelOne == 'LINE_BUS'){
          resource = api.lineSkuFindById(this.id)
        }else if(this.productTypeLevelOne == 'CITY_BUS'){
          resource = api.carpoolSkuFindById(this.id)
        }
        resource.then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.detailData = data.resultData
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      }
    }
  }
</script>
<style scoped>
  .carpolling-radius-box {
    position: absolute;
    top: 40px;
    right: 20px;
    bottom: 40px;
    left: 20px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    -webkit-box-shadow: 0 1PX 4px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 1PX 4px rgba(0, 0, 0, 0.2);
    box-shadow: 0 1PX 4px rgba(0, 0, 0, 0.2);
    background-color: #fff;
  }

  .carpooling-wait-box {
    text-align: center;
    padding: 240px 40px 0;
    font-size: 32px;
    color: #272a35;
    line-height: 36px;
  }

  .carpooling-wait-box p {
    width: 100%;
    margin-bottom: 10px;
  }

  .carpooling-wait-box img {
    width: 398px;
    margin-top: 200px;
  }

  .order-ticket {
    margin: 20px;
    background-color: #fff;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    overflow: hidden;
  }
</style>
