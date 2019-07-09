<template>
  <main-box :title="title" main-class="bg-fff" :show-more="false">
    <scroll ref="scroll"
            v-show="!showNoData"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
      <ul class="bus-news-list">
        <li v-for="data in listData" @click="jumpToBusNewsDetail(data)">
          <p class="time">{{data.businessData.publishTime | formatDate('monthDayHour')}}</p>
          <div class="card">
            <div class="img" :style="data.businessData.image ? {backgroundImage:'url(\'' + data.businessData.image + '\')'} : ''"></div>
            <p class="title">{{data.title}}</p>
            <p class="news-detail">涉及线路：{{data.businessData.relatedLine}}</p>
            <p class="show-news-detail line line-x-t">查看详情<i class="icon-r-jt"></i></p>
          </div>
        </li>
      </ul>
    </scroll>
    <no-result :show="showNoData" text="暂无消息"></no-result>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
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
        listData: [],
        totalPage: '',
        showNoData: false,
        searchKeys: {
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
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
          this.listData = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
  
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.systemNoticeFindBusNotice(this.searchKeys)
        .then(res=>{
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.showNoData = !data.resultData.content.length
            this.listData = this.listData.concat(data.resultData.content);
            this.totalPage = data.resultData.totalPages
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
              this.searchKeys.pageNo++
            }
          }
        })
      },
  
      jumpToBusNewsDetail (data) {
        this.$router.push({
          name: 'busNewsDetail',
          query:{
            businessId: data.businessId
          }
        })
      }
      
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .bus-news-list{
    padding: 0 20px;
    .time{
      padding:40px 0 20px;
      text-align: center;
      font-size:24px;
      color:#888;
    }
    .card{
      border-radius:8px;
      box-shadow: 0 1PX 10px #ccc;
      overflow:hidden;
      .img{
        height:260px;
        background:url("../../../assets/bus/news_bg.png") no-repeat center center;
        background-size:cover;
        margin-bottom:20px;
      }
      p{
        padding:0 20px;
      }
      .title{
        margin-bottom:20px;
        font-size:32px;
        color:#121212;
      }
      .news-detail{
        margin-bottom:40px;
        font-size:28px;
        color:#4c4c4c;
      }
      .show-news-detail{
        height:80px;
        line-height:80px;
        font-size:28px;
        color:#4c4c4c;
      }
    }
  }
</style>