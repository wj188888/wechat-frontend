<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="city-s-top"  v-if="isOpen">
      <search-address @searchCity="searchCity"></search-address>
      <div class="city-top-box" v-show="showHotList && hotCities.length > 0">
        <p class="dw-tit">根据您的定位推荐</p>
        <div class="default-city clearfix">
          <a v-text="appCity" @click="setCity(appCity)"></a>
        </div>
        <p class="hot-tit" v-show="false">热门城市</p>
        <ul class="hot-city" v-show="false">
          <li v-for="hotCity in hotCities" @click="setCity(hotCity)">
            <a v-text="hotCity"></a>
          </li>
        </ul>
      </div>
    </div>
    <city-list :show="isOpen && hasCity" :list-data="cities" @setValue="setCity"></city-list>
    <no-result :show="!isOpen || !hasCity" :text="noResultText"></no-result>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import SearchAddress from 'appComponents/searchAddress/index'
  import CityList from 'appComponents/cityList/index'
  import NoResult from 'appComponents/noResult/index'

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
        cities: '', //城市数据
        hotCities:'', //热门城市
        showHotList:true, //热门城市显示
        fromPage: '',
        pageId:'',
        source: '',//出发地
        placeType: '',//地点类型
        productTypeLevelOne: '',
        productTypeLevelTwo: '',
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
    mounted () {
      this.fromPage = this.$route.query.fromPage
      this.pageId = +this.$route.query.pageId
      this.placeType = this.$route.query.placeType
      this.source = this.$route.query.source
      this.setProductType()
      this.findCityList()
    },
    methods:{
      setProductType () {
        switch (this.pageId) {
          case 1:
            this.productTypeLevelOne = ['CITY_BUS', 'STATION_BUS'];
            this.productTypeLevelTwo = '';
            break;
          case 1001:
            this.productTypeLevelOne = ['CITY_BUS'];
            this.productTypeLevelTwo = ['CITY_EXPRESS_BUS'];
            break;
          case 1002:
            this.productTypeLevelOne = ['CITY_BUS'];
            this.productTypeLevelTwo = ['CITY_SPECIAL_BUS'];
            break;
          case 1003:
            this.productTypeLevelOne = ['STATION_BUS'];
            this.productTypeLevelTwo = ['STATION_FIXED_BUS', 'STATION_STREAM_BUS'];
            break;
          case 1004:
            this.productTypeLevelOne = ['CITY_BUS'];
            this.productTypeLevelTwo = ['CITY_CAR_POOL_BUS'];
            break;
          case 3:
            this.productTypeLevelOne = ['AIRPORT_BUS'];
            this.productTypeLevelTwo = '';
            break;
          case 3001:
            this.productTypeLevelOne = ['AIRPORT_BUS'];
            this.productTypeLevelTwo = ['AIRPORT_EXPRESS_BUS'];
            break;
          case 3002:
            this.productTypeLevelOne = ['AIRPORT_BUS'];
            this.productTypeLevelTwo = ['AIRPORT_SPECIAL_BUS'];
            break;
          case 28:
            this.productTypeLevelOne = ['SCENIC_BUS'];
            this.productTypeLevelTwo = '';
            break;
          case 2801:
            this.productTypeLevelOne = ['SCENIC_BUS'];
            this.productTypeLevelTwo = ['SCENIC_SPECIAL_BUS'];
            break;
          case 2802:
            this.productTypeLevelOne = ['SCENIC_BUS'];
            this.productTypeLevelTwo = ['SCENIC_EXPRESS_BUS'];
            break;
          case 2803:
            this.productTypeLevelOne = ['SCENIC_BUS'];
            this.productTypeLevelTwo = ['SCENIC_CAR_POOL_BUS'];
            break;
          case 5:
            this.productTypeLevelOne = ['SCHOOL_BUS'];
            this.productTypeLevelTwo = '';
            break;
          case 5003:
            this.productTypeLevelOne = ['SCHOOL_BUS'];
            this.productTypeLevelTwo = ['SCHOOL_EXPRESS_BUS'];
            break;
          case 5002:
            this.productTypeLevelOne = ['SCHOOL_BUS'];
            this.productTypeLevelTwo = ['SCHOOL_SPECIAL_BUS'];
            break;
          case 5004:
            this.productTypeLevelOne = ['SCHOOL_BUS'];
            this.productTypeLevelTwo = ['SCHOOL_CAR_POOL_BUS'];
            break;
          case 9:
            this.productTypeLevelOne = ['TRAIN_STATION_BUS'];
            this.productTypeLevelTwo = '';
            break;
          case 9001:
            this.productTypeLevelOne = ['TRAIN_STATION_BUS'];
            this.productTypeLevelTwo = ['TRAIN_EXPRESS_BUS'];
            break;
          case 9002:
            this.productTypeLevelOne = ['TRAIN_STATION_BUS'];
            this.productTypeLevelTwo = ['TRAIN_SPECIAL_BUS'];
            break;
          case 7:
            this.productTypeLevelOne = ['CUSTOM_BUS', 'LINE_BUS'];
            this.productTypeLevelTwo = '';
            break;
          case 7001:
            this.productTypeLevelOne = ['CUSTOM_BUS'];
            this.productTypeLevelTwo = ['CUSTOM_BUS'];
            break;
          case 7002:
            this.productTypeLevelOne = ['LINE_BUS'];
            this.productTypeLevelTwo = ['LINE_CHARTER_BUS', 'LINE_CAR_POOL_BUS'];
            break;
        }
      },

      /**
       * 城际专线查询城市及热门城市列表
       */
      findCityList () {
        let resource;
        this.$store.commit('UPDATE_LOADING', true)
        if(this.source){
          resource = api.cityLineRegionDestinations(this.source, TOOL.hotCitiesNum, this.productTypeLevelOne, this.productTypeLevelTwo);
        }else{
          resource = api.cityStartupRegionCities(TOOL.hotCitiesNum, this.productTypeLevelOne, this.productTypeLevelTwo);
        }

        resource.then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          let data = TOOL.toJson(res.data)
          if(data.resultCode === '0'){
            this.hotCities = data.resultData.hotCities
            this.cities = data.resultData.cities
            this.isOpen = !$.isEmptyObject(this.cities)
            this.hasCity = !$.isEmptyObject(this.cities)
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 城市搜索
       */
      searchCity (cityName) {
        this.$store.commit('UPDATE_LOADING', true)
        this.showHotList = !cityName
        this.cities = {};
        let resource;
        if(this.source){
          resource = api.cityLineRegionFindByKeyword(this.source, cityName, this.productTypeLevelOne, this.productTypeLevelTwo);
        }else{
          resource = api.cityStartupRegionFindByKeyword(cityName, this.productTypeLevelOne, this.productTypeLevelTwo);
        }

        resource.then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          let data = TOOL.toJson(res.data)
          if(data.resultCode === '0'){
            this.cities = data.resultData
            this.hasCity = !$.isEmptyObject(this.cities)
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
        this.cities = Object.assign({}, this.cities);
      },

      /**
       *  设置选中的城市值
       *  @value 城市名称
       */
      setCity (value) {
        let localData = {}
        if(appStorage.get(this.fromPage)){
          localData = JSON.parse(appStorage.get(this.fromPage))
        }
        localData[this.placeType] = value
        appStorage.set(this.fromPage, JSON.stringify(localData))
        this.$router.go(-1)
      }

    }
  }
</script>
