<template>
  <main-box :title="title">
    <scroll ref="scroll"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
      <div class="pad-20 pad-b-0">
        <product-top-nav :show="pageId == 6" ctg="WORK_BUS" :active="0" :nav2router="jumpToFirmBus"></product-top-nav>
        <search-box
                :start-place="searchKeys.onStation.name"
                :end-place="searchKeys.offStation.name"
                @changeStation="changeStation"
                @jumpToFrom="jumpToBdStation('onStation')"
                @jumpToTo="jumpToBdStation('offStation')">
        </search-box>
        <input type="button" class="button button-primary mar-b-80" @click="search" value="查询"/>
        <div class="page-box">
          <h2 @click="jumpToBdStation('currentLoc')">
            <i class="shu"></i>附近线路
            <p class="select">
              <i class="local"></i>{{currentLoc.name}}
            </p>
            <i class="icon icon-r-jt"></i>
          </h2>
          <div v-show="nearWorkProductList.length">
            <ul class="driver-ticket-list">
              <li class="line line-x-t" v-for="nearWorkProduct in nearWorkProductList" @click="jumpToWorkTicket(nearWorkProduct.flight)">
                <div class="driver-ticket-time">{{nearWorkProduct.flight.time}}</div>
                <ul class="driver-ticket-address mar">
                  <li>
                    <i class="circle-bg-start">始</i> {{nearWorkProduct.flight.aAddress.detailAddress}}
                    <em class="distance">(距我{{nearWorkProduct.distance}}米)</em>
                    <div class="shu"></div>
                  </li>
                  <li>
                    <i class="circle-bg-end">终</i> {{nearWorkProduct.flight.bAddress.detailAddress}}
                  </li>
                </ul>
                <a class="driver-buy-button">¥<em>{{nearWorkProduct.flight.ticketPriceRule.price}}</em></a>
              </li>
            </ul>
          </div>
          <div class="no-service line line-x-t" v-show="!nearWorkProductList.length">附近没有车辆，换个地点试试~~</div>
        </div>

        <div class="page-box" v-if="workProductCommentList.length">
          <h2>
            <i class="shu"></i>热门线路
          </h2>
          <div>
            <ul class="driver-ticket-list">
              <li class="line line-x-t" v-for="workProduct in workProductCommentList" @click="jumpToWorkList(workProduct)">
                <ul class="driver-ticket-address">
                  <li><i class="circle-bg-start">始</i>
                    <div class="shu"></div> {{workProduct.aAddress.detailAddress}}
                  </li>
                  <li>
                    <i class="circle-bg-end">终</i> {{workProduct.bAddress.detailAddress}}
                  </li>
                </ul>
                <a class="driver-buy-button">¥<em>{{workProduct.minPrice}}</em><i> 起</i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </scroll>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ProductTopNav from 'appComponents/productTopNav/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import SearchBox from 'appComponents/searchBox/index.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      ProductTopNav,
      Scroll,
      SearchBox,
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        pageId:'',
        searchKeys: {
          onStation: {
            longitude: '',
            latitude: '',
            name: TOOL.placeHolder.startPlace,
            rank: 1
          },
          offStation: {
            longitude: '',
            latitude: '',
            name: TOOL.placeHolder.endPlace,
            rank: 1
          }
        },
        currentLoc:{
          name:'定位中...'
        },
        nearWorkProductList:[],
        workProductCommentList:[],
        searchCommentKeys: {
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        totalPage: '',
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress,
      }),
    },
    watch:{
      appAddress (newVal) {
        if(newVal === TOOL.locationFail) return
        this.currentLoc = {
          longitude: newVal.position.lng,
          latitude: newVal.position.lat,
          name: newVal.detailAddress,
          rank:1
        }
        this.schoolWorkFlightFindNearWork(this.currentLoc)
      },
      $route () {
        this.initialize()
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        if(this.$route.query.pageName){
          this.title = this.$route.query.pageName
        }
        this.pageId = +this.$route.query.pageId || 6

        if(this.appAddress && this.appAddress !== TOOL.locationFail){
          this.currentLoc = {
            longitude: this.appAddress.position.lng,
            latitude: this.appAddress.position.lat,
            name: this.appAddress.detailAddress,
            rank:1
          }
        }

        if (appStorage.get(this.pageRouter)) {
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          if (localData.onStation.name !== TOOL.placeHolder.startPlace) {
            this.searchKeys.onStation = localData.onStation
          }
          if (localData.onStation.name !== TOOL.placeHolder.endPlace) {
            this.searchKeys.offStation = localData.offStation
          }
          this.currentLoc = localData.currentLoc
        }
        if(this.currentLoc.name !== '定位中...'){
          this.schoolWorkFlightFindNearWork(this.currentLoc)
        }
        
        this.searchCommentKeys.pageNo = 0
        this.onPullingUp()
      },

      /**
       * 查找工作班车附近的线路
       */
      schoolWorkFlightFindNearWork (currentLoc) {
        this.$store.commit('UPDATE_LOADING', true)
        api.schoolWorkFlightFindNearWork(currentLoc, 3).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.nearWorkProductList = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 跳转到购票页面
       */
      jumpToWorkTicket (workTicketList) {
        appStorage.remove('workTicket')
        this.$router.push({
          name: 'workTicket',
          query: {
            storeId: workTicketList.storeId,
            flightId: workTicketList.id,
            time: workTicketList.time,
            aAddress: workTicketList.aAddress.detailAddress,
            firmName: workTicketList.firmName,
            bAddress: workTicketList.bAddress.detailAddress,
          }
        })
      },
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchCommentKeys.pageNo === 0){
          this.workProductCommentList = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },

      /**
       * 查找工作班车热门线路
       */
      loadPageList () {
        if(this.searchCommentKeys.pageNo && this.searchCommentKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.workProductFindComment(this.searchCommentKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.workProductCommentList = this.workProductCommentList.concat(data.resultData.content)
            this.totalPage = data.resultData.totalPages
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.searchCommentKeys.pageNo === 0 || this.searchCommentKeys.pageNo < this.totalPage){
              this.searchCommentKeys.pageNo++
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      jumpToWorkList (workProduct) {
        let onStation = {
          longitude:workProduct.aAddress.longitude,
          latitude:workProduct.aAddress.latitude,
          name:workProduct.aAddress.detailAddress,
          rank:1
        }
        let offStation = {
          longitude:workProduct.bAddress.longitude,
          latitude:workProduct.bAddress.latitude,
          name:workProduct.bAddress.detailAddress,
          rank:1
        }
        this.$router.push({
          name: 'workList',
          query: {
            onStation: JSON.stringify(onStation),
            offStation: JSON.stringify(offStation)
          }
        });
      },

      /**
       * 往返切换
       */
      changeStation () {
        let onStation = this.searchKeys.onStation
        if (this.searchKeys.offStation.name !== TOOL.placeHolder.endPlace) {
          this.searchKeys.onStation = this.searchKeys.offStation
        } else {
          this.searchKeys.onStation = {
            longitude: '',
            latitude: '',
            name: TOOL.placeHolder.startPlace,
            rank: 1
          }
        }
        if (onStation.name !== TOOL.placeHolder.startPlace) {
          this.searchKeys.offStation = onStation
        } else {
          this.searchKeys.offStation = {
            longitude: '',
            latitude: '',
            name: TOOL.placeHolder.endPlace,
            rank: 1
          }
        }
      },

      /**
       * 存储订单到本地数据
       */
      saveWorkForm () {
        let localData = this.searchKeys
        localData.currentLoc = this.currentLoc
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      jumpToFirmBus () {
        this.$router.push({
          name:'firmBus'
        })
      },

      /**
       * 跳转百度地图选择
       */
      jumpToBdStation (dataKey) {
        this.saveWorkForm()
        appStorage.remove('CURRENTCITY')
        this.$router.push({
          name: 'bdStation',
          query: {
            fromPage: this.pageRouter,
            dataKey: dataKey
          }
        })
      },

      search () {
        let validata = TOOL.formValidate([
          {value: this.searchKeys.onStation.name, emptyTips: '请选择出发地'},
          {value: this.searchKeys.offStation.name, emptyTips: '请选择目的地'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.$router.push({
          name: 'workList',
          query: {
            onStation: JSON.stringify(this.searchKeys.onStation),
            offStation: JSON.stringify(this.searchKeys.offStation)
          }
        });
      },

    }
  }
</script>

<style lang="less" scoped>
  .mar-b-80{
    margin-bottom:80px;
  }
  .page-box {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 6px;
  }

  .page-box h2 {
    position:relative;
    height: 86px;
    line-height: 86px;
    font-size: 28px;
    color: #121212;
    font-weight: normal;
    padding: 0 20px;
    .shu {
      display: inline-block;
      position: relative;
      top: -3px;
      width: 4px;
      height: 24px;
      margin-right: 10px;
      background: #ff6600;
      vertical-align: middle;
    }
    .select {
      position: relative;
      float: right;
      padding-right: 20px;
      width: 60%;
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .local{
      display: inline-block;
      width: 34px;
      height:30px;
      background:url("../../../assets/work-location.png") no-repeat 0 center;
      background-size:22px 30px;
      vertical-align: text-bottom;
    }
  }

  .distance{
    font-size:24px;
    color:#ff6600;
  }

  .page-box .no-service{
    height:230px;
    line-height:230px;
    padding-left:230px;
    background:url("../../../assets/hotline.png") no-repeat 65px center;
    background-size:104px 80px;
    font-size:26px;
    color:#4c4c4c;
  }

  .driver-ticket-list > li {
    position: relative;
    padding: 30px 20px;
    font-size: 26px;
    color: #121212;
  }

  .driver-ticket-time {
    float: left;
    width: 160px;
    line-height:120px;
    font-size:32px;
    color:#121212;
  }

  .driver-ticket-address {
    margin-right: 60px;
    &.mar{
       margin-left: 160px;
     }
  }

  .driver-ticket-address li {
    position: relative;
    line-height:1.1;
  }

  .driver-ticket-address .shu {
    position: absolute;
    left: 12px;
    top: 36px;
    width: 1PX;
    height: 46px;
    background-color: #dbdedc;
  }

  .driver-ticket-address i {
    display: inline-block;
    width: 26px;
    height: 26px;
    line-height: 26px;
    margin-right: 16px;
    font-size: 16px;
    text-align: center;
    color: #ffffff;
    border-radius: 50%;
  }

  .driver-ticket-address li:first-child {
    margin-bottom: 50px;
  }

  .driver-buy-button {
    position: absolute;
    right: 20px;
    top: 50%;
    margin-top: -14px;
    color: #ff6600;
    font-size:24px;
    em{
      font-size:28px;
    }
    i{
      color: #4c4c4c;
    }
  }
</style>
