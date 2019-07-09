<template>
  <main-box :title="title" main-class="scrollingBox" :show-more="!isUndunionApp">
    <div class="container-map">
      <div>
        <div class="box-input">
          <div class="city-search line line-x-b">
            <div class="pull-left" @click="jumpToLocalCity">
              <i></i>
              <span class="place" v-text="searchCity"></span>
              <span class="border vux-1px-r"></span>
            </div>
            <input type="text" v-model="searchAddress" placeholder="请输入您的地址"/>
            <div class="cha" @click.prevent="clearSearch" v-show="searchAddress"></div>
          </div>
        </div>
        <my-address :info-type="infoType" :set-myaddress="setMyaddress"></my-address>
      </div>
      <div class="box-station">
        <ul class="address-list" v-if="stationList.length">
          <li class="line line-x-b"
              v-for="stationAddress in stationList"
              @click="setStation(stationAddress)">
            <p class="building" v-text="stationAddress.title">希顿国际-A座</p>
            <p class="road" v-text="stationAddress.address">四川省成都市武侯区萃华路</p>
          </li>
        </ul>
        <div class="empty" v-if="showText" v-text="warningText"></div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import MyAddress from 'appComponents/myAddress/index.vue'
  import {setStation1, setStation2} from './setStation'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      MyAddress
    },
    data () {
      return {
        title: this.$route.meta.title,
        stationList: [],
        address1: '',
        address2: '',
        infoType: 'show',
        addressCity:'',
        fromPage: '', // 返回界面路由、本地存储key
        dataType:'', // 接驳修改字段
        dataKey: '', // 站点类型 onStation, offStation
        productId: '', // 产品id
        serviceType: '',
        searchCity: '', // 搜索当前城市
        searchAddress: '', // 首次检索地点
        warningText: '',
        showText: true,
        isUndunionApp: TOOL.browser().undunion_app
      }
    },
    props: {
      // 是否允许修改城市
      changeCityAllowed: {
        type: Boolean,
        default: true
      },
      setStationType: {
        type: Number,
        default: 1
      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
        appAddress: state => state.city.appAddress,
      }),
    },
    watch: {
      //定位城市初始化赋值
      appCity (newVal, val) {
        if(this.fromPage !== 'carpoolingSelf' && this.changeCityAllowed){
          this.searchCity = newVal
        }
      },
      appAddress (newVal) {
        if(newVal.street &&
          newVal.street !== TOOL.locationFail &&
          this.dataKey !== 'offStation' &&
          this.dataKey !== 'bAddress' &&
          this.fromPage !== 'applyCharter' &&
          this.fromPage !== 'carpoolingSelf' &&
          this.changeCityAllowed){
          this.searchAddress = newVal.detailAddress
        }
      },
      searchAddress (newVal) {
        this.localSearchAddress(newVal)
      }
    },
    mounted () {
      this.fromPage = this.$route.query.fromPage;
      this.dataType = this.$route.query.dataType;
      this.dataKey = this.$route.query.dataKey;
      this.productId = this.$route.query.productId;
      this.searchCity = this.$route.query.searchCity;
      this.searchAddress = this.$route.query.searchAddress;
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne;
      this.feederId = this.$route.query.feederId;
      this.serviceType = this.$route.query.serviceType;

      this.addressCity = this.$route.query.addressCity
      if (this.$route.query.infoType) {
        this.infoType = this.$route.query.infoType
      }

      //未登录
      if (!appStorage.get('X-Auth-Token')) {
        this.infoType = 'hide'
      }

      /**
       * 从本地获取修改的城市
       * b地地址及定制包车地址不需要定位到街道
       */
      if(this.changeCityAllowed) {
        if (appStorage.get('CURRENTCITY')) {
          this.searchCity = appStorage.get('CURRENTCITY')
        } else {
          if(this.fromPage === 'carpoolingSelf'){
            this.searchCity = this.addressCity
          }else{
            this.searchCity = this.appCity
          }
          if (this.appAddress &&
            this.appAddress !== TOOL.locationFail &&
            this.appAddress.street &&
            this.dataKey !== 'offStation' &&
            this.dataKey !== 'bAddress' &&
            this.fromPage !== 'applyCharter' &&
            this.fromPage !== 'carpoolingSelf') {
            this.searchAddress = this.appAddress.detailAddress
          }
        }
      }

    },
    created() {
      this.getAddress();
    },
    methods: {
      /**
       * 清除搜索框
       */
      clearSearch () {
          this.searchAddress = '';
      },
      /**
       * 搜索具体位置
       */
      localSearchAddress (newVal) {
        let _this = this;
        this.showText = true
        this.stationList = []
        this.warningText = '请输入地址进行搜索'
        let local = new BMap.LocalSearch(this.searchCity, {
          onSearchComplete: function (LocalResult) {
            _this.$store.commit('UPDATE_LOADING', false)
            if (local.getStatus() === BMAP_STATUS_SUCCESS) {
              _this.showText = false
              for (let i = 0; i < LocalResult.getCurrentNumPois(); i ++){
                _this.stationList.push(LocalResult.getPoi(i))
              }
            } else {
              _this.warningText = '未查询到您输入的地址，请重新搜索'
              _this.stationList = []
            }
          }
        })
        if (newVal) {
          this.warningText = '正在努力搜索...'
          this.$store.commit('UPDATE_LOADING', true)
          local.search(newVal, {forceLocal: true})
        }
      },

      /**
       * 将后台地址转换成百度地图格式
       */
      toBdAddress (address) {
        if (!address) {
          return ''
        }
        return {
          province: address.province,
          city: address.city,
          address: address.county,
          title: address.detailAddress,
          point: {
            lat: address.latitude,
            lng: address.longitude
          }
        }
      },

      /**
       * 更改定位城市
       */
      jumpToLocalCity () {
        if(this.changeCityAllowed) {
          this.searchAddress = ''
          this.stationList = []
          this.$router.push({
            name: 'pageLocation',
            query: {placeType: 'CURRENTCITY'}
          })
        }
      },

      /**
       * 获取常用地址
       */
      getAddress () {
        api.userGetCommonAddressOne().then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.address1 = data.resultData;
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        });
        api.userGetCommonAddressTwo().then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.address2 = data.resultData;
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        });
      },

      /**
       * 设置站点
       * @param value 站点名称坐标等信息
       */
      setStation (value) {
        if(this.setStationType === 1) {
          setStation1(value, this);
        } else {
          setStation2(value, this);
        }
      },

      /**
       * 设置我的地址信息
       */
      setMyaddress (infoAddress) {
        if (infoAddress && infoAddress.city) {
          if(infoAddress.city.indexOf(this.searchCity) === -1 ){
            this.$store.dispatch('showError', '您选择的地址不再当前城市，请重新选择');
            return
          }
          infoAddress = this.toBdAddress(infoAddress);
          this.setStation(infoAddress)
        } else {
          this.$router.push({name: 'setInfo'})
        }
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "../../styles/theme.less";
  .box-input{
    height:100px;
    background-color:#F3F2F0;
    border-radius:0;
  }
  .city-search {
    height: 90px;
    background-color: @c-fff;
    i {
      display: block;
      width: 22px;
      height: 28px;
      float: left;
      margin-left: 20px;
      margin-top: 30px;
      background: url("../../assets/map_no.png") no-repeat;
      background-size: 100%;
    }
    .place {
      display: block;
      float: left;
      font-size: 28px;
      color: #323232;
      margin-left: 5px;
      height: 90px;
      line-height: 90px;
    }
    .border {
      display: block;
      float: left;
      height: 40px;
      width: 1PX;
      margin-top: 25px;
      margin-left: 20px;
      border-left: 1PX solid @bc-e5e5e5;
    }
    input {
      position: absolute;
      top: 0;
      left: 175px;
      float: left;
      width: 390px;
      padding: 20px 0;
      line-height: 50px;
      font-size: 28px;
      border: 0;
    }
    .cha {
      position: absolute;
      right: 0;
      top: 0;
      width: 62px;
      height: 100%;
      background: url("../../assets/cha.png") no-repeat center;
      background-size: 26px 26px;
    }
  }
  .address-list li{
    padding:30px 30px 30px 90px;
    background:url("../../assets/map_no.png") no-repeat 30px center;
    background-size: 22px 28px;
    .building{
      line-height:32px;
      margin-bottom:8px;
      font-size:28px;
      color:@c-121212;
    }
    .road{
      font-size:24px;
      color:#999;
    }
  }
</style>
