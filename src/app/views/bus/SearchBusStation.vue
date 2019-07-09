<template>
  <main-box :title="title" :show-more="false">
    <div class="bg-fff input-box">
      <div class="inline-box">
        <label class="icon-carhailing-start"></label>
        <input type="text" placeholder="您在哪上车" v-model="from" readonly @click="jumpToSetPosition('from')"/>
      </div>
      <div class="inline-box line line-x-t">
        <label class="icon-carhailing-end"></label>
        <input type="text" placeholder="您要去哪里" v-model="to" readonly @click="jumpToSetPosition('to')"/>
      </div>
      <div class="change" @click="changePlace"></div>
    </div>
    <ul>
      <li class="bus-policy line line-x-b mar-t-20">
        <p class="bus-tab"
           :class="{'active': data.key === policy}"
           v-for="data in policys"
           @click="setPolicy(data.key)">
          {{data.name}}
        </p>
      </li>
      
      <!--创建产品-->
      <li class="station-item mar-b-20"
          v-for="(data, i) in lineData"
          v-if="!showNoSearchData"
          @click="jumpToBusStationMap(data)">
        <div class="bus-line-box">
          <div class="more-lines">
            <div class="bus-item">
              <i class="icon-bus"></i>
              <span class="name">{{data.lineName}}</span>
              <i class="line-green" :class="{'line-yellow':data.productTypeLevelTwo === 'PUBLIC_COUNTRYSIDE_BUS'}"></i>
            </div>
          </div>
        </div>
        <p class="address">{{data.aLineSegmentName}}上车·需<span v-if="data.hour">{{data.hour}}小时</span><span v-if="data.minute">{{data.minute}}分</span>·步行{{data.warkMeter | formatMeter}}</p>
      </li>
      
      <!--高德换乘-->
      <li class="station-item mar-b-20"
          v-for="data in transferPlans"
          @click="jumpToBusStationMap(data)"
          v-if="transferPlans.length">
        <div class="bus-line-box"
             v-for="(segment, index) in data.segments"
             :class="{'more': index !== 0}"
             v-if="segment.transit_mode === 'BUS' || segment.transit_mode === 'SUBWAY'">
          <div class="more-lines">
            <div class="bus-item">
              <i class="icon-bus" :class="{'icon-subway': segment.transit_mode === 'SUBWAY'}"></i>
              <span class="name" v-for="(line, i) in segment.transit.lines">
                <em v-if="i !== 0">/</em>
                {{line.name | formatBusName}}
              </span>
              <i class="line-green" :class="{'line-blue': segment.transit_mode === 'SUBWAY'}"></i>
            </div>
            <!--<span class="more-line-text" v-if="i !== segment.transit.lines.length - 1">或</span>-->
          </div>
        </div>
        <p class="address">{{data.firstStationName}}上车·需<span>{{data.time | formatViewTime}}</span>·步行{{data.walking_distance | formatMeter}}</p>
      </li>
    </ul>
    <div class="search-no-data search-default" v-if="showNoSearchData">
      <P class="p1">{{showNoSearchDataTips}}</P>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        localData:{
          from:{},
          to:{}
        },
        from:'',
        to:'',
        lineData:[],
        showNoSearchData: false,
        showNoSearchDataTips: '',
        transferService:'',
        transferPlans:[],
        policy: 'LEAST_FEE',
        policys: [
          {key: 'LEAST_FEE', name: '推荐线路'},
          {key: 'LEAST_TIME', name: '时间短'},
          {key: 'LEAST_TRANSFER', name: '少换乘'},
          {key: 'LEAST_WALK', name: '少步行'},
//          {key: 'NO_SUBWAY', name: '不坐地铁'},
        ]
      }
    },
    mounted () {
      if(appStorage.get('busIndex')){
        let localData = JSON.parse(appStorage.get('busIndex'))
        this.localData = Object.assign(this.localData, localData)
        this.setFromTo()
      }
      if(!this.localData.from.lat){
        this.$router.back()
      }
      this.findBusRoutPlan()
      this.transferServiceHander()
    },
    methods: {
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        appStorage.set('busIndex', JSON.stringify(this.localData))
      },
  
      jumpToSetPosition (dataKey) {
        this.saveForm()
        this.$router.push({
          name: 'setPosition',
          query:{
            pageRouter: 'busIndex',
            fromPage: this.pageRouter,
            dataKey: dataKey
          }
        })
      },
  
      setFromTo () {
        if(this.localData.from && this.localData.from.city){
          this.from = TOOL.getCityOrCounty(this.localData.from) + '·' + this.localData.from.name
        }
        if(this.localData.to && this.localData.to.city){
          this.to = TOOL.getCityOrCounty(this.localData.to) + '·' + this.localData.to.name
        }
      },
      
      changePlace () {
        let from = Object.assign({}, this.localData.from)
        this.localData.from = this.localData.to
        this.localData.to = from
        this.setFromTo()
        this.saveForm()
        this.findBusRoutPlan()
        this.search()
      },
      
      tanspoint (address) {
        return TOOL.tencentToBaidu({
          lat: address.lat,
          lng: address.lng,
        })
      },
      
      findBusRoutPlan () {
        if(!this.localData.from.lat || !this.localData.to.lat){
          this.showNoSearchData = true
          this.showNoSearchDataTips = '请选择上下车点'
          return
        }
        let fromPoint = this.tanspoint(this.localData.from)
        let toPoint = this.tanspoint(this.localData.to)
        api.findBusRoutPlan({
          startLat: fromPoint.lat,
          startLong: fromPoint.lng,
          endLat: toPoint.lat,
          endLong: toPoint.lng,
        }).then(res=>{
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.lineData = data.resultData
            this.showNoSearchData = !this.lineData.length
            this.showNoSearchDataTips = '抱歉，现在没有合适的乘车方案'
          }
        })
      },
  
      transferServiceHander () {
        if(!this.transferService){
          this.transferService = new AMap.Transfer({});
          this.transferService.setCity(this.localData.from.city);
          this.setPolicy('LEAST_FEE')
        }
        this.search()
      },
  
      /**
       * 设置换成方案
       * policy [LEAST_TIME: '最快捷模式',
       * LEAST_FEE: '最经济模式',
       * LEAST_TRANSFER: '最少换乘模式',
       * LEAST_WALK: '最少步行模式',
       * MOST_COMFORT: '最舒适模式',
       * NO_SUBWAY: '不乘地铁模式']
       */
      setPolicy (policy) {
        this.policy = policy
        let transferPolicy = AMap.TransferPolicy[policy]
        this.transferService.setPolicy(transferPolicy)
        this.search()
      },
  
      /**
       * 根据起点终点检索
       */
      search () {
        this.$store.commit('UPDATE_LOADING', true)
        let start = new AMap.LngLat(this.localData.from.lng, this.localData.from.lat)
        let end = new AMap.LngLat(this.localData.to.lng, this.localData.to.lat)
        this.transferService.search(start, end, (status, result) => {
          if(status === 'complete'){
            let plans = result.plans
            if(plans && plans.length){
              this.transferPlans = plans
              this.getfirstStationName()
              this.showNoSearchData = !this.transferPlans.length
            }
          }
          this.$store.commit('UPDATE_LOADING', false)
          this.showNoSearchDataTips = '抱歉，现在没有合适的乘车方案'
        })
      },
  
      /**
       * 获取第一个上车站点名称
       */
      getfirstStationName () {
        for(let i = 0; i < this.transferPlans.length; i++){
          let firstStationName = ''
          let segments = this.transferPlans[i].segments
          let len = segments.length
          for(let j = 0; j < len; j ++ ){
            if(segments[j].transit_mode === 'BUS' || segments[j].transit_mode === 'SUBWAY'){
              firstStationName = segments[j].transit.on_station.name
              break;
            }
          }
          this.transferPlans[i].firstStationName = firstStationName
        }
      },
      
      jumpToBusStationMap (data) {
        if(data.lineId){
          this.$router.push({
            name: 'busStationMap',
            query:{
              productTypeLevelTwo: data.productTypeLevelTwo,
              aLineSegmentId: data.aLineSegmentId,
              bLineSegmentId: data.bLineSegmentId,
              lineId: data.lineId,
              direct: data.direct,
              hour: data.hour,
              minute: data.minute,
              warkMeter: data.warkMeter,
              aDistance: data.aDistance,
              bDistance: data.bDistance
            }
          })
        }else{
          appStorage.set('transferPlan', JSON.stringify(data))
          this.$router.push({name: 'busStationMap'})
        }
      }
      
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .input-box{
    position: relative;
    padding:0 130px 0 20px;
    .change{
      position: absolute;
      top:0;
      right:0;
      bottom: 0;
      width: 130px;
      background: url("../../../assets/bus/change.png") no-repeat center center;
      background-size:32px 46px;
    }
  }
  .inline-box {
    label{
      width:86px;
      background:no-repeat 10px center;
      background-size:30px 30px;
    }
    .icon-carhailing-start{
      background-image:url("../../../assets/order_start.png")
    }
    .icon-carhailing-end{
      background-image:url("../../../assets/order_end.png")
    }
    span{
      color: #999;
      &.active{
        color: #121212;
      }
    }
  }
  .bus-policy{
    display:flex;
    background:#fff;
    .bus-tab{
      flex:1;
      font-size:26px;
      color: #888;
      text-align:center;
      line-height:80px;
      &.active{
        color:#ff6600;
      }
    }
  }
  .station-item{
    padding: 20px;
    background:#fff;
    .bus-line-box{
      display:inline-block;
      &:first-child.more{
        margin-left:0;
        padding-left:0;
        background:none;
      }
      &.more{
        margin-left:20px;
        padding-left:28px;
        background:url("../../../assets/bus/right.png") no-repeat 0 center;
        background-size:8px 15px;
      }
    }
    .more-lines{
      display:inline-block;
      margin-bottom:16px;
      .more-line-text{
        padding:0 20px;
        font-size:28px;
        color: #888;
      }
    }
    .bus-item{
      position: relative;
      display:inline-block;
      padding:10px 10px 12px;
      border:1PX solid #e5e5e5;
      border-radius:8px;
      font-size:28px;
      color:#121212;
      vertical-align: middle;
      overflow: hidden;
      .icon-bus{
        display: inline-block;
        width:26px;
        height:26px;
        background:url("../../../assets/bus/station.png") no-repeat center center;
        background-size: 26px 26px;
        vertical-align: bottom;
        &.icon-subway{
          background:url("../../../assets/bus/sub_way.png") no-repeat center center;
          background-size: 26px 26px;
        }
      }
      .line-green{
        position: absolute;
        left:0;
        bottom:0;
        width:100%;
        height:6px;
        background:#12b796;
        &.line-yellow{
          background:#ff6600;
        }
        &.line-blue{
          background:#2290f9;
        }
      }
    }
    .address{
      font-size:24px;
      color:#888;
    }
  }
  .search-no-data{
    padding-top:396px;
    text-align:center;
    background:url("../../../assets/bus/search_no_data.png") no-repeat center 128px;
    background-size:201px 234px;
    &.search-default{
      background-image:url("../../../assets/bus/search-no-history.png");
    }
    .p1{
      margin-bottom:20px;
      font-size:28px;
      color:#4c4c4c;
    }
    .p2{
      font-size:24px;
      color:#888;
    }
  }
</style>