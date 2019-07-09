<template>
  <div>
    <div class="search-bus-box">
      <input type="text" placeholder="搜索公交线路、目的地" v-model="keyword"/>
      <div class="clear-value" v-show="keyword" @click="keyword = ''"></div>
      <a class="cancel" @click="goback">取消</a>
    </div>
    <div class="bus-station-list">
      <ul v-if="!showNoSearchData">
        <li @click="jumpToBusLineDetail(data)" v-for="data in lineData">
          <p class="p1">{{data.lineName}}</p>
          <p class="p2">{{data.startLineSegmentName + ' - ' + data.finalLineSegmentName}}</p>
        </li>
      </ul>
      <div class="search-no-data" v-if="showNoSearchData">
        <P class="p1">搜索无结果</P>
        <P class="p2">换个关键词试试</P>
      </div>
      <div class="search-no-data search-default" v-if="showDefault">
        <P class="p1">请输入关键词进行搜索</P>
      </div>
    </div>
  </div>
</template>
<script>
  import NoResult from 'appComponents/noResult/index'
  import { mapState } from 'vuex'
  export default {
    components: {
      NoResult
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
    },
    data () {
      return {
        keyword: '',
        lineData:[],
        showNoSearchData: false,
        showDefault: true,
        currentLon: '',
        currentLat: '',
      }
    },
    watch: {
      keyword () {
        this.$nextTick(() => {
          this.publicBusLineFindBusLine();
        })
      },
    },
    mounted () {
      if(this.appAddress){
        this.currentLon = this.appAddress.position.lng
        this.currentLat = this.appAddress.position.lat
      }else{
        this.$store.watch((state) => {
          return state.city.appAddress;
        }, (newVal, oldVal) => {
          if(newVal && newVal !== TOOL.locationFail){
            this.currentLon = newVal.position.lng
            this.currentLat = newVal.position.lat
          }
        }, {deep: true});
      }
    },
    methods: {
      goback () {
        this.$router.go(-1)
      },
  
      publicBusLineFindBusLine () {
        api.publicBusLineFindBusLine(this.keyword)
        .then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.showDefault = false
            this.lineData = data.resultData
            this.showNoSearchData = !this.lineData.length
          }
        })
      },
      
      jumpToBusLineDetail (data) {
        this.$router.push({
          name: 'busLineDetail',
          query:{
            lineId: data.lineId,
            currentLat: this.currentLat,
            currentLon: this.currentLon,
//            currentLat: '28.419494',
//            currentLon: '115.382518',
            productTypeLevelTwo: data.productTypeLevelTwo,
            direct: data.direct,
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .search-bus-box{
    position: relative;
    input{
      display:block;
      width: 100%;
      height: 80px;
      padding:20px 200px 20px 90px;
      line-height:80px;
      font-size:28px;
      background:url("../../../assets/bus/search.png") no-repeat 30px center #fff;
      background-size: 30px 30px;
    }
    .clear-value {
      position: absolute;
      top: 0;
      right: 100px;
      width: 100px;
      height: 80px;
      background: url('../../../assets/cha.png') no-repeat right center;
      background-size: 26px 26px;
    }
    .cancel{
      position: absolute;
      right:0;
      top:0;
      width:100px;
      height:80px;
      padding-right:30px;
      line-height:80px;
      text-align: right;
      color:#888;
      font-size:28px;
    }
  }
  .bus-station-list{
    position: absolute;
    top:100px;
    left:20px;
    right:20px;
    bottom:0;
    background:#fff;
    box-shadow: 0 1PX 3PX rgba(0, 0, 0, 0.1);
    li {
      position: relative;
      padding: 20px 20px 20px 90px;
      background: url("../../../assets/bus/station.png") no-repeat 30px center;
      background-size:38px 38px;
      border-bottom: 1PX solid #f2f2f2;
      .p1{
        position: relative;
        padding-right: 70px;
        margin-bottom:10px;
        line-height:1.4;
        font-size:28px;
      }
      .distance{
        position: absolute;
        right:0;
        top: 5px;
        color:#999;
        font-size:20px;
      }
      .tj{
        display:inline-block;
        width: 56px;
        margin-left:20px;
        padding:14px 0;
        line-height:0;
        text-align:center;
        font-size:18px;
        color:#fff;
        background:#ff6600;
        border-radius:8px;
      }
      .p2{
        padding-right: 70px;
        font-size:24px;
        color:#999;
        line-height:1.4;
      }
      &.active{
        background-color: rgba(0,0,0,.04)
      }
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