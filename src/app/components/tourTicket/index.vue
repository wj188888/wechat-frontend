<template>
  <div class="line-ticket-box pad-lr-20" v-if="listData.length > 0">
    <div class="sight-box box-com-ui" v-for="item in listData" @click="jumpToDetail(item.id)">
      <span class="start-place">{{item.aAddress}}出发</span>
      <img :src="item.primaryImage">
      <div class="sight-desc">
        <div class="theme">{{ item.productTheme | strSplit('42') }}</div>
        <div class="sight-tags clearfix">
          <div class="tag-item clearfix" v-for="tag in item.tags">
            <i></i>
            <span>{{tag}}</span>
          </div>
        </div>
        <div class="time-pany clearfix">
          <i class="pany-icon"></i>
          <span class="mar-r-20">{{item.firmName}}</span>
          <i class="time-icon prc-time"></i>
          <span class="week">{{ item.week | weekText }}</span>
        </div>
      </div>
      <div class="tour-price sight-price">
        <span>¥</span>
        <span>{{item.minPrice}}</span>
        <i>起</i>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:['listData'],
    data () {
      return {
      
      }
    },
    computed: {
    
    },
    mounted () {
    
    },
    methods:{
      jumpToDetail (ticketID) {
        this.$emit('jumpToDetail', ticketID)
      }
    }
  }
</script>