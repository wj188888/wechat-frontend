<template>
  <div class="out-of-range">
    <p class="range-warning">{{warningTips}}</p>
    <p class="tel-warning" v-if="showServiceTel">您可以联系我们，电话下单</p>
    <div class="range-pic" :class="[warningPicClass]"></div>
    <p class="show-range" @click="goShowRange">查看接送范围</p>
    <div class="range-button-box">
      <a class="button button-black" @click="goBack()">我知道了</a>
      <a class="button button-blue"
         @click="callService('')"
         v-if="showServiceTel">
        <i></i>联系客服
      </a>
    </div>
  </div>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import phone from 'mixins/phone'

  export default {
    components: {
      MainBox,
    },
    data () {
      return {
        title: this.$route.meta.title,
        productId: '',
        productTypeLevelOne: '',
        type: '',
        feederId: '',
        fromPage: '',
        dataKey: '',
        lineType: '',
        start:'',
        city:'',
      }
    },
    mixins: [phone],
    computed: {
      warningTips () {
        if(this.fromPage === 'expressCreate'){
          return '您的寄件地址没有在接送范围内'
        }else{
            if(this.dataKey === 'onStation' || this.dataKey === 'from'){
              return '您的上车点没有在接送范围内'
            }else{
              return '您的下车点没有在接送范围内'
            }
        }
      },
      warningPicClass () {
        if(this.fromPage === 'expressCreate'){
          return 'range-pic-express'
        }else{
          if(this.dataKey === 'offStation' || this.dataKey === 'to'){
            return 'range-pic-down'
          }
        }
      },
      showServiceTel () {
        return this.fromPage === 'carpoolbusIndex' || this.fromPage === 'carpoolbusMap' || this.fromPage === 'busCarpooling'
      }
    },
    mounted () {
      this.productId = this.$route.query.productId
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.type = this.$route.query.type
      this.feederId = this.$route.query.feederId
      this.fromPage = this.$route.query.fromPage
      this.dataKey = this.$route.query.dataKey
      this.lineType = this.$route.query.lineType
      this.code = this.$route.query.code
      this.start = this.$route.query.start
      this.city = this.$route.query.city
    },
    methods:{
      goShowRange () {
        this.$router.replace({
          name:'showRange',
          query:{
            productId: this.productId,
            productTypeLevelOne: this.productTypeLevelOne,
            start: this.start,
            feederId: this.feederId,
            fromPage: this.fromPage,
            dataKey: this.dataKey,
            lineType: this.lineType,
            code: this.code,
            city: this.city
          }
        })
      },

      goBack () {
          this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less" scoped>
  .out-of-range{
    height:100%;
    text-align: center;
    background-color:#fff;
    overflow-y:auto;
  }
  .range-warning{
    padding-top:100px;
    font-size:46px;
    color:#121212;
  }
  .tel-warning{
    margin-top:10px;
    font-size:36px;
    color:#4c4c4c;
  }
  .range-pic{
    width:100%;
    margin-top:180px;
    height:367px;
    background:url("../../../assets/range_up.png") no-repeat center center;
    background-size: 501px 367px;
  }
  .range-pic-down{
    background:url("../../../assets/range_down.png") no-repeat center center;
    background-size: 517px 367px;
  }
  .range-pic-express{
    background:url("../../../assets/range_express.png") no-repeat center center;
    background-size: 501px 367px;
  }
  .show-range{
    margin:120px 0 30px;
    height:60px;
    line-height:60px;
    font-size:28px;
    color:#ff6600;
  }
  .range-button-box{
    padding:0 60px 60px;
    text-align: center;
  }
  .button-black{
    font-size:32px;
    color:#fff;
    background-color:#4A4C5B;
  }
  .button-blue{
    width:300px;
    margin:30px auto 0;
    text-align:center;
    font-size:32px;
    color:#fff;
    background-color:#2290f9;
    i{
      display:inline-block;
      margin-right:20px;
      width:31px;
      height:30px;
      background:url("../../../assets/tel_range.png") no-repeat center center;
      background-size:31px 30px;
      vertical-align: middle;
    }
  }
</style>
