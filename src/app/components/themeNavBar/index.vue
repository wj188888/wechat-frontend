<template>
  <flexbox :gutter="0" class="nav-margin-top">
    <flexbox-item>
      <router-link class="city-bus-nav-box" :to="{name:'tripList'}">
        <img src="../../../assets/theme/cityBus/journey.png">
        <p>行程</p>
      </router-link>
    </flexbox-item>
    <flexbox-item>
      <router-link class="city-bus-nav-box" :to="{name:'checkList'}">
        <img src="../../../assets/theme/cityBus/ticket_checking.png">
        <p>验票</p>
      </router-link>
    </flexbox-item>
    <flexbox-item>
      <router-link class="city-bus-nav-box" :to="{name:'network'}">
        <img src="../../../assets/theme/cityBus/website.png">
        <p>网点</p>
      </router-link>
    </flexbox-item>
    <flexbox-item>
      <a class="city-bus-nav-box" @click="callService('')">
        <img src="../../../assets/theme/cityBus/service.png">
        <p>客服</p>
      </a>
    </flexbox-item>
  </flexbox>
</template>

<script>
  import phone from 'mixins/phone.js'
  import {Flexbox, FlexboxItem} from 'vux'
  export default {
    mixins: [phone],
    components:{
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
      
      }
    }
  }
</script>
<style lang="less" scoped>
  .city-bus-nav-box{
    display:inline-block;
    text-align:center;
    img{
      width:56px;
      height:56px;
      margin-bottom:24px;
    }
    p{
      font-size:22px;
      color:#595757;
    }
  }
  .nav-margin-top{
    margin-top:80px;
    text-align:center;
  }
</style>