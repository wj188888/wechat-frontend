<template>
  <main-box :title="title">
    <div class="sight-nav" slot="header">
      <div class="nav-input">
        <div class="location" @click="jumpToLocationSearch()" v-text="location"></div>
        <span class="source-search" @click="jumpToDestSearch()">目的地/关键字</span>
      </div>
    </div>
    <div class="sight-scroller" v-show="bannerImg.length > 0 || prcData.length > 0">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div>
          <div class="s-slide-box" v-if="bannerImg.length > 0">
            <div class="slide-ul">
              <swiper dots-position="center" auto height="15rem">
                <swiper-item v-for="(picData, index) in bannerImg" :key="index">
                  <a class="slide-item"
                     v-if="!picData.productId"
                     :style="{backgroundImage: 'url(\'' + picData.imageUrl + '\')'}"
                     :href="picData.url">
                  </a>
                  <a class="slide-item"
                     v-else
                     :style="{backgroundImage: 'url(\'' + picData.imageUrl + '\')'}"
                     @click="photoJumpTo(picData.productId,picData.productSubType)">
                  </a>
                </swiper-item>
              </swiper>
            </div>
          </div>
          <more-title title="推荐景点" router="moreProduct" :show="prcData.length"></more-title>
          <tour-ticket :list-data="prcData" @jumpToDetail="jumpToPrcDetail"></tour-ticket>
        </div>
      </scroll>
    </div>
    <no-result :show="bannerImg.length === 0 && prcData.length === 0" text="抱歉，暂无可用线路">
      <img class="icon" src="../../../assets/no.png"/>
    </no-result>
   </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import MoreTitle from 'appComponents/moreTitle/index'
  import LineTicket from 'appComponents/lineTicket/index'
  import TourTicket from 'appComponents/tourTicket/index'
  import NoResult from 'appComponents/noResult/index'
  import { Swiper, SwiperItem } from 'vux'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      Scroll,
      MoreTitle,
      LineTicket,
      TourTicket,
      Swiper,
      SwiperItem,
      NoResult
    },
    data () {
      return {
        title: this.$route.meta.title,
        location: '',    //出发地
        destination: '',    // 目的地
        stationFlag: '',
        prcData: '',
        searchKeys:{
          productType: 1,
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        totalPage: '',
        bannerImg: ''
      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      })
    },
    watch: {
      appCity (newVal) {
        this.location = newVal
      }
    },
    mounted () {
      this.findAds()
      this.location = appStorage.get('sightCity') || this.appCity
      this.searchKeys.pageNo = 0
      this.onPullingUp()
    },
    methods: {
      /**
       * 查询轮播图片
       */
      findAds () {
        this.$store.commit('UPDATE_LOADING', true)
        api.findAdByPostion({postion: '1001'}).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.bannerImg = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 景点轮播图跳转
       */
      photoJumpTo (id, type) {
        if (type === 'TOUR_SCENIC') {
          appStorage.remove('porderWrite')
          this.$router.push({
            name: 'productDetail',
            query: {id: id}
          })
        }
      },
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.prcData = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
  
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.findCommendProduct(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.prcData = this.prcData.concat(data.resultData.content)
            this.totalPage = data.resultData.totalPages
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
              this.searchKeys.pageNo++
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      jumpToPrcDetail (id) {
        appStorage.remove('porderWrite')
        this.$router.push({
          name: 'productDetail',
          query: {
            id: id
          }
        })
      },

      /**
       * 跳到定位城市选择界面
       */
      jumpToLocationSearch () {
        this.$router.push({
          name: 'pageLocation',
          query: {
            placeType: 'sightCity'
          }
        })
      },

      jumpToDestSearch () {
        if (!this.location) {
          this.$store.dispatch('showError', '正在获取定位信息，请稍后')
          return
        }
        this.$router.push({
          name: 'sightOff',
          query: {
            currentCity: this.location,
            placeType: 'sightDest'
          }
        })
      },
    }
  }
</script>
