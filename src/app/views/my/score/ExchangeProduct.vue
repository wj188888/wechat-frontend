<template>
  <main-box main-class="scrollingBox" :title="title" :show-more="false">
    <div class="flex-vertical">
      <div class="my-score-now mar-b-20">
        <countup class="score-num" :end-val="myScore"></countup>
        <P class="score-txt">当前积分</P>
      </div>
      <div class="flex-box clearfix">
        <ticket-title class="mar-t-0 line line-x-b" title="积分兑换"></ticket-title>
        <ul class="score-product clearfix" v-if="!noData">
          <li class="line line-x-b line-y-r" :class="[data]" v-for="data in datas" @click="jumpToExchangeProductList(data)">
            <p class="name">{{data | getProductOneName}}</p>
          </li>
          <li class="line line-x-b line-y-r" v-if="datas.length % 2"> </li>
        </ul>
        <div class="score-empty-box line line-x-t" v-if="noData">
          <no-result :show="noData" text="全都被兑换空了-。-">
            <img class="empty-pic" src="../../../../assets/score/no_hot_product.png"/>
          </no-result>
        </div>
      </div>
    </div>
  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index.vue'
  import { Countup } from 'vux'
  import TicketTitle from 'appComponents/title/ticketTitle'
  import NoResult from 'appComponents/noResult/index'

  export default {
    components: {
      MainBox,
      Countup,
      TicketTitle,
      NoResult,

    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        myScore: 0,
        datas: [],
        noData: false,
      }
    },
    created () {
      if(appStorage.get('userInfo')){
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        this.myScore = usrInfo.points || 0
      }

//    城际、景点、校园、火车、飞机的专车和快车、车站班车、旅游景点
      this.getExProductOverview()
    },
    methods: {
      getExProductOverview () {
        this.$store.commit('UPDATE_LOADING', true)
        api.getExProductOverview().then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.noData = !data.resultData.length
            this.datas = data.resultData
          } else {
            this.noData = true
            this.datas = []
          }
        })
      },

      jumpToExchangeProductList (productTypeLevelOne){
        this.$router.push({
          name: 'exchangeProductList',
          query:{
            productTypeLevelOne: productTypeLevelOne
          }
        })
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../styles/theme.less";
  .top-0{
    top:0 !important;
  }
  .my-score-now{
    padding: 40px 0 30px;
    text-align:center;
    background:@bg-fff;
    .score-num{
      display: block;
      margin-bottom: 30px;
      font-size:50px;
      color:@fc-ff6600;
    }
    .score-txt{
      font-size:24px;
      color: @fc-888;
    }
  }
  .flex-box{
    flex: 1;
    background-color: @bg-fff;
  }
  .score-product{
    background-color: @fc-fff;
    text-align:center;
    li{
      float:left;
      width:50%;
      height:350px;
      padding-top:272px;
      background: no-repeat center 52px;
      background-size: 160px 160px;
    }
    .CITY_BUS{
      background-image:url("../../../../../static/pics/CITY_BUS.png");
    }
    .STATION_BUS{
      background-image:url("../../../../../static/pics/CITY_BUS.png");
    }
    .AIRPORT_BUS{
      background-image:url("../../../../../static/pics/AIRPORT_BUS.png");
    }
    .TRAIN_STATION_BUS{
      background-image:url("../../../../../static/pics/TRAIN_STATION_BUS.png");
    }
    .SCHOOL_BUS{
      background-image:url("../../../../../static/pics/SCHOOL_BUS.png");
    }
    .SCENIC_BUS{
      background-image:url("../../../../../static/pics/SCENIC_BUS.png");
    }
    .TOUR_BUS{
      background-image:url("../../../../../static/pics/TOUR_BUS.png");
    }
    .name{
      font-size:32px;
      color: @fc-121212;
    }
  }
  .score-empty-box{
    padding:90px 0 220px;
    background-color: @bg-fff;
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
