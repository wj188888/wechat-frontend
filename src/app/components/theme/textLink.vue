<template>
  <ul class="text-link-box mar-t-20 clearfix" v-if="textLinkItems && textLinkItems.length">
    <li v-for="textLinkItem in textLinkItems"
        @click="jumpToURI(textLinkItem.linkUrl)">
      <!--<span class="text-dot"></span>-->
      <span>{{'· ' + textLinkItem.name}}</span>
    </li>
  </ul>
</template>

<script>
  import {Flexbox, FlexboxItem} from 'vux'
  export default {
    components:{
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        textLinkItems: ''
      }
    },
    mounted () {
      if(appStorage.get('textLinkItems')){
        this.textLinkItems = JSON.parse(appStorage.get('textLinkItems'))
      }
    },
    methods: {
      /**
       * 跳转外链
       * @param url
       */
      jumpToURI (url) {
        interfaceApi.jumpToURI(url)
      },
    }
  }
</script>
<style lang="less" scoped>
  .text-link-box{
    padding:20px;
    background-color:#fff;
    li{
      position: relative;
      float:left;
      width:50%;
      padding:20px 20px 10px 0;
      line-height:1;
      margin-bottom:10px;
      font-size:30px;
      color:#4c4c4c;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:nth-child(even){
        padding-right:0;
      }
    }
    .text-dot{
      position: absolute;
      left:20px;
      top: 50%;
      margin-top:7px;
      line-height:0;
      font-size:28px;
    }
  }
</style>
