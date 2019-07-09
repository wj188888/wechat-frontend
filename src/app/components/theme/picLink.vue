<template>
  <div class="mar-t-20 bg-fff clearfix" v-if="picLinkItems && picLinkItems.length">
    <div class="pick-link-box pad-20" v-for="picLinkData in picLinkDatas">
      <div class="pick-link-item" v-for="picLink in picLinkData" @click="jumpToURI(picLink.linkUrl)">
        <img class="img" :src="picLink.iconUrl"/>
        <p class="text">{{picLink.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {Flexbox, FlexboxItem} from 'vux'
  export default {
    props:['type'],
    components:{
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        picLinkItems: '',
        picLinkDatas:[]
      }
    },
    mounted () {
      let localData = appStorage.get(this.type + 'PicLinkItems')
      if(localData){
        this.picLinkItems =  JSON.parse(localData)
        let len = this.picLinkItems.length
        if(this.picLinkItems.length){
          let i = 0
          let col = 2
          let row = Math.ceil(len / col)
          for (; i < row; i++){
            this.picLinkDatas.push(this.picLinkItems.slice(i * col, i * col + col))
          }
        }
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
  .pick-link-item{
    float:left;
    width: 50%;
    &:nth-child(even){
      padding-left:15px;
      
    }
    &:nth-child(odd){
      padding-right:15px;
    }
    .img{
      width: 100%;
      height:180px;
      border-radius:8px;
      box-shadow: 0 0 10px 0 #ccc;
    }
    .text{
      margin-top:10px;
      margin-bottom:30px;
      font-size:28px;
      color:#4c4c4c;
    }
  }
 
</style>
