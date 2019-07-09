<template>
	<main-box :title="title" main-class="scrollingBox">
		<div class="city-s-top">
			<search-address @searchCity="searchCity"></search-address>
			<div class="city-top-box" v-show="showHotList">
				<p class="dw-tit">根据您的定位推荐</p>
				<div class="default-city clearfix">
					<a v-text="appCity" @click="setCity(appCity)"></a>
				</div>
				<!--<p class="hot-tit" v-show="false">热门城市</p>-->
				<!--<ul class="hot-city" v-show="false">-->
					<!--<li v-for="hotCity in allCityList.hot" @click="setCity(hotCity)">-->
						<!--<a v-text="hotCity"></a>-->
					<!--</li>-->
				<!--</ul>-->
			</div>
		</div>
		<city-list :list-data="cityLists" type="city" @setValue="setCity"></city-list>
	</main-box>
</template>
<script>
	import MainBox from 'components/mainBox/index.vue'
	import SearchAddress from 'appComponents/searchAddress/index.vue'
	import CityList from 'appComponents/cityList/index.vue'

//	import allCity from '../../../utils/allCity'
	import { mapState } from 'vuex'

//	const citys = allCity.cityData.cityLists

	export default {
		components: {
			MainBox,
			SearchAddress,
			CityList,
		},
		data () {
			return {
				title: this.$route.meta.title,
				page: '',
				cityListTemp: [],
				cityLists: [],
				showHotList: false,
				placeType: '',
				expressProduct: {},
				expressProductdeta: {}
			}
		},
		mounted () {
			this.placeType = this.$route.query.placeType
			this.page = this.$route.query.page
			this.expressProduct = JSON.parse(appStorage.get(this.page))
			if(this.placeType === "startPlace") {
				this.defaultCity()
			}else{
				this.expressCityFetch(this.expressProduct.productId)
				this.getexpressProductdeta(this.expressProduct.productId)
			}
		},
		computed: {
			...mapState({
				appCity: state => state.city.appCity,
			})
		},
		methods: {
			defaultCity() {
				api.expressCityFind().then(res => {
					let data = TOOL.toJson(res.data)
					if(data.resultCode === '0') {
						this.cityLists = data.resultData.cities;
						this.cityListTemp = JSON.parse(JSON.stringify(this.cityLists));
						this.expressProducts = data.resultData.expressProducts;
					}else{
						this.$store.dispatch('showError', data.resultMsg);
					}
				})
			},
			expressCityFetch(id) {
				api.expressCityFetch({"productId": id}).then(res => {
					let data = TOOL.toJson(res.data)
					if(data.resultCode === '0') {
						this.cityLists = data.resultData.cities;
            this.cityListTemp = JSON.parse(JSON.stringify(this.cityLists));
					}
				})
			},
			getexpressProductdeta(id) {
				api.expressProductdeta(id).then(res => {
					let data = TOOL.toJson(res.data)
					if(data.resultCode === '0') {
						this.expressProductdeta = data.resultData;
					}
				})
			},
			/**
			 * 城市搜索
			 */
			searchCity (cityName) {
        this.cityLists = {}
				if(cityName) {
					let citys = JSON.parse(JSON.stringify(this.cityListTemp));
					for (let i in citys) {
						if (citys.hasOwnProperty(i)) {
							let arr = [];
							for (let m = 0; m < citys[i].length; m++) {
								if (citys[i][m].indexOf(cityName) > -1) {
									arr.push(citys[i][m]);
								}
							}
							console.log(arr)
							if(arr.length) {
                this.cityLists[i] = arr
							}
						}
					}
					console.log(this.cityLists)
				}else{
          this.cityLists = JSON.parse(JSON.stringify(this.cityListTemp));
        }
			},

			/**
			 *  设置选中的城市值
			 *  @value 城市名称
			 */
			setCity (value) {
				let that = this;
				if(this.placeType === "startPlace") {
					if(this.expressProducts) {
						this.expressProducts.forEach(function(data) {
							if(data.aAddress.city === value ||
									data.aAddress.county === value ||
									data.aAddress.town === value) {
								that.expressProduct.productId= data.id;
								that.expressProduct.chargeMethod= data.chargeMethod;
								that.expressProduct.notice = data.notice;
							}
						})
					}
				}else{
					if(this.expressProductdeta.bAddresses) {
						this.expressProductdeta.bAddresses.forEach(function(data) {
							let cityCounty = data.city ;
							if(data.county) {
								cityCounty = data.county;
							}
							if(value === cityCounty) {
								that.expressProduct.bAddress = {
									city: data.city,
									cityCode: data.cityCode,
									county: data.county,
									countyCode: data.countyCode
								};
							}
						})
					}
				}
        appStorage.set(this.placeType, value);
        appStorage.set(this.page, JSON.stringify(this.expressProduct))
				this.$router.go(-1)
			}
		}
	}
</script>
