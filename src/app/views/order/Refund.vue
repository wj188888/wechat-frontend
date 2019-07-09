<template>
  <main-box :title="title">
    <div class="flex-vertical rewrite-flex">
      <div class="flex-vertical-box mar-t-0">
        <ul class="passenger-list check-passenger-list">
          <li class="line line-x-b mar-b-0" v-for="(ticket, index) in ticketList"  @click="checkTicket(index, ticket)">
            <div class="check-box">
              <input class="hide" type="checkbox" v-model="ticketList[index].check">
              <i class="icon-check"></i>
            </div>
            <p class="name">{{ticket.passengerName}}</p>
            <p class="card-num color-888">{{ticket.passengerIdcard}}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="refund-money-box">
      <span class="mar-r-10">退票金额</span>
      <span class="orange-color">￥</span>
      <span class="orange-color font-40">{{price | formatPrice('normal')}}</span>
    </div>

    <div class="inline-box line line-x-t mar-t-20" @click="jumpToRefundReason">
      <label>退票理由</label>
      <input class="pad-r-20" type="text" readonly placeholder="请选择退票理由" v-model="refundReason" />
      <i class="icon-r-jt"></i>
    </div>

    <div class="mar-40-20">
      <input type="button" class="button button-primary" @click="wxPayRefundMore" value="确认退票"/>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        ticketList:[],
        ticketIds: [],
        refundReason:'',
        price:0,
      }
    },
    mounted () {
      this.orderId = this.$route.query.orderId;
      this.productLevelOne = this.$route.query.productLevelOne;
      if(appStorage.get(this.pageRouter)){
        let localData = JSON.parse(appStorage.get(this.pageRouter))
        if(localData.refundReason){
          this.refundReason = localData.refundReason
        }
      }
      this.ticketFindRefundByOrderId()
    },
    methods: {
      /**
       *  根据订单ID查询能退款的车票
       */
      ticketFindRefundByOrderId () {
        /*let findUrl = ''
        if(this.productLevelOne == 'CAR_RENTAL') {

        }*/
        this.$store.commit('UPDATE_LOADING', true)
        api.ticketFindRefundByOrderId(this.orderId).then(res =>{
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if(data.resultCode == '0'){
            this.ticketList = data.resultData

            if(appStorage.get(this.pageRouter)){
              let localData = JSON.parse(appStorage.get(this.pageRouter))
              if(localData.ticketList && localData.ticketList.length){
                this.ticketList = localData.ticketList
              }
            }

            let len = this.ticketList.length
            for (let i = 0; i < len; i++) {
              if(this.ticketList[i].check){
                this.price += +this.ticketList[i].actualPayTicketAmount
              }
            }
          }
        })
      },

      checkTicket (index, ticket) {
        if(ticket.check){
          ticket.check = false
          this.price -= +ticket.actualPayTicketAmount
        }else{
          ticket.check = true
          this.price += +ticket.actualPayTicketAmount
        }
        this.$set(this.ticketList, index, ticket)
      },

      saveForm () {
        let localData = {
          ticketList: this.ticketList,
          refundReason: this.refundReason
        }
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      jumpToRefundReason() {
        this.saveForm()
        this.$router.push({
          name:'refundReason',
          query:{
            pageRouter: this.pageRouter
          }
        })
      },

      /**
       *  退票
       */
      wxPayRefundMore () {
        let len = this.ticketList.length
        let ticketIds = []
        for (let i = 0; i < len; i++) {
          if(this.ticketList[i].check){
            ticketIds.push(this.ticketList[i].id)
          }
        }
        if(!ticketIds.length){
          this.$store.dispatch('showError', '请先选择要退的票')
          return
        }
        this.$store.commit('UPDATE_LOADING', true)
        api.wxPayRefundMore({
          ticketIds: ticketIds.join(','),
          orderId: this.orderId,
          refundReason: ''
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if(data.resultCode == '0'){
            this.$store.dispatch('showSuccess', '退票成功')
            this.$router.go(-1)
          }
        })
      }

    }
  }
</script>


<style lang="less" scoped>
  .refund-money-box {
    width: 100%;
    height: 80px;
    line-height: 80px;
    padding: 0 20px;

    background: #fff;
    font-size: 28px;
    color: #383a3e;
    span {
      float: left;
    }
  }
  .rewrite-flex {
    min-height: 0 !important;
    padding: 0;
  }
  .orange-color {
    color: #f60;
  }
  .color-888 {
    color: #888;
  }
  .font-40 {
    font-size: 40px !important;
  }
</style>
