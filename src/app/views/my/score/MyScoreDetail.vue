<template>
  <main-box :title="title" :show-more="false">
    <div class="ticket-scroller top-0">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div>
          <ul class="score-detail-list" v-if="!noData">
            <li class="line line-x-b" v-for="data in datas">
              <p class="name">{{data.message}}</p>
              <p class="time">{{data.createdTime | formatDate('monthDayHour')}}</p>
              <p class="score" :class="{'score-sub': data.integralPrice > 0}">{{data.integralPrice}}</p>
            </li>
          </ul>
          <no-result :show="noData" text="暂无兑换记录"></no-result>
        </div>
      </scroll>
    </div>
  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import NoResult from 'appComponents/noResult/index'

  export default {
    components: {
      MainBox,
      Scroll,
      NoResult
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        searchKeys: {
          pageNo: 0,
          pageSize: 25
        },
        datas: [],
        noData: true,
      }
    },
    mounted () {
      this.searchKeys.pageNo = 0
      this.onPullingUp()
    },
    methods: {
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.datas = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
          this.$refs.scroll.enable()
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      
      /**
       * 查询我的优惠券
       */
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.wxUserIntegralFind(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.datas = this.datas.concat(data.resultData.content)
            this.noData = !this.datas.length
            this.totalPage = data.resultData.totalPages
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
              this.searchKeys.pageNo++
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../styles/theme.less";
  .top-0{
    top:0 !important;
  }
  .score-detail-list{
    background-color: @bg-fff;
    li{
      height:100px;
      padding:20px;
    }
    .name{
      margin-bottom:14px;
      font-size:28px;
      color: @fc-121212;
    }
    .time{
      font-size:24px;
      color: @fc-888;
    }
    .score{
      position: absolute;
      right:20px;
      top:50%;
      transform: translateY(-50%);
      font-size:32px;
      color: @fc-888;
    }
    .score-sub{
      color:@fc-ff6600;
    }
  }
</style>
