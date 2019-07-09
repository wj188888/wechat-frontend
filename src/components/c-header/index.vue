<template>
  <div>
    <!--头部-->
    <div class="app-header line line-x-b">
      <div class="hd-back" v-show="showBack" @click="headerGoBack"></div>
      <div class="hd-title" v-text="title"></div>
      <div>
        <div class="hd-more" v-show="showMore && indexRouter !=='carpoolbusMap' && indexRouter !=='busIndex'" @click="showMoreProductHandel"></div>
        <slot></slot>
      </div>
    </div>

    <!--头部右侧导航-->
    <div class="header-nav-box" v-show="showNav">
      <div class="header-nav-mask" @click="showNav = false"></div>
      <div class="header-nav">
        <menu-list type="header" @setShowNav="showNav = false"></menu-list>
        <router-link class="back-home-small line line-x-t" :to="{name: indexRouter}">
          <span>返回首页</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import MenuList from 'components/menuList/index.vue'
  export default {
    components: {
      MenuList
    },
    props:{
      title:{
        type:String,
        default:''
      },
      showBack:{
        type:Boolean,
        default: true
      },
      showMore:{
        type:Boolean,
        default: true
      },
      closeCallback: {
        type: Function,
        default () {
          this.$router.go(-1)
        }
      }
    },
    data () {
      return {
        menuList:[],
        showNav: false,
        indexRouter: appStorage.get('indexRouter')
      }
    },
    computed: {
      hasMenu () {
        if(appStorage.get('productAliasItems')){
          let productAliasItems = JSON.parse(appStorage.get('productAliasItems'))
          let len = productAliasItems.length
          let newMenus = []
          for(let i = 0; i < len; i++){
            let productAliasItem = productAliasItems[i]
            let menuList = TOOL.menuList()
            for(let j = 0; j < menuList.length; j++){
              if(productAliasItem.productType === menuList[j].productType && productAliasItem.type === menuList[j].type){
                let target = menuList[j].target
                target.query = {
                  pageId: menuList[j].pageId,
                  pageName: productAliasItem.alias
                }
                productAliasItem.target = target
                if(!productAliasItem.iconUrl){
                  productAliasItem.iconUrl = menuList[j].iconUrl
                }
              }
            }

            if(productAliasItem.applyState === 0){
              newMenus.push(productAliasItem)
            }
          }
          return newMenus.length
        }else{
          return false
        }
      }
    },
    mounted () {},
    methods:{
      headerGoBack () {
        this.closeCallback()
      },

      showMoreProductHandel () {
          if(this.hasMenu){
            this.showNav = !this.showNav
          }else{
            this.$router.push({
              name: this.indexRouter
            })
          }
      }
    }
  }
</script>
<style lang="less">
  @import "../../styles/theme.less";

  .app-header {
    width: 100%;
    height:86px;
    padding:0 90px;
    background-color: @c-fff;
    .hd-back{
      position:absolute;
      left:0;
      top:0;
      width:90px;
      height:86px;
      background:url("../../assets/back.png") no-repeat 20px center;
      background-size:12px 24px;
    }
    .hd-title{
      width: 100%;
      height:86px;
      line-height:86px;
      font-size:36px;
      color:#323232;
      text-align:center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .hd-more{
      position:absolute;
      right:0;
      top:0;
      width:90px;
      height:86px;
      background:url("../../assets/more.png") no-repeat 25px center;
      background-size: 45px 45px;
    }
  }
  .hd-cancel{
    position:absolute;
    right:0;
    top:0;
    padding-right:20px;
    height:86px;
    line-height:86px;
    color:#888;
    font-size:32px;
    &.fc-4c4c4c{
      color:#4c4c4c;
    }
  }
  .header-nav-box{
    position:absolute;
    top:87px;
    bottom:0;
    width:100%;
    .header-nav-mask{
      position:absolute;
      top:0;
      bottom:0;
      width:100%;
      background:rgba(0, 0 , 0, 0.5);
      z-index: 990;
    }
    .header-nav{
      position:absolute;
      top:0;
      bottom:150px;
      width:100%;
      z-index: 999;
      overflow:hidden;
    }
    .back-home-small{
      position: absolute;
      bottom:0;
      z-index: 999;
      display: block;
      width: 100%;
      height:100px;
      line-height:100px;
      font-size:32px;
      color:#4c4c4c;
      text-align:center;
      background:#fff;
      span{
        padding-left:64px;
        background:url("../../../static/pics/backhome_small.png") no-repeat 0 center;
        background-size:40px 37px;
      }
    }
  }
</style>
