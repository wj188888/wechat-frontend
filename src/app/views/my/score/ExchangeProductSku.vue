<template>
  <main-box :title="title" :show-more="false">
    <datePagination :start-time="searchKeys.startupTime" @searchByDate="searchByDate">
      <group class="datetime-x">
        <calendar
          title="出行时间"
          :weeks-list="calendar.weeksList"
          :disable-past="calendar.disablePast"
          v-model="searchKeys.startupTime">
        </calendar>
      </group>
    </datePagination>
    <div class="ticket-scroller pad-b-120">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div class="scroller-box">
          <div class="express-ticket-box mar-t-20 line line-x-t"
               :show="!noData"
               v-for="data in datas"
               @click="jumptoScoreBusExpress(data)">
            <div class="order-box">
              <div class="start clearfix">
                <p class="station-start" v-if="data.isFlow === 1">
                  <span>{{ data.startupTime | formatDate('time') }}</span>
                  <span>前有效</span>
                </p>
                <span class="time" v-else>{{ data.flightTime }}</span>
                <span class="circle circle-bg-start">始</span>
                <span class="place">{{data.aAddress | getAddressTitle}}</span>
                <div class="price">
                  <p class="number">{{data.integralPrice}}积分</p>
                  <p class="remain">余票<em>{{ data.availableSeats + '张' }}</em></p>
                  <p class="fix-time station-time" v-if="data.productTypeLevelOne === 'STATION_BUS'">
                    <span class="liushui" v-if="data.isFlow === 1">流水班</span>
                    <span class="guding" v-else>固定班</span>
                  </p>
                  <p class="fix-time" v-else>{{ data.carGrade | getCarType }}</p>
                </div>
              </div>
              <div class="end clearfix">
                <span class="company" v-if="data.productTypeLevelOne === 'STATION_BUS'">车站班车</span>
                <span class="company" v-else>{{ data.productTypeLevelTwo | getProductTwoName}}</span>
                <span class="circle circle-bg-end">终</span>
                <span class="place">{{data.bAddress | getAddressTitle}}</span>
              </div>
            </div>
          </div>
          <no-result :show="noData" text="暂无可兑换产品"></no-result>
        </div>
      </scroll>
    </div>

    <div slot="footer">
      <div class="sight-search">
        <ul>
          <li :class="{'active': searchPop.showSortPop, 'has-dot': order}" @click="openSearchPop('showSortPop')">
            <p class="icon-s icon-s-price"></p>
            <p>积分排序</p>
          </li>
        </ul>
      </div>

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
  import DatePagination from 'appComponents/datePagination/index'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import NoResult from 'appComponents/noResult/index'
  import { Group, Calendar, Popup } from 'vux'
  import checkLogin from 'mixins/checkLogin'

  export default {
    components: {
      MainBox,
      DatePagination,
      Scroll,
      Group,
      Popup,
      Calendar,
      NoResult
    },
    mixins: [checkLogin],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        myScore: 0,
        calendar: {
          weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
          disablePast: true
        },
        searchKeys: {
          exchangeType: 0,
          productId:'',
          productTypeLevelOne:'',
          productTypeLevelTwo:'',
          startupTime: TOOL.newGetDate({type: 'holeDate'}),
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        datas: [],
        noData: false,
        searchPop: {
          showSortPop: false
        },
        order: 0,
      }
    },
    watch: {
      'searchKeys.startupTime': 'searchByDate',
      $route () {
        this.initialize()
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        if(appStorage.get('userInfo')){
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.myScore = usrInfo.points || 0
        }
        this.searchKeys.productId = this.$route.query.productId
        this.searchKeys.productTypeLevelOne = this.$route.query.productTypeLevelOne
        this.searchKeys.productTypeLevelTwo = this.$route.query.productTypeLevelTwo
        if (appStorage.get(this.pageRouter)) {
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          this.order = localData.order
          this.setSearchKeysByOrder()
        }
        
        this.searchKeys.pageNo = 0
        this.onPullingUp()
      },
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.datas = []
          this.loadPageList()
          if(this.$refs.scroll){
            this.$refs.scroll.scrollTo(0, 0)
          }
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          if(this.$refs.scroll){
            this.$refs.scroll.forceUpdate(true)
          }
          return
        }
        api.findExProductSku(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.datas = this.datas.concat(data.resultData.content)
            this.noData = !this.datas.length
            this.totalPage = data.resultData.totalPages
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
              this.searchKeys.pageNo++
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      
      /**
       * 日期前一页后一页
       * @param type
       */
      searchByDate (type) {
        if (type === 'prev' && TOOL.dateCompare(this.searchKeys.startupTime) <= 0) {
          return false
        }
        if (type === 'prev') {
          this.searchKeys.startupTime = TOOL.changeDate(this.searchKeys.startupTime, 'd', -1)
        } else if (type === 'next') {
          this.searchKeys.startupTime = TOOL.changeDate(this.searchKeys.startupTime, 'd', 1)
        }
        this.searchKeys.startupTime = TOOL.newGetDate({date: this.searchKeys.startupTime, type: 'holeDate'})
        this.saveSearchForm()
        this.$router.replace({
          name: 'exchangeProductSku',
          query: {
            productId: this.searchKeys.productId,
            productTypeLevelOne: this.searchKeys.productTypeLevelOne,
            productTypeLevelTwo: this.searchKeys.productTypeLevelTwo,
            startupTime: this.searchKeys.startupTime,
          }
        });
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

      saveSearchForm () {
        let saveData = {}
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
      },

      searchBykeyWords () {
        this.saveSearchForm()
        this.setSearchKeysByOrder()
        this.searchPop = {
          showSumPop: false,
          showSortPop: false
        }
        this.searchKeys.pageNo = 0
        this.onPullingUp()
      },

      jumptoScoreBusExpress (data) {
        if(data.productTypeLevelOne === 'STATION_BUS'){
          appStorage.remove('scoreBusStation')
          this.$router.push({
            name: 'scoreBusStation',
            query:{
              skuId: data.skuId,
              integralPrice: data.integralPrice,
              integralExId: data.exchangeRuleId
            }
          })
        }else{
          appStorage.remove('scoreBusExpress')
          this.$router.push({
            name: 'scoreBusExpress',
            query:{
              skuId: data.skuId,
              integralPrice: data.integralPrice,
              integralExId: data.exchangeRuleId,
              productTypeLevelOne: data.productTypeLevelOne,
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../styles/theme.less";
  .express-ticket-box {
    width:100%;
    padding-top: 30px;
    padding-bottom:30px;
    position: relative;
    background-color: @c-fff;
    &:active{
      -moz-opacity:0.8;
      opacity:0.8;
    }
    .remain {
      font-size: 24px;
    }
    .fix-time {
      font-size: 24px;
      color: @fc-929292;
      text-align: right;
      margin-top: 17px;
    }
    .station-start {
      float: left;
      width: 6rem;
      margin-left: 20px;
      font-size: 20px;
      span {
        float: left;
        width: 100%;
        color: #ff6600;
        &:first-child {
          font-size: 40px;
          color: #212325;
        }
      }

    }
    .station-time {
      margin-top: 10px !important;
      span {
        padding: 6px 8px 5px;
        color: #fff;
        -webkit-border-radius: 4px;
        border-radius: 4px;
      }
      .guding {
        background-color: #A3DBFC;
      }
      .liushui {
        background-color: #FEBEA2;
      }
    }
  }
  .pad-b-120{
    bottom:120px;
  }
</style>
