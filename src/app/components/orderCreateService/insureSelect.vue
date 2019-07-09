<template>
  <div class="inline-box line line-x-t" @click="jumpToInsure" v-if="passengerNum">
    <label class="auto-width label-insure"><i>保</i>保险选择</label>
    <span class="pad-r-20 text-right" v-if="insureTypeId">{{totalPrem}}元/人<em class="text-gray">×{{passengerNum}}份</em></span>
    <span class="pad-r-20 text-right" v-else>不购买保险</span>
    <i class="icon-r-jt"></i>
  </div>
</template>
<script>
  export default {
    props:{
      insureTypeId:'',
      totalPrem: 0,
      passengerNum: 0,
      ticketAmount: 0,
      saveForm:'',
      fromPage: ''
    },
    data () {
      return {

      }
    },
    computed: {

    },
    mounted () {

    },
    methods:{
      /**
       * 跳转保险选择页面选择保险
       * 注：购买保险人数为0时不能跳转选择保险页面
       */
      jumpToInsure () {
        if (this.passengerNum === 0) {
          this.$store.dispatch('showError', '您还没有添加旅客');
          return
        }
        if (this.ticketAmount > 1) {
          this.saveForm()
          this.$router.push({
            name: 'insureSelect',
            query: {
              pageRouter: this.fromPage,
              price: this.ticketAmount
            }
          })
        } else {
          this.$store.dispatch('showError', '此趟车票价格小于1元，无法购买保险');
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .text-gray{
    margin-left:20px;
    color: @fc-888;
  }
</style>
