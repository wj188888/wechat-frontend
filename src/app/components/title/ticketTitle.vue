<template>
  <div class="ticket-type-tit" :class="[cssClass]" v-if="show">
    <i class="shu"></i>{{title}}
    <!--<i class="hui">惠</i><p class="activity">二人乘车、一人免单</p><a class="more-activity"></a>-->
    <slot></slot>
    </div>
</template>
<script>
  export default {
    props: {
      show: {
        default: true
      },
      title: {
        default: ''
      },
      cssClass: {
        default: ''
      }
    },
    data () {
      return {

      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .ticket-type-tit {
    position: relative;
    height:88px;
    line-height:88px;
    margin-top:20px;
    padding:0 20px;
    font-size: 28px;
    color: @c-121212;
    background-color:#fff;
    .shu{
      position: relative;
      top:1PX;
      display:inline-block;
      width:6px;
      height:24px;
      margin-right:10px;
      background-color: @c-ff6600;
      -webkit-border-radius:2PX;
      border-radius:2PX;
    }
    .hui{
      display:inline-block;
      width:26px;
      line-height:26px;
      margin-left:32px;
      margin-right:6px;
      text-align: center;
      font-size:20px;
      color:#fff;
      background-color: @bg-ff6600;
      border-radius:4px;
    }
    .activity{
      display: inline-block;
      height:88px;
      line-height:88px;
      color: @fc-ff6600;
      font-size:24px;
    }
    .more-activity{
      position: absolute;
      right:20px;
      top:0;
      width:40px;
      height:100%;
      background:url("../../../assets/my/more.png") no-repeat right center;
      background-size:36px 8px;
    }
  }
</style>
