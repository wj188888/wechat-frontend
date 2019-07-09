<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="pad-b-200">
      <div v-if="specialDatas.length">
        <ticket-title :title="specialTitle"></ticket-title>
        <div class="bg-fff line line-x-t line-x-b" v-for="data in specialDatas" @click="jumptoSpecialOrder(data)">
          <div class="list-nav">
            <span class="car-icon"></span>
            <span class="time">{{data.aAddress.city || data.aAddress.county}} - {{data.bAddress.city || data.bAddress.county}}</span>
            <span class="orange">{{data.integralPrice}}积分</span>
            <span class="blue-start">起</span>
          </div>
        </div>
        <a class="button button-empty-white button-no-radius button-more"
           v-if="specialTotalDatas.length > 3 && specialDatas.length !== specialTotalDatas.length"
           @click="getMoreProduct('special')">查看更多</a>
      </div>

      <div v-if="expressDatas.length">
        <ticket-title :title="expressTitle"></ticket-title>
        <ul>
          <li class="score-ticket-box line line-x-t" v-for="data in expressDatas" @click="jumptoExchangeProductSku(data)">
            <div class="order-box">
              <div class="start clearfix">
                <span class="circle circle-bg-start">始</span>
                <span class="place">{{data.aAddress | getAddressTitle}}</span>
                <div class="price">
                  <p class="number"><em>{{data.integralPrice}}积分</em> 起</p>
                  <p class="fix-time">提供多车型选择</p>
                </div>
              </div>
              <div class="end clearfix">
                <span class="circle circle-bg-end">终</span>
                <span class="place">{{data.bAddress | getAddressTitle}}</span>
              </div>
            </div>
          </li>
        </ul>
        <a class="button button-empty-white button-no-radius button-more line line-x-t"
           v-if="expressTotalDatas.length > 3 && expressDatas.length !== expressTotalDatas.length"
           @click="getMoreProduct('express')">查看更多</a>
      </div>

      <div v-if="stationDatas.length">
        <ticket-title :title="stationTitle"></ticket-title>
        <ul>
          <li class="score-ticket-box line line-x-t" v-for="data in stationDatas" @click="jumptoExchangeProductSku(data)">
            <div class="order-box">
              <div class="start clearfix">
                <span class="circle circle-bg-start">始</span>
                <span class="place">{{data.aAddress | getAddressTitle}}</span>
                <div class="price">
                  <p class="number"><em>{{data.integralPrice}}积分</em> 起</p>
                  <p class="fix-time">提供多车型选择</p>
                </div>
              </div>
              <div class="end clearfix">
                <span class="circle circle-bg-end">终</span>
                <span class="place">{{data.bAddress | getAddressTitle}}</span>
              </div>
            </div>
          </li>
        </ul>
        <a class="button button-empty-white button-no-radius button-more line line-x-t"
           v-if="stationTotalDatas.length > 3 && stationDatas.length !== stationTotalDatas.length"
           @click="getMoreProduct('station')">查看更多</a>
      </div>

      <div v-if="tourDatas.length">
        <ticket-title :title="tourTitle"></ticket-title>
        <ul>
          <li class="score-ticket-box line line-x-t" v-for="data in tourDatas" @click="jumptoExchangeProductSku(data)">
            <div class="order-box">
              <div class="start clearfix">
                <span class="circle circle-bg-start">始</span>
                <span class="place">{{data.aAddress | getAddressTitle}}</span>
                <div class="price">
                  <p class="number"><em>{{data.integralPrice}}积分</em> 起</p>
                  <p class="fix-time">提供多车型选择</p>
                </div>
              </div>
              <div class="end clearfix">
                <span class="circle circle-bg-end">终</span>
                <span class="place">{{data.bAddress | getAddressTitle}}</span>
              </div>
            </div>
          </li>
        </ul>
        <a class="button button-empty-white button-no-radius button-more line line-x-t"
           v-if="tourTotalDatas.length > 3 && tourDatas.length !== tourTotalDatas.length"
           @click="getMoreProduct('tour')">查看更多</a>
      </div>

      <no-result class="score-empty-box" :show="showEmpty && (!specialDatas.length && !expressDatas.length && !stationDatas.length && !tourDatas.length)" text="全都被兑换空了-。-">
        <img class="empty-pic" src="../../../../assets/score/no_hot_product.png"/>
      </no-result>
    </div>
    <div slot="footer">
      <div class="sight-search">
        <ul>
          <li :class="{
              'active': searchPop.showSumPop,
              'has-dot': aAddress.length > 0 && aAddress[0] != '不限' ||
      bAddress.length > 0 && bAddress[0] != '不限'}"
              @click="openSearchPop('showSumPop')">
            <p class="icon-s icon-s-sum"></p>
            <p>综合筛选</p>
          </li>
          <li :class="{'active': searchPop.showSortPop, 'has-dot': order}" @click="openSearchPop('showSortPop')">
            <p class="icon-s icon-s-price"></p>
            <p>积分排序</p>
          </li>
        </ul>
      </div>
      <!-- 综合筛选 -->
      <group>
        <popup v-model="searchPop.showSumPop">
          <div class="sum-content">
            <div class="sum-operation clearfix">
              <a class="pull-left" @click="searchPop.showSumPop = false">取消</a>
              <a class="pull-right" @click="searchBykeyWords">确定</a>
            </div>
            <div class="sum-condition">
              <div class="sum-con-left">
                <ul>
                  <li @click="sumSearchType(1)" class="clearfix"
                      :class="{'active': showAaddressSearch, 'has-dot': aAddress.length > 0 && aAddress[0] !== '不限'}">
                    出发城市
                  </li>
                  <li @click="sumSearchType(2)" class="clearfix"
                      :class="{'active': !showAaddressSearch, 'has-dot': bAddress.length > 0 && bAddress[0] !== '不限' }">
                    到达城市
                  </li>
                </ul>
              </div>
              <div class="sum-con-right">
                <ul v-if="showAaddressSearch">
                  <li class="li-item" @click="checkACityAll">
                    <label>
                      不限
                      <input class="hide" type="checkbox" v-model="aAddress" value="不限"/>
                      <i class="choose-type"></i>
                    </label>
                  </li>
                  <li class="li-item"
                      @click="checkACityOne(source, aAddressList.length)"
                      v-for="(source, index) in aAddressList"
                      :key="index">
                    {{source}}
                    <input class="hide" type="checkbox" v-model="aAddress" :value="source"/>
                    <i class="choose-type"></i>
                  </li>
                </ul>
                <ul v-if="showBaddressSearch">
                  <li class="li-item" @click="checkBCityAll">
                    <label>
                      不限
                      <input class="hide" type="checkbox" v-model="bAddress" value="不限"/>
                      <i class="choose-type"></i>
                    </label>
                  </li>
                  <li class="li-item"
                      @click="checkBCityOne(source, bAddressList.length)"
                      v-for="(source, index) in bAddressList"
                      :key="index">
                    {{source}}
                    <input class="hide" type="checkbox" v-model="bAddress" :value="source"/>
                    <i class="choose-type"></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </popup>
      </group>

      <!-- 综合排序筛选 -->
      <group>
        <popup v-model="searchPop.showSortPop">
          <div class="sum-content">
            <div class="sum-operation clearfix">
              <a class="pull-left" @click="searchPop.showSortPop = false">取消</a>
              <a class="pull-right" @click="searchBykeyWords">确定</a>
            </div>
            <div class="day-condition">
              <div class="sum-con-right">
                <ul>
                  <li class="li-item" @click="order = 0">
                  积分由低到高
                  <input class="hide" type="radio" v-model="order" value="0"/>
                    <i class="choose-type"></i>
                  </li>
                  <li class="li-item" @click="order = 1">
                    积分由高到低
                    <input class="hide" type="radio" v-model="order" value="1"/>
                    <i class="choose-type"></i>
                  </li>
                  <li class="li-item" @click="order = 2">
                    只看我能兑换的
                    <input class="hide" type="radio" v-model="order" value="2"/>
                    <i class="choose-type"></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </popup>
      </group>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import TicketTitle from 'appComponents/title/ticketTitle'
  import NoResult from 'appComponents/noResult/index'
  import { Group, Popup } from 'vux'

  import checkLogin from 'mixins/checkLogin'

  export default {
    components: {
      MainBox,
      TicketTitle,
      NoResult,
      Group,
      Popup,
    },
    mixins: [checkLogin],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$router.name,
        specialTitle:'',
        specialProductTypeLevelTwo: '',
        specialDatas:[],
        specialTotalDatas: [],

        expressTitle:'',
        expressProductTypeLevelTwo: '',
        expressDatas:[],
        expressTotalDatas: [],

        stationTitle:'',
        stationProductTypeLevelTwo: '',
        stationDatas:[],
        stationTotalDatas: [],

        tourTitle: '',
        tourProductTypeLevelTwo: '',
        tourDatas:[],
        tourTotalDatas: [],

        showEmpty: false,

        searchKeys: {
          exchangeType: 0, // 兑换类型 0：兑换产品，1：积分抵现
          integralPrice: '',
          productTypeLevelOne: '',
          productTypeLevelTwo: '',
          aAddress: '',
          bAddress: '',
          integralSort: '', // 积分排序 0（默认）：升序，1：降序
          pageNo: 0,
          pageSize: 100
        },

        showNoResult: false,
        myScore: 0,

        searchPop: {
          showSumPop: false,
          showSortPop: false
        },

        showAaddressSearch: true, //综合搜索的人群
        showBaddressSearch: false,

        aAddress: ['不限'],
        aAddressList:[],
        bAddress: ['不限'],
        bAddressList:[],
        order: 0
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        if(appStorage.get('userInfo')){
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.myScore = usrInfo.points || 0
        }
        if (appStorage.get(this.pageRouter)) {
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          this.aAddress = localData.aAddress
          this.bAddress = localData.bAddress
          this.order = localData.order
          this.setSearchKeysByOrder()
        }
        this.productTypeLevelOne = this.$route.query.productTypeLevelOne
        this.getProductDataByType()
        this.getLineAddress()
      },

      getLineAddress () {
        this.$store.commit('UPDATE_LOADING', true)
        api.getLineAddress(this.productTypeLevelOne).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.aAddressList = data.resultData.aAddressSet
            this.bAddressList = data.resultData.bAddressSet
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      getProductDataByType () {
         switch (this.productTypeLevelOne) {
           case 'CITY_BUS':
             this.specialTitle = TOOL.CITY_SPECIAL_BUS
             this.expressTitle = TOOL.CITY_EXPRESS_BUS
             this.stationTitle = TOOL.STATION_BUS
             this.specialProductTypeLevelTwo = 'CITY_SPECIAL_BUS'
             this.expressProductTypeLevelTwo = 'CITY_EXPRESS_BUS'
             this.stationProductTypeLevelTwo = ''
             break;
           case 'AIRPORT_BUS':
             this.specialTitle = TOOL.AIRPORT_SPECIAL_BUS
             this.expressTitle = TOOL.AIRPORT_EXPRESS_BUS
             this.specialProductTypeLevelTwo = 'AIRPORT_SPECIAL_BUS'
             this.expressProductTypeLevelTwo = 'AIRPORT_EXPRESS_BUS'
             break;
           case 'TRAIN_STATION_BUS':
             this.specialTitle = TOOL.TRAIN_SPECIAL_BUS
             this.expressTitle = TOOL.TRAIN_EXPRESS_BUS
             this.specialProductTypeLevelTwo = 'TRAIN_SPECIAL_BUS'
             this.expressProductTypeLevelTwo = 'TRAIN_EXPRESS_BUS'
             break;
           case 'SCHOOL_BUS':
             this.specialTitle = TOOL.SCHOOL_SPECIAL_BUS
             this.expressTitle = TOOL.SCHOOL_EXPRESS_BUS
             this.specialProductTypeLevelTwo = 'SCHOOL_SPECIAL_BUS'
             this.expressProductTypeLevelTwo = 'SCHOOL_EXPRESS_BUS'
             break;
           case 'SCENIC_BUS':
             this.specialTitle = TOOL.SCENIC_SPECIAL_BUS
             this.expressTitle = TOOL.SCENIC_EXPRESS_BUS
             this.specialProductTypeLevelTwo = 'SCENIC_SPECIAL_BUS'
             this.expressProductTypeLevelTwo = 'SCENIC_EXPRESS_BUS'
             break;
           case 'TOUR_BUS':
             this.tourTitle = '旅游度假'
             this.tourProductTypeLevelTwo = 'TOUR_SCENIC'
         }

         if(this.productTypeLevelOne !== 'TOUR_BUS'){
           this.getSpecialProduct ()
           this.getExpressProduct ()
           if(this.productTypeLevelOne === 'CITY_BUS'){
             this.getStationProduct ()
           }
         }else{
           this.getTourProduct ()
         }
      },

      getSpecialProduct () {
        let searchKeys = this.copySearchKeys('special')
        this.findExProduct(searchKeys, 'special')
      },

      getExpressProduct () {
        let searchKeys = this.copySearchKeys('express')
        this.findExProduct(searchKeys, 'express')
      },

      getStationProduct () {
        let searchKeys = Object.assign({}, this.searchKeys)
        searchKeys.productTypeLevelOne = 'STATION_BUS'
        searchKeys.productTypeLevelTwo = this.stationProductTypeLevelTwo
        this.findExProduct(searchKeys, 'station')
      },

      getTourProduct () {
        let searchKeys = this.copySearchKeys('tour')
        this.findExProduct(searchKeys, 'tour')
      },

      copySearchKeys (type) {
        let searchKeys = Object.assign({}, this.searchKeys)
        searchKeys.productTypeLevelOne = this.productTypeLevelOne
        searchKeys.productTypeLevelTwo = this[type + 'ProductTypeLevelTwo']
        return searchKeys
      },

      findExProduct (searchKeys, type) {
        this.$store.commit('UPDATE_LOADING', true)
        api.findExProduct(searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.showEmpty = true
            this[type + 'TotalDatas'] = data.resultData.content
            if(this[type + 'TotalDatas'] && this[type + 'TotalDatas'].length){
              this[type + 'Datas'] = this[type + 'TotalDatas'].slice(0, 3)
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      getMoreProduct (type) {
        this[type + 'Datas'] = this[type + 'TotalDatas']
      },

      /**
       * 选择不限
       */
      checkAll (key) {
        this[key] = ['不限']
      },

      /**
       * 选择单个
       */
      checkOne (key, item, len) {
        if ($.inArray(item, this[key]) > -1) {
          let index = this[key].indexOf(item)
          this[key].splice(index, 1)
        } else {
          this[key].push(item)
        }

        //一个都没选默认勾选不限，勾选了选项则去掉勾选不限
        if (this[key].length === 0) {
          this[key] = ['不限']
        } else {
          if ($.inArray('不限', this[key]) > -1) {
            let index = this[key].indexOf('不限')
            this[key].splice(index, 1)
          }
        }
      },

      /**
       * A地城市不限
       */
      checkACityAll () {
        this.checkAll('aAddress')
      },

      /**
       * A地城市单选
       */
      checkACityOne (item, len) {
        this.checkOne('aAddress', item, len)
      },

      /**
       * B地城市不限
       */
      checkBCityAll () {
        this.checkAll('bAddress')
      },

      /**
       * B地城市单选
       */
      checkBCityOne (item, len) {
        this.checkOne('bAddress', item, len)
      },

      /**
       * 搜索弹窗控制
       * @param type showSumPop为综合筛选，showSortPop为排序筛选
       */
      openSearchPop (type) {
        for (let i in this.searchPop) {
          this.searchPop[i] = false
          this.searchPop[type] = true
        }

      },

      /**
       * 综合搜索
       * @param type
       */
      sumSearchType (type) {
        if (type === 1) {
          this.showAaddressSearch = true
          this.showBaddressSearch = false
        } else if (type === 2) {
          this.showAaddressSearch = false
          this.showBaddressSearch = true
        }
      },

      saveSearchForm () {
        let saveData = {}
        saveData.aAddress = this.aAddress
        saveData.bAddress = this.bAddress
        saveData.order = this.order
        appStorage.set(this.pageRouter, JSON.stringify(saveData))
      },

      /**
       * 按查询条件搜索
       */
      setSearchKeysByOrder () {
        if(this.order !== 2){
          this.searchKeys.integralSort = this.order
          this.searchKeys.integralPrice = ''
        }else{
          this.searchKeys.integralSort = 0
          this.searchKeys.integralPrice = this.myScore
        }

        if ($.inArray('不限', this.aAddress) > -1) {
          this.searchKeys.aAddress = ''
        } else {
          this.searchKeys.aAddress = this.aAddress.join(',')
        }

        if ($.inArray('不限', this.bAddress) > -1) {
          this.searchKeys.bAddress = ''
        } else {
          this.searchKeys.bAddress = this.bAddress.join(',')
        }
      },

      searchBykeyWords () {
        this.saveSearchForm()
        this.setSearchKeysByOrder()
        this.searchPop = {
          showSumPop: false,
          showSortPop: false
        }
        this.searchKeys.pageNo = 0
        this.getProductDataByType()
      },

      jumptoSpecialOrder (data) {
        appStorage.remove('scoreBusSpecial')
        this.$router.push({
          name: 'scoreBusSpecial',
          query: {
            productId: data.productId,
            startPlace: data.aAddress.city,
            endPlace: data.bAddress.city,
            integralExId: data.exchangeRuleId,
            productTypeLevelOne: data.productTypeLevelOne,
          }
        })
      },

      jumptoExchangeProductSku (data) {
        if(data.productTypeLevelOne === 'TOUR_BUS'){
          appStorage.remove('scoreBusTour')
          this.$router.push({
            name: 'scoreBusTourProduct',
            query:{
              productId: data.productId,
              integralPrice: data.exchangeIntegral,
              integralExId: data.exchangeRuleId,
            }
          })
        }else{
          this.$router.push({
            name: 'exchangeProductSku',
            query: {
              productId: data.productId,
              productTypeLevelOne: data.productTypeLevelOne,
              productTypeLevelTwo: data.productTypeLevelTwo || '',
            }
          })
        }
      },

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../styles/theme.less";
  .pad-b-200{
    padding-bottom:200px;
  }
  .list-nav {
    height: 160px;
    line-height: 160px;
    position: relative;
    background-color: @c-fff;
    width: 100%;
    span {
      display: block;
      float: left;
    }
    .car-icon {
      width: 180px;
      height: 126px;
      margin-left: 20px;
      margin-top: 17px;
      background: url("../../../../assets/city/zhuanche.png") no-repeat 0 center;
      background-size: 100%;
    }
    .time {
      font-size: 28px;
      color: @c-121212;
      margin-left: 50px;
    }
    .orange {
      position: absolute;
      font-size: 28px;
      color: @c-ff6600;
      right: 75px;
    }
    .blue-start {
      width: 30px;
      height: 30px;
      line-height: 30px;
      background-color: #3096F9;
      color: @c-fff;
      position: absolute;
      top: 65px;
      right: 30px;
      text-align: center;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      font-size: 22px;
    }
  }

  .score-ticket-box {
    width:100%;
    padding-top: 30px;
    padding-bottom:30px;
    position: relative;
    background-color: @c-fff;
    &:active{
      -moz-opacity:0.8;
      opacity:0.8;
    }
    .number{
      font-size:24px;
      color:@fc-888;
      em{
        font-size:32px;
        color:@fc-ff6600;
      }
    }
    .place{
      width:300px;
    }

    .fix-time {
      font-size: 24px;
      color: @fc-888;
      text-align: right;
      margin-top: 64px;
    }
    .circle{
      left:20px;
    }
  }
  .score-empty-box{
    padding:90px 0 220px;
    .city-no-bus{
      margin-top:0;
    }
    .empty-pic{
      width:430px;
      height:277px;
      margin:0 auto 80px;
    }
  }
</style>
