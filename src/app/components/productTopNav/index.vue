<template>
  <ul class="top-nav line line-box radius-box" v-if="show">
    <li :class="{'vux-1px-r': index === 0, active: index === active}" @click="navRouter" v-for="(nav, index) in navList">
      <a><i class="icon-common" :class="[nav.iconClass]"></i>{{nav.name}}</a>
    </li>
  </ul>
</template>
<script>
  TOOL.getMenuName()
  console.log(TOOL.LINE_CAR_POOL_BUS)
  export default {
    props:{
      show: {
        type:Boolean,
        default: true
      },
      ctg: String,
      active: Number,
      nav1router:{
        type:Function,
        default: () => ''
      },
      nav2router:{
        type:Function,
        default: () => ''
      }
    },
    data () {
      return {
        AIRPORT_BUS:[
          {name: '接机', iconClass: 'icon-pick'},
          {name: '送机', iconClass: 'icon-send'}
        ],
        SCHOOL_BUS:[
          {name: '校园专线', iconClass: 'icon-p-school'},
          {name: '校园专车', iconClass: 'icon-p-high'}
        ],
        TRAIN_STATION_BUS:[
          {name: '接站', iconClass: 'icon-train'},
          {name: '送站', iconClass: 'icon-train'}
        ],
        LINE_BUS:[
          {name: TOOL.CUSTOM_BUS, iconClass: 'icon-train'},
          {name: TOOL.LINE_BUS, iconClass: 'icon-train'}
        ],
        WORK_BUS:[
          {name: '工作班车', iconClass: 'icon-p-work'},
          {name: '企业班车', iconClass: 'icon-p-company'}
        ],
      }
    },
    computed: {
      navList () {
        return this[this.ctg]
      }
    },
    mounted () {

    },
    methods:{
      navRouter () {
        if(this.active === 1){
          this.nav1router()
        }else{
          this.nav2router()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .top-nav {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 90px;
    line-height: 55px;
    padding: 20px;
    margin-bottom: 20px;
    background-color: @c-fff;
    text-align: center;
    > li {
      display: block;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      height: 100%;
      > a {
        font-size: 28px;
        color: @c-999;
      }
      &.active a {
        color: @c-121212;
      }
      &.active .icon-p-work {
        background-image: url("../../../assets/work/work.png");
      }
      &.active .icon-p-company {
        background-image: url("../../../assets/work/company_yes.png");
      }
      &.active .icon-send {
        background-image: url("../../../assets/airport/songji.png");
      }
      &.active .icon-pick {
        background-image: url("../../../assets/airport/jieji.png");
      }
      &.active .icon-p-school {
        background-image: url("../../../assets/work/xiaoyuan1.png");
      }
      &.active .icon-p-high {
        background-image: url("../../../assets/work/xiaoyuan2_yes.png");
      }
      &.active .icon-train {
        background-image: url("../../../assets/train/train_on.png");
      }
      &.active .icon-charter {
        background-image: url("../../../assets/charter/charter.png");
      }
    }
    .icon-common {
      display: inline-block;
      width: 28px;
      height: 100%;
      background:no-repeat center center;
      background-size: 100%;
      margin-right: 10px;
      vertical-align: top;
    }
    .icon-p-work {
      background-image: url("../../../assets/work/work_no.png");
    }
    .icon-p-company {
      background-image: url("../../../assets/work/company.png");
    }
    .icon-send {
      background-image: url("../../../assets/airport/songji_no.png");
    }
    .icon-pick {
      background-image: url("../../../assets/airport/jieji_no.png");
    }
    .icon-p-school {
      background-image: url("../../../assets/work/xiaoyuan1_no.png");
    }
    .icon-p-high {
      background-image: url("../../../assets/work/xiaoyuan2.png");
    }
    .icon-charter{
      background-image: url("../../../assets/charter/charter_no.png");
    }
    .icon-train {
      background-image: url("../../../assets/train/train.png");
    }
  }
</style>
