<template>
  <main-box :title="title">
    <scroll ref="scroll"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
      <div>
        <div class="info-top">
          <div class="driver-avatar"  :style="detailData.avatar ? {backgroundImage:'url(\'' + detailData.avatar + '\')'} : ''"></div>
          <div class="it-ver intel">
            <img class="zizhi" src="../../../assets/car/zizhi.png">
            <span>资质认证</span>
          </div>
          <div class="it-ver verify">
            <img class="shiming" src="../../../assets/car/shiming.png">
            <span>实名认证</span>
          </div>
        </div>
        <div class="driver-detail-box pad-40">
          <div class="driver-row mar-b-20">
            <p>司机姓名：<em>{{detailData.firstName}}师傅</em></p>
            <p>隶属公司：<em>{{detailData.companyName}}</em></p>
          </div>
          <div class="driver-row">
            <p>司机驾龄：<em>{{detailData.driveAge}}年</em></p>
            <p>用户评价：<em class="score">{{ score ? score.toFixed(1) : '5.0' }}</em></p>
          </div>
        </div>
        <div class="driver-detail-box pad-40 mar-t-20" v-if="detailData.licensePlat">
          <div class="driver-row mar-b-20">
            <p>车辆品牌：<em>{{detailData.brandName}}</em></p>
            <p>车辆属性：<em>{{detailData.belongType == 1 ? '自营' : '合营'}}</em></p>
          </div>
          <div class="driver-row">
            <p>车辆座位：<em>{{detailData.totalSeats}}</em></p>
            <p>车牌号码：<em>{{detailData.licensePlatProvince}}&nbsp;{{detailData.licensePlat}}</em></p>
          </div>
        </div>
        <div class="driver-detail-box pad-40 mar-t-20">
          <div class="driver-row">
            <p>累计报价：<em>{{detailData.quoteTimes}}次</em></p>
            <p>成功签约：<em>{{detailData.signTimes}}次</em></p>
          </div>
        </div>
        <div class="user-eval">
          <h3 class="eval-title line line-x-b">
            用户评价<span class="total">{{totalElements}}次</span>
          </h3>
          <ul class="eval-lists" v-if="!noEval">
            <li class="line line-x-b" v-for="evalData in evalDatas" >
              <div class="eval-avator" :style="evalData.headimgurl ? {backgroundImage:'url(\'' + evalData.headimgurl + '\')'}:''"></div>
              <div class="eva-info">
                <div class="clearfix">
                  <div class="pull-left">
                    <p class="eval-nickname">{{evalData.nickname == '***' ? '匿名' : evalData.nickname}}</p>
                    <p class="star-small-box" v-html="renderStar(evalData.score)"></p>
                  </div>
                  <p class="pull-right">{{evalData.createdTime}}</p>
                </div>
                <p class="eval-comment">{{evalData.comment}}</p>
              </div>
            </li>
          </ul>
          <div class="no-eval" v-if="noEval">暂无评价</div>
        </div>
      </div>
    </scroll>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  
  export default {
    components: {
      MainBox,
      Scroll
    },
    data () {
      return {
        title: this.$route.meta.title,
        totalElements:0,
        totalPage: '',
        searchKeys: {
          productTypeLevelOne:'',
          driverId: '',
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        detailData: {
          carImageList:[]
        },
        id: '',
        productTypeLevelOne:'',
        evalDatas: '',
        noEval: false,
        score: 0,
      }
    },
    mounted () {
      this.id = this.$route.query.id;
      this.searchKeys.productTypeLevelOne = this.$route.query.productTypeLevelOne;
      this.searchKeys.driverId = this.id
      this.onPullingUp()
    },
    methods: {
      renderStar (star) {
        return TOOL.renderStar(star)
      },
      
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.evalDatas = []
          this.findDriverDetail()
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },

      findDriverDetail () {
        this.$store.commit('UPDATE_LOADING', true)
        api.driverDetailById(this.id).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.detailData = data.resultData
            if(this.searchKeys.productTypeLevelOne === 'CAR_HAILING'){
              this.score = this.detailData.chScore
            }else if(this.searchKeys.productTypeLevelOne === 'TAXI'){
              this.score = this.detailData.taxiScore
            }else{
              this.score = this.detailData.score
            }
          }
        })
      },
  
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.evalByDriverId(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.totalElements = data.resultData.totalElements
            this.totalPage = data.resultData.totalPages
            this.evalDatas = this.evalDatas.concat(data.resultData.content)
            this.noEval = !data.resultData.content.length
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
  .info-top {
    position: relative;
    height: 164px;
    background-color: #f2f2f2;
    .driver-avatar{
      position: absolute;
      top: 71px;
      left: 20px;
      width: 118px;
      height: 118px;
      -webkit-border-radius: 59px;
      -moz-border-radius: 59px;
      border-radius: 59px;
      background-position:center center;
      background-repeat:no-repeat;
      background-size:118px 118px;
      background-image:url("../../../assets/driver.png");
      z-index: 500;
    }
    .it-ver{
      float: left;
      height: 36px;
      margin-top: 120px;
      img{
        display: block;
        float: left;
      }
      span {
        float: left;
        display: block;
        font-size: 14px;
        margin-left: 11px;
        height: 36px;
        line-height: 36px;
      }
    }
    .intel {
      margin-left: 156px;
        img {
          width:36px;
          height:36px;
        }
    }
    .verify {
      margin-left: 17px;
      img {
        width: 39px;
        height: 34px;
        margin-top:3px;
      }
    }
  }

  .driver-detail-box{
    background-color: #fff;
    &.pad-40{
       padding: 40px;
    }
    .driver-row{
      display: flex;
      width: 100%;
      p{
        flex:1;
        line-height:30px;
        font-size: 28px;
        color: #4c4c4c;
        em{
          color: #121212;
        }
        .score{
          position:relative;
          padding-left:32px;
          font-size:24px;
          color:#ff6600;
          &:before{
             content: "";
             display:block;
             position: absolute;
             top:-2px;
             left:0;
             width: 30px;
             height:28px;
             background:url("../../../assets/car/star_yellow.png") no-repeat 2px center;
             background-size:26px 26px;
           }
        }
      }
    }
  }

  .user-eval {
    margin-top: 20px;
    background-color: #fff;
    .eval-title {
      position: relative;
      font-size: 24px;
      color: #4c4c4c;
      height: 56px;
      line-height: 56px;
      padding-left: 20px;
      margin: 0;
      .total {
        position: absolute;
        top: 5px;
        right: 20px;
      }
    }
    .eval-lists {
      li{
        padding: 20px 20px 40px 20px;
      }
      .eval-avator{
        float:left;
        width:70px;
        height:70px;
        border-radius:50%;
        background:url("../../../assets/user-avator.png") no-repeat center center;
        background-size:70px 70px;
      }
      .eva-info{
        margin-left:90px;
        font-size:22px;
        color: #4c4c4c;
      }
      .eval-nickname{
        margin:5px 0 5px 5px;
        font-size:24px;
      }
      .eval-comment{
        margin-top:45px;
        font-size:24px;
        color:#121212;
      }
    }
    .no-eval{
      font-size: 24px;
      color: #999;
      text-align:center;
      padding:85px 0;
    }
  }
</style>
