<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="city-s-top"  v-if="isOpen">
      <search-address @searchCity="searchCity"></search-address>
	    <div class="city-list-box" :show="isOpen && hasCity">
		    <div class="city-list-scroll">
			    <ul class="city-zm">
				    <li class="city-zm-li">
					    <ul class="city-zm-list">
						    <li v-for="(value, index) in hotCities" @click="setCity(value)">
							    <span>{{value}}</span>
						    </li>
					    </ul>
				    </li>
			    </ul>
		    </div>
	    </div>
      </div>
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
        cities: '', //城市数据
        page: '', //返回界面路由、本地存储key
        source: '',//出发地
        isOpen: true,
        hasCity: true,
        noResultText:'<p>对不起</p><p>该地方暂未开通</p>',
	    expressCity: '',//小件快运城市数据
	    hotCities: ''
      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      })
    },
    mounted () {
      this.page = this.$route.query.page
      this.source = this.$route.query.source
      this.findCityList()
    },
    methods:{

      /**
       * 城际专线查询城市及热门城市列表
       */
      findCityList () {
        let resource;
        this.$store.commit('UPDATE_LOADING', true)

	      api.expressProductFind({aCity: this.source}).then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          let data = TOOL.toJson(res.data)
          if(data.resultCode == '0'){
	          let cities = [];
            if(data.resultData) {
              if(data.resultData.lineThemes && data.resultData.lineThemes.length > 0) {
                  this.expressCity = data.resultData;
                for(let value of data.resultData.lineThemes) {
                  cities.push(value.bAddress);
                }
                this.hotCities = cities;
                this.isOpen = !$.isEmptyObject(this.hotCities);
                this.hasCity = !$.isEmptyObject(this.hotCities);
              }
            }else{
              this.isOpen = false;
              this.hasCity = false;
            }
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

	      api.expressProductFind({aCity: this.source}).then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          let data = TOOL.toJson(res.data)
          if(data.resultCode == '0'){
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
            let expressData = '';
        	for(let express of this.expressCity.lineThemes) {
        		if(express.bAddress == value) {
			        expressData = express;
		        }
	        }
        appStorage.set(this.page, JSON.stringify({
		        themeProductId: expressData.productId,
		        endPlace: expressData.bAddress,
		        pickUpFee: this.expressCity.pickUpFee,
		        payPickUpFeeOnOrder: this.expressCity.payPickUpFeeOnOrder,
		        productId: this.expressCity.id,
            notice: this.expressCity.notice
	        }))
        this.$router.go(-1)
      }

    }
  }
</script>
<style lang="less" scoped>
	@import "../../../styles/theme.less";
	.city-list-box{
			position:relative;
			font-size:28px;
			background-color: @c-fff;
			overflow:hidden;
			.city-zm-li{
			p{
				height:80px;
				line-height:80px;
				padding:0 20px;
				color: @c-ff6600;
				background:#f2f2f2;
			}
			}
			.city-zm-list li{
				height:86px;
				line-height:86px;
				padding:0 20px;
				color:#4d4d4d;
				border-bottom:1PX solid #e1e1e1;
			.city-name{
				font-size:30px;
				color:#121212;
				margin-right:28px;
			}
			.station-name{
				font-size:26px;
			}
		}
	}
</style>
