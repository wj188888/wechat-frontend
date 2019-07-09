<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="ticket-order" v-if="currentTicketList.length > 0">
      <normal-title title="正在进行中的行程"></normal-title>
      <ul class="trip-list">
        <li class="line line-x-b" v-for="(currentTicket, index) in currentTicketList" :key="index" @click="jumpToTrip(currentTicket)">
          <div class="trip-status clearfix">
            <p class="pull-left">{{currentTicket.productTypeLevelTwo | getProductTwoName}}</p>
            <p class="status pull-right">
              <span v-if="currentTicket.status === 0">未付款</span>
              <span v-if="currentTicket.status === 1">未验票</span>
              <span v-if="currentTicket.status === 2">已验票</span>
              <span v-if="currentTicket.status === 3">已乘坐</span>
              <span v-if="currentTicket.status === 5">已退票</span>
              <span v-if="currentTicket.status === 6">已失效</span>
              <span v-if="currentTicket.status === 7">已过期</span>
              <span v-if="currentTicket.status === 8">已退票</span>
            </p>
          </div>
          <p class="p1"><i></i>{{currentTicket.startupTime | formatDate('monthDayHour')}}出发</p>
          <p class="p2"><i></i>{{ currentTicket.aAddress | getAddressStation(currentTicket.onStation) }}</p>
          <p class="p3"><i></i>{{ currentTicket.bAddress | getAddressStation(currentTicket.offStation) }}</p>
        </li>
      </ul>
    </div>
    <no-ticket :show="currentTicketList.length === 0" :text="isLogin ? '亲，请联系司机验票或购买车票' : '订单空空如也<br/>赶紧去买票吧'">
      <router-link class="any-but button button-primary" :to="{name:'city'}" replace>车票购买</router-link>
    </no-ticket>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import NoTicket from '../../components/noTicket/index.vue'
  import NormalTitle from 'appComponents/title/normalTitle'

  export default {
    components: {
      MainBox,
      NoTicket,
      NormalTitle
    },
    data () {
      return {
        title: this.$route.meta.title,
        currentTicketList: '',
        isLogin: false
      }
    },
    mounted(){
      if (appStorage.get('X-Auth-Token')) {
        this.isLogin = true
        this.findUnRideTickets()
      }
    },
    methods: {
      /**
       *  查询未付款订单列表
       */
      findUnRideTickets () {
        api.findUnRideTickets().then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.currentTicketList = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      jumpToTrip (currentTicket) {
        if(currentTicket.taskId){
          this.$router.push({
            name:'trip',
            query:{
              taskId:currentTicket.taskId
            }
          })
        }else{
          this.$store.dispatch('showError', '暂无行程信息');
        }
      }

    }
  }
</script>
<style lang="less" scoped>
  .trip-list{
    li{
      margin-bottom:20px;
      padding:20px 20px 0;
      font-size:24px;
      color:#4c4c4c;
      overflow:hidden;
    }
    .trip-status{
      margin-bottom:30px;
      font-size:28px;
      color:#121212;
      .status{
        color:#ff6600;
      }
    }
    .p1,.p2,.p3{
      margin-bottom:20px;
      i{
        display:inline-block;
        width:8px;
        height:8px;
        margin-right:20px;
        border-radius:50%;
        vertical-align: middle;
      }
    }
    .p1 i{
      background-color:#ff9900;
    }
    .p2 i{
      background-color:#38ca5b;
    }
    .p3 i{
      background-color:#f74c3a;
    }
  }
</style>
