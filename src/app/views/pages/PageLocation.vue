<template>
  <main-box :title="title" main-class="scrollingBox" :show-more="!isUndunionApp">
    <div class="city-s-top">
      <search-address @searchCity="searchCity"></search-address>
      <div class="city-top-box" v-show="showHotList">
        <p class="dw-tit">根据您的定位推荐</p>
        <div class="default-city clearfix">
          <a v-text="appCity" @click="setCity(appCity)"></a>
        </div>
        <p class="hot-tit" v-show="false">热门城市</p>
        <ul class="hot-city" v-show="false">
          <li v-for="hotCity in allCityList.hot" @click="setCity(hotCity)">
            <a v-text="hotCity"></a>
          </li>
        </ul>
      </div>
    </div>
    <city-list :list-data="cityLists" type="cityName" @setValue="setCity"></city-list>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import SearchAddress from 'appComponents/searchAddress/index.vue'
  import CityList from 'appComponents/cityList/index.vue'

  import allCity from '../../../utils/allCity'
  import { mapState } from 'vuex'

  const citys = allCity.cityData.cityLists

  export default {
    components: {
      MainBox,
      SearchAddress,
      CityList,
    },
    data () {
      return {
        title: this.$route.meta.title,
        isUndunionApp: TOOL.browser().undunion_app,
        allCityList: allCity.cityData, //城市数据
        cityLists: citys,   //城市搜索列表
        showHotList: true, //热门城市显示
        placeType: '' //地点类型
      }
    },
    mounted () {
      this.placeType = this.$route.query.placeType
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      })
    },
    methods: {

      /**
       * 城市搜索
       */
      searchCity (cityName) {
        this.showHotList = !cityName
        this.cityLists = [];
        for (let i in citys) {
          if (citys.hasOwnProperty(i)) {
            let arr = [];
            for (let m = 0; m < citys[i].length; m++) {
              let lower = cityName.toLowerCase();
              if (citys[i][m].name.indexOf(cityName) > -1
                || citys[i][m].allSpell.toLowerCase().indexOf(lower) > -1
                || citys[i][m].firtSpell.toLowerCase().indexOf(lower) > -1) {
                arr.push(citys[i][m]);
              }
            }
            if (arr.length > 0) {
              this.cityLists[i] = arr
            }
          }
        }
        this.cityLists = Object.assign({}, this.cityLists);
      },

      /**
       *  设置选中的城市值
       *  @value 城市名称
       */
      setCity (value) {
        let name = value.name || value
        appStorage.set(this.placeType, name)
        this.$router.go(-1)
      }
    }
  }
</script>
