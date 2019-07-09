<template>
  <div class="city-bus-container">
    <div class="swiper-box city-bus-banner">
      <div class="line line-x-t line-x-b banner">
        <swiper class="index-swiper" dots-position="center" :auto="true" :loop="true">
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
    <div class="city-bus-content">
      <search-box
        :start-place="searchKeys.startPlace"
        :end-place="searchKeys.endPlace"
        @changeStation="changeStation"
        @jumpToFrom="jumpToCitySearch('startPlace')"
        @jumpToTo="jumpToCitySearch('endPlace')">
        <group class="datetime-x line line-x-t">
          <calendar
            title="出行时间"
            :replace-text-list="{'TODAY':'今'}"
            :weeks-list="calendar.weeksList"
            :disable-past="calendar.disablePast"
            :display-format="formatDate"
            v-model="searchKeys.startTime">
          </calendar>
        </group>
      </search-box>
      <div class="pad-lr-20">
        <input type="button" class="button button-primary city-bus-searchbtn" @click="search" value="查询"/>
      </div>
      <div class="remove-scroll" v-if="historySearch.length > 0">
        <div class="city-search">
          <div class="city-search__scroll">
            <div class="city-search__item mar-r-5">
              <span class="history-time"></span>
            </div>
            <div class="city-search__item" v-for="(item,index) in historySearch"
                 @click="historySearchFun(index)"
            >
              <span class="city-search__startPlace">{{item.startPlace}}</span>
              <span class="city-search__place-middle">
                <span class="city-search__line"></span>
              </span>
              <span class="city-search__endPlace">{{item.endPlace}}</span>
            </div>
          </div>
        </div>
      </div>
      <theme-nav-bar v-if="shortcutMenu === 'true'"></theme-nav-bar>
    </div>
    <pic-link type="top"></pic-link>
    <div class="city-bus-nav-second" v-if="menuLength">
      <button-nav></button-nav>
    </div>
    <pic-link type="bottom"></pic-link>
    <text-link></text-link>
  </div>

</template>
<script>
  import SearchBox from 'appComponents/searchBox/index.vue'
  import ThemeNavBar from 'appComponents/themeNavBar/index.vue'
  import buttonNav from 'appComponents/buttonNav/index.vue'
  import PicLink from 'appComponents/theme/picLink'
  import TextLink from 'appComponents/theme/textLink'
  import { Group, Calendar,  Swiper, SwiperItem } from 'vux'
  import { mapState } from 'vuex'

  export default {
    components: {
      SearchBox,
      Group,
      Calendar,
      ThemeNavBar,
      buttonNav,
      PicLink,
      TextLink,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        swiper: [
          {urlName: 'city', imageUrl: 'static/pics/bannerCityBus.png'}
        ],
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        historySearch: [],
        pageId:'',
        calendar: {
          weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
          disablePast: true
        },
        searchKeys: {
          startPlace: TOOL.placeHolder.startPlace,
          endPlace: TOOL.placeHolder.endPlace,
          startTime: 'TODAY'
        },
        shortcutMenu: appStorage.get('shortcutMenu'),
      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      }),
      menuLength () {
        if(appStorage.get('productAliasItems')) {
          let productAliasItems = JSON.parse(appStorage.get('productAliasItems'))
          return productAliasItems.length
        }else{
          return 0
        }
      }
    },
    watch: {
      //定位城市初始化赋值
      appCity (newVal, val) {
        let localData = {}
        if (appStorage.get(this.pageRouter)) {
          localData = JSON.parse(appStorage.get(this.pageRouter))
        }
        this.searchKeys.startPlace = localData.startPlace || newVal
        this.location = appStorage.get('appCity') || newVal
      }
    },
    mounted () {
      if(this.$route.query.pageName){
        this.title = this.$route.query.pageName
      }
      // 获取最近历史搜索记录
      if(appStorage.get('cityHistorySearch')) {
        let tempData = JSON.parse(appStorage.get('cityHistorySearch'));
        this.historySearch = tempData.slice(0,5);
      }
      this.pageId = this.$route.query.pageId || 1;

      let localData = {}
      if (appStorage.get(this.pageRouter)) {
        localData = JSON.parse(appStorage.get(this.pageRouter))
      }
      this.location = appStorage.get('appCity') || this.appCity
      this.searchKeys.startPlace = localData.startPlace || this.appCity
      this.searchKeys.endPlace = localData.endPlace || TOOL.placeHolder.endPlace
      
      if(localData.startTime){
        this.searchKeys.startTime = localData.startTime
      }
  
      let nowTime = TOOL.newGetDate({type: 'time'}),
        nowDate = TOOL.newGetDate({type: 'date'});
      
      if(TOOL.dateCompare(this.searchKeys.startTime, nowDate) < 0){
        this.searchKeys.startTime = nowDate
      }
      
      /**
       * 控制时间超过下午18点就时间默认显示第二天
       */
      
      if (TOOL.dateCompare(nowTime, TOOL.rangeTime, 'time') > 0) {
        nowDate = TOOL.changeDate(nowDate, 'd', 1)
        this.searchKeys.startTime = TOOL.newGetDate({date: nowDate, type: 'date'});
      }
      this.findAds()
    },
    methods: {
      formatDate (date) {
        return TOOL.newGetDate({date: date, type: 'formatStartupTime'})
      },
      
      limitHistory (data) {
        return data.slice(0 ,5)
      },

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
       * 往返切换
       */
      changeStation () {
        let startPlace = this.searchKeys.startPlace
        if (this.searchKeys.endPlace !== TOOL.placeHolder.endPlace) {
          this.searchKeys.startPlace = this.searchKeys.endPlace
        } else {
          this.searchKeys.startPlace = TOOL.placeHolder.startPlace
        }

        if (startPlace !== TOOL.placeHolder.startPlace) {
          this.searchKeys.endPlace = startPlace
        } else {
          this.searchKeys.endPlace = TOOL.placeHolder.endPlace
        }
      },

      saveForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.searchKeys))
      },

      /**
       * 跳到城市选择界面
       */
      jumpToCitySearch (place) {
        let query = {
          fromPage: this.pageRouter,
          placeType: place,
          pageId: this.pageId,
          productTypeLevelOne: 'CITY_BUS'
        }
        if (place === 'endPlace') {
          let validata = TOOL.formValidate([
            {value: this.searchKeys.startPlace, emptyTips: '请选择出发地'}
          ]);
          if (!validata.valid) {
            this.$store.dispatch('showError', validata.msg);
            return false;
          }
          query.source = this.searchKeys.startPlace
        } else {
          this.searchKeys.endPlace = TOOL.placeHolder.endPlace
        }
        this.saveForm()
        this.$router.push({
          name: 'pageCity',
          query: query
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

      saveCitySearch() {
        let newObj = {
          startPlace: this.searchKeys.startPlace,
          endPlace: this.searchKeys.endPlace,
          startTime: this.searchKeys.startTime
        };

        let tag = 'true'
        for(let i = 0; i < this.historySearch.length; i++){
          if(this.historySearch[i].startPlace === newObj.startPlace && this.historySearch[i].endPlace === newObj.endPlace){
            tag = false
            break;
          }
        }
        if(this.historySearch.length >= 10) {
          if(tag === 'true'){
            this.$set(this.historySearch, 0, newObj)
          }else{
            this.$set(this.historySearch, tag, newObj)
          }
        }else {
          if(tag === 'true'){
            this.historySearch.unshift(newObj);
          }else{
            this.$set(this.historySearch, tag, newObj)
          }
        }
        appStorage.set('cityHistorySearch', JSON.stringify(this.historySearch));
      },

      historySearchFun(index) {
          let searchData = this.historySearch[index];
          this.searchKeys.startPlace = searchData.startPlace;
          this.searchKeys.endPlace = searchData.endPlace;
          this.searchKeys.startTime = searchData.startTime;
          let nowDate = TOOL.newGetDate({type: 'date'});
          if(TOOL.dateCompare(searchData.startTime, nowDate) < 0){
            this.searchKeys.startTime = nowDate
          }
          this.search();
      },

      /**
       *  跳转查询页面
       */
      search () {
        let validata = TOOL.formValidate([
          {value: this.searchKeys.startPlace, emptyTips: '请选择出发地'},
          {value: this.searchKeys.endPlace, emptyTips: '请选择目的地'},
          {value: this.searchKeys.startTime, emptyTips: '请选择出行时间'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.saveForm()
        this.saveCitySearch();
        appStorage.remove('busCarpooling');
        this.$router.push({
          name: 'list',
          query: {
            pageId: this.pageId,
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            startTime: this.searchKeys.startTime + ' 00:00:00'
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .history-time {
    display: block;
    /*vertical-align: top;*/
    width: 28px;
    height: 28px;
    margin-top: 1px;

    background: url("../../../assets/historyTime.png") no-repeat center center;
    background-size: 24px 24px;
  }
  .mar-r-5 {
    margin-right: 5px !important;
  }
  .remove-scroll {
    height: 70px;
    overflow: hidden;
  }
  .city-search {
    width: 100%;
    height: 45px;
    margin-top: 40px;
    /*margin-bottom: -10px;*/
    padding: 0 20px 15px 20px;
    font-size: 28px;
    color: #888;
    overflow-y: hidden;
    overflow-x: auto;
      &::-webkit-scrollbar {
          -webkit-appearance: none !important;
          display: none !important;
         background: transparent !important;
         width: 0 !important;
          &:horizontal {
              display: none;
          }
      }
    -webkit-overflow-scrolling: touch;
  }
  .city-search__scroll {
    display: inline-block;
    float: left;
    /*width: 200%;*/
    height: 100%;
    /*overflow-x: auto;*/
    white-space: nowrap;
  }
  .city-search__item {
    display: inline-block;
    /*float: left;*/
    height: 100%;

    margin-right: 40px;
  }
  .city-search__startPlace {
    display: inline-block;
    float: left;
    padding-top: 2px;
  }
  .city-search__place-middle {
    position: relative;
    display: inline-block;
    float: left;

    width: 30px;
    height: 100%;
  }
  .city-search__line {
    position: absolute;
    top: 15px;
    left: 50%;

    display: inline-block;
    width: 10px;
    height: 1PX;
    margin-left: -5px;

    background: #888;
  }
  .city-search__endPlace {
    display: inline-block;
    float: left;
    padding-top: 2px;
  }
  .swiper-box {
    .index-swiper {
      height: 290px;
      .vux-swiper {
        height: 290px !important;
      }
    }
  }
  .city-bus-container{
    position: relative;
    padding:240px 20px 100px;
  }
  .city-bus-banner{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 290px;
    padding: 0;
    img{
      width: 100%;
      height: 290px;
    }
    .line-x-b:after {
      border-bottom: 0;
    }
  }
  .city-bus-content{
    background:#ffffff;
    border-top-left-radius:10px;
    border-top-right-radius:10px;
    padding-bottom:40px;
    .line-box:after{
      display:none;
    }
  }
  .city-bus-nav-second{
    background-color:#ffffff;
    margin-top:20px;
    padding-top:26px;
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
