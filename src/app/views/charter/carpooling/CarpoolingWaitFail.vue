<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="flex-vertical">
      <div class="carpooling-wait-box">
        <p>抱歉、我们未能成功为您调度到服务的司机、车辆，本次订单系统强制取消，您的票款系统将在24小时之内全额退还到您的账户。</p>
        <img src="../../../../assets/charter/no_car.png" />
      </div>
      <div class="carpooling-wait-btn mar-lr-20">
        <router-link tag="input" type="button" :to="{name: 'lineCar'}" class="button button-primary" value="去看看别的线路吧"></router-link>
      </div>
    </div>
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

      }
    },
    mounted () {

    },
    methods: {
    }
  }
</script>
<style scoped>
  .carpooling-wait-box{
    flex:1;
    text-align:center;
    padding:125px 40px 0;
    font-size:32px;
    color:#272a35;
    line-height:1.414;
  }
  .carpooling-wait-box p{
    width:100%;
  }
  .carpooling-wait-box img{
    width:276px;
    margin-top:194px;
  }
  .carpooling-wait-btn{
    height:220px;
  }
</style>
