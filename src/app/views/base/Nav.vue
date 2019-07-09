<template>
  <div>
    <div class="main scrollingBox" :style="marketerId ? {top:'6rem'} : ''">
      <router-view></router-view>
    </div>
    <tabbar class="vux-1px-t">
        <tabbar-item
          :style="tabBarBg ? {background: '#' + tabBarBg} : ''"
          :selected="urlName == menu.pageRouter"
          :link="{name: menu.pageRouter, query: menu.query}"
          v-for="(menu, index) in menuList" :key="index">
          <div slot="icon" :class="'icon ' + menu.icon"></div>
          <span slot="label">{{menu.pageName}}</span>
        </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vux'

  export default {
    components: {
      Tabbar,
      TabbarItem
    },
    data () {
      return {
        indexRouter: appStorage.get('indexRouter'),
        orderListRouter: 'orderList',
        myRouter: 'my',
        tabBarBg: appStorage.get('tabBarBg'),
        menuList: '',
        marketerId: appStorage.get('marketerId')
      }
    },
    computed: {
      urlName () {
        return this.$route.name
      }
    },
	mounted () {
    if(this.indexRouter === 'carpoolbusMap'){
      this.myRouter = 'carpoolMapMy'
    }
    this.orderListRouter = TOOL.getOrderListPageRouter()
    this.menuList = [
      {pageRouter: this.indexRouter, pageName:'主页', icon: 'icon-home'},
      {pageRouter: this.orderListRouter, query:{status: -1}, pageName:'订单', icon: 'icon-order'},
      {pageRouter: this.myRouter, pageName:'我的', icon: 'icon-my'},

    ]
      
//		this.getIndexRouter()
	},
	methods: {
		getIndexRouter() {
			let this_router = this.$route.name;
			let index_routers = ['index', 'cityBusIndex', 'carhailingIndex', 'carpoolbusIndex'];
			if(index_routers.indexOf(this_router) > -1) {
				this.$router.push({name: appStorage.get('indexRouter')})
			}
		},

    closeCarpoolPrice () {
      this.$store.commit('UPDATE_CARPOOLPRICE_DIALOG', false)
    }
	}
}
</script>

<style lang="less">
  @import "../../../styles/theme.less";
  .main {
    display: flex;
    position: absolute;
    top: 0;
    bottom: 100px;
    width: 100%;
    overflow-x:hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
       -webkit-appearance: none;
      &:vertical {
         display: none;
       }
    }
  }

  .weui-tabbar {
    height:100px;
    background-color: @c-fff!important;
    .weui-tabbar__item {
      padding-top: 12px;
      &.weui-bar__item_on{
        .icon-home {
          background-image: url("../../../assets/index/index_yes.png");
        }

        .icon-ticket {
          background-image: url("../../../assets/index/car_trick_yes.png");
        }

        .icon-order {
          background-image: url("../../../assets/index/car_trick_yes.png");
        }
        .icon-my {
          background-image: url("../../../assets/index/my_yes.png");
        }
        .weui-tabbar__label{
          font-size:20px;
          color: @c-ff6600;
        }
      }
    }
    .weui-tabbar__icon {
      width: 48px;
      height: 52px;
      .icon {
        width: 100%;
        height: 100%;
        background: no-repeat center center;
        background-size:44px 46px;
      }
      .icon-home {
        background-image: url("../../../assets/index/index_no.png");
      }

      .icon-ticket {
        background-image: url("../../../assets/index/car_trick_no.png");
      }

      .icon-order {
        background-image: url("../../../assets/index/car_trick_no.png");
      }
      .icon-my {
        background-image: url("../../../assets/index/my_no.png");
      }
    }
    .weui-tabbar__icon + .weui-tabbar__label {
      margin-top: 0.1rem;
      font-size: 20px;
      color: @c-888;
    }
  }
</style>
