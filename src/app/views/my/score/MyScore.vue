<template>
  <main-box :title="title" :show-more="false">
    <router-link class="hd-cancel" slot="title" :to="{name: 'myScoreDetail'}">积分明细</router-link>

    <div class="my-score-now">
      <countup class="score-num" :end-val="myScore"></countup>
      <P class="score-txt">当前积分</P>
    </div>

    <ul class="my-score-use line line-x">
      <router-link tag="li" :to="{name:'exchangeProduct'}" class="score-product">兑换产品</router-link>
      <router-link tag="li" :to="{name:'exchangeCoupon'}" class="score-coupon">积分换券</router-link>
      <li class="score-other" @click="needTodo">兑换其他</li>
      <li class="score-my" @click="needTodo">我的兑换</li>
    </ul>

    <ticket-title title="热门兑换"></ticket-title>
    <score-product-list v-if="!noData" :datas="datas"></score-product-list>
    <div class="score-empty-box line line-x-t" v-if="noData">
      <no-result :show="noData" text="全都被兑换空了-。-">
        <img class="empty-pic" src="../../../../assets/score/no_hot_product.png"/>
      </no-result>
    </div>

  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index.vue'
  import TicketTitle from 'appComponents/title/ticketTitle'
  import ScoreProductList from 'appComponents/searchListTicket/scoreProductList'
  import NoResult from 'appComponents/noResult/index'
  import { Countup } from 'vux'

  export default {
    components: {
      MainBox,
      Countup,
      TicketTitle,
      ScoreProductList,
      NoResult,
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        myScore: 0,
        datas: [],
        noData: true,
      }
    },
    created () {
      if(appStorage.get('userInfo')){
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        this.myScore = usrInfo.points || 0
      }
      this.hotExchangeProductFind()
    },
    methods: {

      /**
       * 查询我的优惠券
       */
      hotExchangeProductFind () {
        this.$store.commit('UPDATE_LOADING', true)
        api.hotExchangeProductFind().then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.noData = !data.resultData.length
            this.datas = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      needTodo () {
        this.$store.dispatch('showAlert', {content: '哒哒哒，程序正在开发的路上', title: ' '})
      },
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
  .my-score-use{
    display:flex;
    background: @bg-fff;
    text-align:center;
    font-size:24px;
    color:@fc-4c4c4c;
    li{
      flex: 1;
      padding:120px 0 20px;
      background:no-repeat center 20px;
      background-size:80px 80px;
    }
    .score-product{
      background-image:url("../../../../assets/score/score_product.png");
    }
    .score-coupon{
      background-image:url("../../../../assets/score/score_coupon.png");
    }
    .score-other{
      background-image:url("../../../../assets/score/score_other.png");
    }
    .score-my{
      background-image:url("../../../../assets/score/score_my.png");
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
