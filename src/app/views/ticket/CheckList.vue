<template>
  <main-box :title="title" main-class="scrollingBox">
    <ticket :list-data="currentTicketList" type="currentTicket"></ticket>
    <no-ticket :show="currentTicketList.length === 0" :text="isLogin ? '亲，您还没车票呢？' : '订单空空如也<br/>赶紧去买票吧'">
      <router-link class="any-but button button-primary" :to="{name:'city'}" replace>车票购买</router-link>
    </no-ticket>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Ticket from 'appComponents/ticket/index.vue'
  import NoTicket from 'appComponents/noTicket/index.vue'

  export default {
    components: {
      MainBox,
      Ticket,
      NoTicket
    },
    data () {
      return {
        title: this.$route.meta.title,
        status: 1,
        currentTicketList: [],
        isLogin: false
      }
    },
    mounted () {
      if (appStorage.get('X-Auth-Token')) {
        this.isLogin = true
        this.findCurrentTicket(this.status)
      }
    },
    methods: {

      /**
       * 查询当天未乘坐车票
       * @param status
       */
      findCurrentTicket (status) {
        api.findCurrentTicket({status: status, pageNo: 0, pageSize: 10}).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode == '0') {
            this.currentTicketList = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 跳转车票详情
       */
      jumpToTicketDetail (ticketId, status) {
        if (status == 1 || status == 2) {
          this.$router.push({
            name: 'ticketDetail',
            query: {
              ticketId: ticketId
            }
          })
        }
      },
    }
  }
</script>
<style scoped>
  .gen-ticket-info .no-person {
    height: 100px;
    line-height: 100px;
  }
</style>
