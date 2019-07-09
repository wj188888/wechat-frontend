<template>
  <div class="bg-fff" :class="{'menu-list-box': type !== 'index'}">
    <div :class="{'line line-x-t': i !== 1}" v-for="(menuList, key, i) in allMenu" v-if="menuList.menu.length">
      <normal-title :title="menuList.title" v-if="type !== 'index' && menuList.title"></normal-title>
      <flexbox :gutter="0" class="bg-fff" v-for="(menus, index) in menuList.menu" :key="index" :class="{'vux-1px-b': type === 'index'}">
        <flexbox-item
          :class="{'vux-1px-r': index != menus.length -1 && type === 'index'}"
          v-for="(menu, index) in menus"
          :key="index">
          <div class="squre-box" :class="{'row-4': indexRouter !== 'index' || type === 'header'}">
            <a @click="goPage(menu)" v-if="menu">
              <div class="center-div">
                <img :src="menu.iconUrl">
                <p v-text="menu.alias"></p>
              </div>
            </a>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<script>
  import { Flexbox, FlexboxItem } from 'vux'
  import NormalTitle from 'appComponents/title/normalTitle'
  import menu from 'mixins/menu.js'

  export default {
    components: {
      Flexbox,
      FlexboxItem,
      NormalTitle
    },
    mixins: [menu],
    props:['type'],
    data () {
      return {
        pageRouter: this.$route.name,
        allMenu:{
          menuList: {
            title: false,
            menu:[],
          },
          ownService:  {
            title:'自有服务',
            menu:[],
          },
          thirdPartyService: {
            title:'三方服务',
            menu:[],
          },
          extensionService:  {
            title:'推广服务',
            menu:[],
          },
        },
        indexRouter: appStorage.get('indexRouter')
      }
    },
    mounted () {
      this.getMenu()
    },
    methods:{
      getMenu () {
        
        if((this.indexRouter === 'index' || this.pageRouter === 'index') && this.type === 'index'){
          this.allMenu.menuList.menu = TOOL.getMenu(6)
        }else{
          if(appStorage.get('productAliasItems')){
            let productAliasItems = JSON.parse(appStorage.get('productAliasItems'))
            let len = productAliasItems.length
            let ownService = []
            let thirdPartyService = []
            let extensionService = []
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
                if(productAliasItem.cos === 0){
                  ownService.push(productAliasItem)
                }else if(productAliasItem.cos === 1){
                  thirdPartyService.push(productAliasItem)
                }else{
                  extensionService.push(productAliasItem)
                }
              }
            }

            this.allMenu.ownService.menu = this.getRow(ownService, 4)
            this.allMenu.thirdPartyService.menu = this.getRow(thirdPartyService, 4)
            this.allMenu.extensionService.menu = this.getRow(extensionService, 4)
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../styles/theme.less";
  .squre-box {
    position: relative;
    height: 0;
    padding-bottom: 100%;
    overflow:hidden;
    &.row-4{
      .center-div{
        margin-top:-76px;
      }
      p{
        margin-top: 10px;
      }
    }
    .center-div{
      position:relative;
      top:50%;
      margin-top:-66px;
      height:120px;
    }
    > a {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      height:100%;
      text-align: center;
    }
    img {
      width: auto;
      height: 100px;
    }
    p {
      margin-top: 20px;
      color: #36383B;
      font-size: 24px;
    }
  }
  .menu-list-box{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 100px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
