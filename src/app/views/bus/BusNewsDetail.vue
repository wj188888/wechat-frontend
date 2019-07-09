<template>
  <main-box :title="title" main-class="bg-fff" :show-more="false">
    <div class="news-detail-box">
      <h2 class="news-title">{{newsData.title}}</h2>
      <p class="news-time">
        <span>{{newsData.publishTime | formatDate('monthDay')}}发布</span>
      </p>
      <p class="news-content" v-html="newsData.content"></p>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  
  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        businessId:'',
        newsData: '',
      }
    },
    mounted () {
      this.businessId = this.$route.query.businessId
      this.publicBusChangeNotice()
    },
    methods: {
      publicBusChangeNotice () {
        api.publicBusChangeNotice(this.businessId)
        .then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.newsData = data.resultData
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .news-detail-box{
    padding:30px 20px;
  }
  .news-title{
    margin-bottom: 30px;
    font-size:32px;
    color:#121212;
    text-align: center;
  }
  .news-time{
    width: 60%;
    margin:0 auto 60px;
    border-top:2px solid #ccc;
    font-size:24px;
    color:#888;
    text-align: center;
    span{
      position: relative;
      top:-12px;
      padding:10px 40px;
      background:#fff;
    }
  }
  .news-content{
    line-height:1.6;
    font-size:30px;
    color:#4c4c4c;
  }
</style>