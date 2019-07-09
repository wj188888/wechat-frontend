<template>
  <div class="city-date-box line line-x-b">
    <div class="item-lf" :class="{'disabled': !prevDisabled}" @click="searchByDate('prev')">
      <i class="icon-lf-jt"></i>
      <span class="date-btn">前一天</span>
    </div>
    <div class="item-md">
      <span class="date-btn">{{ startTime | formatDate('formatStartupTime') }}</span>
      <slot></slot>
    </div>
    <div class="item-rt" @click="searchByDate('next')">
      <i class="icon-r-jt"></i>
      <span class="date-btn">后一天</span>
    </div>
  </div>
</template>
<script>
  export default {
    props:['startTime'],
    data () {
      return {
        calendar: {
          weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
          disablePast: true
        },
      }
    },
    computed: {
      prevDisabled () {
        return TOOL.dateCompare(this.startTime) > 0
      },
    },
    mounted () {},
    methods:{
      searchByDate (type) {
        this.$emit('searchByDate', type)
      }
    }
  }
</script>
<style lang="less">
  @import "../../../styles/theme.less";
  .city-date-box {
    height: 90px;
    display: flex;
    background-color: @c-fff;
    .date-btn {
      display: block;
      height: 90px;
      line-height: 90px;
      font-size: 28px;
      color: @c-121212;
    }
    .item-lf {
      flex: 1;
      position: relative;
      &.disabled{
        .date-btn {
          color: #ccc;
        }
        .icon-lf-jt:after{
          background: url("../../../assets/jt_left_disabled.png") no-repeat 0 0;
          background-size: 100%;
        }
      }
      .date-btn {
        padding-left: 40px;
        text-align: left;
      }
    }
    .item-rt {
      flex: 1;
      position: relative;
      .date-btn {
        padding-right: 40px;
        text-align: right;
      }
    }
    .item-md {
      flex: 1;
      position: relative;
      .date-btn {
        text-align: center;
        padding-right:20px;
      }
      .icon-date:after{
        right:25px;
      }
      .datetime-x{
        position:absolute;
        top:0;
        bottom:0;
        width:100%;
        overflow:hidden;
        .vux-calendar:before{
          display:none;
        }
        .weui-cells{
          background-color:transparent;
          .weui-cell__hd,
          .vux-cell-bd{
            display:none;
          }
          .weui-cell__ft{
            font-size:0;
            height:60px;
          }
        }
      }
    }
  }
</style>