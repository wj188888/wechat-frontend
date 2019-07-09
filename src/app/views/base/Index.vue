<template>
  <div class="scrollingBox">
    <flexbox :gutter="0" class="nav-black" v-if="shortcutMenu === 'true'">
      <flexbox-item>
        <router-link class="nav-link" :to="{name:'tripList'}">
          <img src="../../../assets/index/cheliang.png">
          <p>行程</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link class="nav-link" :to="{name:'checkList'}">
          <img src="../../../assets/index/yanpiao.png">
          <p>验票</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link class="nav-link" :to="{name:'network'}">
          <img src="../../../assets/index/wangdian.png">
          <p>网点</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <a class="nav-link" @click="callService('')">
          <img src="../../../assets/index/kefu.png">
          <p>客服</p>
        </a>
      </flexbox-item>
    </flexbox>

    <menu-list type="index"></menu-list>

    <div class="swiper-box">
      <div class="line line-x-t line-x-b banner">
        <swiper class="index-swiper" height="10rem" dots-position="center" :auto="true" :loop="true">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in swiper" :key="index">
            <a @click="jumpToURI(item.url)" v-if="!item.productId">
              <img :src="item.imageUrl" :title="item.title">
            </a>
            <a @click="jumpToProduct(item)" v-else>
              <img :src="item.imageUrl" :title="item.title">
            </a>
          </swiper-item>
        </swiper>
        <div class="banner_advert">
          <img src="../../../assets/advert1.png" alt="">
        </div>
      </div>
    </div>

    <flexbox :gutter="0" class="vert-nav-box vux-1px-tb bg-fff">
      <flexbox-item class="vux-1px-r" @click.native="needTodo">
        <a class=" vux-center-h">
          <img src="../../../assets/index/huochepiao.png">
          <p>火车票</p>
        </a>
      </flexbox-item>
      <flexbox-item class="vux-1px-r" @click.native="needTodo">
        <a class="vux-center-h">
          <img src="../../../assets/index/feijipiao.png">
          <p>飞机票</p>
        </a>
      </flexbox-item>
    </flexbox>
    <flexbox :gutter="0" class="vert-nav-box vux-1px-b bg-fff">
      <flexbox-item class="vux-1px-r">
        <a class="vux-center-h">
          <img src="../../../assets/index/dingjiudian.png">
          <p>订酒店</p>
        </a>
      </flexbox-item>
      <flexbox-item class="vux-1px-r">
        <a class="vux-center-h">
          <img src="../../../assets/index/dingmenpiao.png">
          <p>订门票</p>
        </a>
      </flexbox-item>
    </flexbox>
    <div class="support"></div>
  </div>
</template>

<script>
  import { Flexbox, FlexboxItem, Swiper, SwiperItem } from 'vux'
  import MenuList from 'components/menuList/index'
  import phone from 'mixins/phone'

  export default {
    components: {
      MenuList,
      Flexbox,
      FlexboxItem,
      Swiper,
      SwiperItem
    },
    mixins: [phone],
    data () {
      return {
        swiper: [
          {urlName: 'city', imageUrl: 'static/pics/banner1.png'},
          {urlName: 'airportSendSearch', imageUrl: 'static/pics/banner2.png'},
          {urlName: 'lineCar', imageUrl: 'static/pics/banner3.png'}
        ],
        shortcutMenu: appStorage.get('shortcutMenu'),
      }
    },
    mounted(){
      this.findAds()
    },
    methods: {
      /**
       * 查询首页轮播图片
       */
      findAds () {
        api.findAdByPostion({postion: '0001'}).then(res => {
          this.$store.commit('UPDATE_LOADING', true)
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.$store.commit('UPDATE_LOADING', false)
            if (data.resultData.length > 0) {
              this.swiper = data.resultData
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
  
      /**
       * 轮播图跳转外链
       * @param url
       */
      jumpToURI (url) {
        interfaceApi.jumpToURI(url)
      },
      
      /**
       * 根据轮播图的产品类型跳转到指定的产品
       * @param data
       */
      jumpToProduct (data) {
        let type = data.productType;
        if (type === 'TOUR_BUS') {
          this.$router.push({
            name: 'productDetail',
            query: {id: data.productId}
          })
        } else if (type === 'LINE_BUS') {
          this.$router.push({
            name: 'carpoolingList',
            query: {productId: data.productId}
          })
        }
      },

      needTodo () {
        this.$store.dispatch('showAlert', {content: '哒哒哒，程序正在开发的路上', title: ' '})
      },
      
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .nav-black {
    background: #393A3E;
    .nav-link {
      display: block;
      width: 100%;
      padding: 35px 0 56px;
      text-align: center;
      img {
        width: 74px;
        height: 77px;
      }
      p {
        margin-top:18px;
        color: @c-fff;
        font-size: 32px;
      }
    }
  }

  .vert-nav-box a{
    height: 150px;
    line-height:150px;
    img {
      height: 52px;
      margin-top: 49px;
      margin-right: 38px;
    }
    p {
      color: #4E4E55;
      font-size: 24px;
    }
  }

  .support {
    height: 110px;
    line-height: 110px;
    text-align: center;
  }

  .banner{
    position: relative;
    .banner_advert{
      position: absolute;
      top:0;
      left: 0;
      img{
        width: 40px !important;
        height: 20px !important;
      }
    }
  }
</style>
