<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="city-s-top">
      <search-address show-search-btn="true" @setCity="setCity" @searchCity="searchCity"></search-address>
      <div class="city-top-box" v-show="showHotList">
        <p class="dw-tit">根据您的定位推荐</p>
        <div class="default-city clearfix">
          <a v-text="appCity" @click="setCity(appCity)"></a>
        </div>
        <p class="hot-tit" v-show="false">热门城市</p>
        <ul class="hot-city" v-show="false">
          <li v-for="hotCity in hotCitys" @click="setCity(hotCity)">
            <a v-text="hotCity"></a>
          </li>
        </ul>
      </div>
    </div>
    <city-list :list-data="cityLists" @setValue="setCity"></city-list>
    <no-result :show="cityLists.length" text="抱歉，没有搜到这个地点耶~~"></no-result>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import SearchAddress from 'appComponents/searchAddress/index.vue'
  import CityList from 'appComponents/cityList/index.vue'
  import NoResult from 'appComponents/noResult/index.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      SearchAddress,
      CityList,
      NoResult
    },
    data () {
      return {
        title: this.$route.meta.title,
        cityLists: '',   //城市搜索列表
        showHotList: true, //热门城市显示
        page: '', //返回界面路由、本地存储key
        placeType: '', //地点类型,
        hotCitys: '',
        currentCity: ''
      }
    },
    mounted () {
      this.placeType = this.$route.query.placeType
      this.currentCity = this.$route.query.currentCity
      this.findDest()
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      })
    },
    methods: {
      /**
       * 根据出发地搜索目的地
       */
      findDest () {
        this.$store.commit('UPDATE_LOADING', true)
        api.findDestList({
          source: this.currentCity,
          hotCitiesNum: 20
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.hotCitys = data.resultData.hotCities
            this.cityLists = data.resultData.cities
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 城市搜索
       */
      searchCity (cityName) {
        this.cityLists = []
        api.searchDestList({
          source: this.currentCity,
          keyword: cityName
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.cityLists = data.resultData
            this.showHotList = false
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       *  设置选中的城市值
       *  @value 城市名称
       */
      setCity (cityName) {
        if (!cityName) {
          this.$store.dispatch('showError', '请输入要搜索的城市')
          return
        }
        appStorage.remove('productSight')
        this.$router.push({
          name: 'productSight',
          query: {
            currentCity: this.currentCity,
            keyword: cityName
          }
        })
      },


    }
  }
</script>

<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .sight-s-search{
    height:100px;
    padding:20px 40px 20px 20px;
    display:flex;
    .s-left{
      flex:1;
      padding-right:20px;
      position:relative;
      input{
        width:100%;
        height:100%;
        line-height:30px;
        border-radius:10px;
        border:1PX solid #ccc;
        padding:15px 50px 15px 30px;
        font-size:28px;
      }
      .cha{
        display:block;
        position:absolute;
        top:15px;
        right:35px;
        width:28px;
        height:28px;
        background:url('../../../assets/cha.png') no-repeat center;
        background-size:26px 26px;
      }
    }
    span{
      font-size:32px;
      color: #888;
      line-height:60px;
    }
  }
</style>
