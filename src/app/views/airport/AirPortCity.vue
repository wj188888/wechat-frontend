<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="city-s-top">
      <search-address @searchCity="searchCity"></search-address>
      <ul class="area-type" :class="{'area-gj': type == 1}">
        <li :class="{'active': type == 0}" @click="setType(0)">国内城市</li>
        <li :class="{'active': type == 1}" @click="setType(1)">国际城市</li>
      </ul>
    </div>
    <city-list :show="hasCity" :list-data="cities" type="airportName" @setValue="setCity"></city-list>
    <no-result :show="!hasCity" :text="noResultText"></no-result>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import SearchAddress from 'appComponents/searchAddress/index.vue'
  import CityList from 'appComponents/cityList/index.vue'
  import NoResult from 'appComponents/noResult/index.vue'

  import flightGn from '../../../utils/flightGn'
  import flightGj from '../../../utils/flightGj'
  const cityGn = flightGn.flightList
  const cityGj = flightGj.flightList

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
        pageRouter: '',
        dataKey: '',
        cities: cityGn,
        type: 0,
        hasCity: true,
        noResultText:'<p>对不起</p><p>该地方暂未开通</p>'
      }
    },
    mounted () {
      this.pageRouter = this.$route.query.pageRouter
      this.dataKey = this.$route.query.dataKey
    },
    methods: {

      /**
       * 设置国际国内类型
       */
      setType (type) {
        this.type = type
        this.cities = !type ? cityGn : cityGj
      },

      /**
       * 城市搜索
       */
      searchCity (cityName) {
        let citys = !this.type ? cityGn : cityGj
        this.cities = {};
        for (let i in citys) {
          if (citys.hasOwnProperty(i)) {
            let arr = [];
            for (let m = 0; m < citys[i].length; m++) {
              let lower = cityName.toLowerCase();
              if (citys[i][m].airportName.indexOf(cityName) > -1
                || citys[i][m].airportPy.toLowerCase().indexOf(lower) > -1
                || citys[i][m].airportPyShort.toLowerCase().indexOf(lower) > -1) {
                arr.push(citys[i][m]);
              }
            }
            if (arr.length > 0) {
              this.cities[i] = arr
            }
          }
        }
        this.cities = Object.assign({}, this.cities)
        this.hasCity = !$.isEmptyObject(this.cities)
      },

      /**
       * 设置选中的城市
       */
      setCity (airPort) {
        if (appStorage.get(this.pageRouter)) {
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          localData[this.dataKey] = airPort
          appStorage.set(this.pageRouter, JSON.stringify(localData))
          this.$router.go(-1)
        }
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .area-type{
    position:relative;
    padding-bottom:3PX;
    overflow:hidden;
    &:after{
       content:"";
       position:absolute;
       left:0;
       bottom:0;
       display:block;
       width:50%;
       border-bottom: 3PX solid #37aefc;
       transition:all .3s;
     }
    &.area-gj:after{
       left:50%;
    }
    li{
      float:left;
      width:50%;
      height:60px;
      line-height:60px;
      color:#3A3E41;
      font-size:28px;
      text-align:center;
      &.active{
         color: #37aefc;
       }
    }
  }
</style>
