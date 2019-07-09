<template>
	<div class="carhiling-nav-second" v-if="menuList.length">
		<flexbox :gutter="0" class="bg-fff" v-for="(menus, index) in menuList" :key="index">
			<!--:class="{'vux-1px-r': index != menus.length -1 }"-->
			<flexbox-item
					v-for="(menu, index) in menus"
					:key="index">
					<a @click="goPage(menu)" v-if="menu" class="carhiling-second-nav-box">
						<img :src="menu.iconUrl">
						<p v-text="menu.alias"></p>
					</a>
			</flexbox-item>
		</flexbox>
	</div>
</template>
<script>
	import { Flexbox, FlexboxItem } from 'vux'
  import menu from 'mixins/menu.js'

	export default {
		components: {
			Flexbox,
			FlexboxItem
		},
    mixins: [menu],
    props:['type'],
		data () {
			return {
				menuList:[],
			}
		},
		mounted () {
			this.getMenu()
		},
		methods:{
		  getMenu () {
        if(appStorage.get('productAliasItems')){
          let productAliasItems = JSON.parse(appStorage.get('productAliasItems'))
          let len = productAliasItems.length
          let ownService = []
          for(let i = 0; i < len; i++){
            let productAliasItem = productAliasItems[i]
            let menuList = TOOL.menuList()
            for(let j = 0; j < menuList.length; j++){
              if(productAliasItem.productType === menuList[j].productType && productAliasItem.type === menuList[j].type){
                
                //司机名片菜单
                if(this.type === 'link'){
                  productAliasItem.target = TOOL.shareURL + menuList[j].target.name + '?fromType=2' + '&Brand_Name=' + appStorage.get('Brand_Name') + '&StoreId=' + appStorage.get('StoreId');
                }else{
                  productAliasItem.target = menuList[j].target
                }
                if(!productAliasItem.iconUrl){
                  productAliasItem.iconUrl = menuList[j].iconUrl
                }
              }
            }
            if(productAliasItem.applyState === 0){
              ownService.push(productAliasItem)
            }
          }

          if(ownService.length > 8){
            ownService = ownService.splice(0, 7)
            //司机名片菜单
            if(this.type === 'link'){
              ownService.push({target: TOOL.shareURL + 'moreProductMenu?fromType=2' + '&Brand_Name=' + appStorage.get('Brand_Name') + '&StoreId=' + appStorage.get('StoreId'), iconUrl: 'static/pics/more.png', alias:'更多产品'})
            }else{
              ownService.push({target: {name: 'moreProductMenu'}, iconUrl: 'static/pics/more.png', alias:'更多产品'})
            }
          }
          this.menuList = this.getRow(ownService, 4)
        }
      },
		}
	}
</script>
<style lang="less" scoped>
	.carhiling-nav-second {
    padding-bottom:20px;
		background-color: #fff;
		text-align: center;
	}
	.carhiling-second-nav-box{
		display:inline-block;
		margin-bottom:60px;
		width: 100%;
		text-align: center;
		img{
			width:100px;
			height:100px;
			margin-top: 20px;
		}
		p{
			font-size:24px;
			color:#4c4c4c;
		}
	}
	.carhiling-second-nav-box:first-child {
		margin-bottom: 0;
	}
</style>
