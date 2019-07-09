<template>
  <div v-if="skus">
    <ticket-title :title="title">
      <slot name="title"></slot>
    </ticket-title>
    <div class="banner line line-x-t" @click="jumpToPage">
      <img src="../../../assets/city/carpoolbanner.png" alt="">
    </div>
    <div class="join-group">
      <span class="join-num person-img">{{skus.attendPersons}}人</span>
      <span class="join-num group-img">{{skus.skuTotal}}个队</span>
      <span class="join-text" @click="jumpToPage">前去参团</span>
    </div>
  </div>
</template>
<script>
  import TicketTitle from 'appComponents/title/ticketTitle'

  export default {
    props:['title', 'skus'],
    components:{
      TicketTitle
    },
    data () {
      return {

      }
    },
    mounted () {

    },
    methods:{
      jumpToPage () {
        this.$emit('jumpToPage')
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .banner {
    width: 100%;
    height: 200px;
    padding-top: 20px;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .join-group {
    width: 100%;
    height: 70px;
    padding: 0 20px;
    background: #fff;
  }
  .join-text {
    line-height: 70px;
    font-size: 28px;
    color: #f60;
    float: right;
  }
  .join-num {
    float: left;

    line-height: 30px;
    padding-left: 40px;
    margin-top: 30px;
    margin-right: 30px;

    font-size: 24px;
    color: #888;
  }
  .person-img {
    background: url('../../../assets/city/person.png') no-repeat left center;
    background-size: 30px 30px;
  }
  .group-img {
    background: url('../../../assets/city/group.png') no-repeat left center;
    background-size: 30px 30px;
  }
</style>
