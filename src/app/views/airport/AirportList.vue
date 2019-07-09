<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="city-s-top" v-if="isOpen">
      <search-address @searchCity="airportFindByKeyword"></search-address>
      <div class="city-top-box" v-show="showHotList">
        <p class="dw-tit">根据您的定位推荐机场</p>
        <ul class="station-list">
          <!--:class="{'active': key == 0}"-->
          <li v-for="(suggestStation, key) in suggestAirports" @click="setCity(suggestStation)">
            <div class="station-con">
              <p class="city-name">{{suggestStation.city}}</p>
              <p>{{suggestStation.name}}<span v-if="suggestStation.terminal">-{{suggestStation.terminal}}</span></p>
            </div>
          </li>
        </ul>
        <p class="hot-tit" v-show="hotAirports.length > 0">热门机场</p>
        <ul class="station-list" v-show="hotAirports.length > 0">
          <li v-for="hotStation in hotAirports" @click="setCity(hotStation)">
            <div class="station-con">
              <p class="city-name">{{hotStation.city}}</p>
              <p>{{hotStation.name}}<span v-if="hotStation.terminal">-{{hotStation.terminal}}</span></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <city-list :show="hasCity" :list-data="airports" type="airportStation" @setValue="setCity"></city-list>
    <no-result :show="!isOpen || !hasCity" :text="noResultText"></no-result>
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
        pageRouter: '', //返回界面路由、本地存储key

        suggestAirports: [], //推荐站点
        hotAirports: [], //热门站点
        airports: {}, //站点列表
        showHotList: true, //热门城市显示
        placeType: '',//地点类型
        isOpen: true,
        hasCity: true,
        noResultText:'<p>对不起</p><p>该地方暂未开通</p>'
      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      })
    },
    watch: {
      appCity (newVal, val) {
        if (newVal) {
          this.airportFindAllAirports(newVal)
        }
      },
    },
    mounted(){
      this.pageRouter = this.$route.query.pageRouter
      this.placeType = this.$route.query.placeType
      if (this.appCity) {
        this.airportFindAllAirports(this.appCity)
      }
    },
    methods: {

      /**
       * 城际专线查询城市及热门城市列表
       */
      airportFindAllAirports (city) {
        this.$store.commit('UPDATE_LOADING', true)
        api.airportFindAllAirports(city).then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          let data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.suggestAirports = data.resultData.suggestAirports
            this.hotAirports = data.resultData.hotAirports
            this.airports = data.resultData.airports
            this.hasCity = !$.isEmptyObject(this.airports)
            this.isOpen = !$.isEmptyObject(this.airports)
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 城市搜索
       */
      airportFindByKeyword (cityName) {
        this.$store.commit('UPDATE_LOADING', true)
        this.showHotList = !cityName
        this.airports = {}
        api.airportFindByKeyword(cityName).then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          let data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.airports = data.resultData
            this.hasCity = !$.isEmptyObject(this.airports)
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       *  设置选中的城市值
       *  @value 城市名称
       */
      setCity (value) {
        let localData = {}
        if (appStorage.get(this.pageRouter)) {
          localData = JSON.parse(appStorage.get(this.pageRouter))
        }
        localData[this.placeType] = value.name
        if(value.terminal){
          localData[this.placeType] = `${value.name}-${value.terminal}`
        }
        localData['airportCode'] = value.code
        appStorage.set(this.pageRouter, JSON.stringify(localData))
        this.$router.go(-1)
      }

    }
  }
</script>
