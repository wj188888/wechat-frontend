<template>
  <main-box :title="title" :show-back="!isUndunionApp" :show-more="!isUndunionApp" main-class="scrollingBox">
    <div class="shadow-box">
      <img :src="logoPic">
      <p>www.undunion.com</p>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import logo from '../../../../static/pics/undunion.png'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        logoPic:logo,
        isUndunionApp: TOOL.browser().undunion_app
      }
    }
  }
</script>
<style>
  .shadow-box{
    position: absolute;
    top:40px;
    right:20px;
    bottom:40px;
    left:20px;
    -webkit-border-radius:10px;
    -moz-border-radius:10px;
    border-radius:10px;
    -webkit-box-shadow: 0 1PX 4px rgba(0,0,0,0.2);
    -moz-box-shadow: 0 1PX 4px rgba(0,0,0,0.2);
    box-shadow: 0 1PX 4px rgba(0,0,0,0.2);
    background-color:#fff;
  }
  .shadow-box img{
    position:absolute;
    top:50%;
    left:50%;
    width:380px;
    margin-top: -145px;
    margin-left: -190px;
  }
  .shadow-box p{
    position:absolute;
    bottom:48px;
    width: 100%;
    font-size:24px;
    color:#ccc;
    text-align: center;
  }
  .tech-info-box{
    height:auto;
  }
  .shadow-box li{
    position: relative;
    padding-left:20px;
    height:120px;
    line-height:120px;
    font-size:30px;
    color:#4c4c4c;
    text-align:left;
  }
  .shadow-box li a{
    display:block;
    color:#4c4c4c;
  }
  .shadow-box li i:after{
    right:20px;
  }
</style>
