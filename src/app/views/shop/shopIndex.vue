<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="suggest-header">
      <div class="city-wrapper">
        <div class="city-content border-right-1px">
          <div class="city-select" @click="showSortDialog">
            <span class="text">{{ searchKeys.clazz || '全部' }}</span>
            <i class="mfic-pulldown"></i>
          </div>
        </div>
      </div>
      <div class="address-wrapper">
        <input type="text" class="address-input" placeholder="输入商品名称搜索" readonly @click="jumpToShopSearch">
      </div>
    </div>
    <div class="sort-type-box line line-x-t" v-if="showSort" @click="showSort = false">
      <div class="sort-type-list scrollingBox">
        <ul>
          <li class="line line-x-b" @click.stop="changeSortType()">全部</li>
          <li class="line line-x-b" v-for="data in sortTypeDatas" @click.stop="changeSortType(data)"> {{ data.content }}</li>
        </ul>
      </div>
    </div>
    <div class="page" v-show="!noData">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div class="wareListBox">
          <ul class="wareUl">
            <li class="wareLi" v-for="(list, index) in shopList"
                @click="jumpDetail(list)">
              <img class="wareImg" :src="list.primaryImage" alt="">
              <div class="wareTxtBox">
                <h2 class="wareTitle">{{list.name | strSplit(20)}}</h2>
                <div class="wareText">
                  <p class="warePrice">￥<span class="f-s-32">{{list.minPrice}}</span></p>
                  <span class="numTxt">已售{{list.sales}}份</span>
                </div>
              </div>
            </li>
          
          </ul>
        </div>
      </scroll>
    </div>
    <div v-show="noData">
      <div class="no-open" >
        <img src="../../../assets/my/youhuiquan1.png">
        <p>现在还没有商品哦！</p>
      </div>
    </div>
  </main-box>
</template>
<script>
  import CHeader from 'components/c-header/index.vue'
  import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  
  export default {
    components: {
      CHeader,
      MainBox,
      Scroll
    },
    data () {
      return {
        shopList: [],
        totalPage: '',
        sortTypeDatas: [],
        searchKeys: {
          sortType:'',
          sortName:'',
          clazz:'',
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        showSort: false,
        noData: false,
        title: '商品列表',
      }
    },
    watch: {
    
    },
    mounted () {
      this.searchKeys.pageNo = 0
      this.onPullingUp();
      this.goodsClassFindAll()
    },
    methods:{
      showSortDialog () {
        if(this.sortTypeDatas && this.sortTypeDatas.length){
          this.showSort = !this.showSort
        }else{
          this.$store.dispatch('showError', '暂无其他分类商品');
        }
      },
      
      /**
       * 更换类别
       */
      changeSortType (data) {
        this.showSort = false
        if(data){
          this.searchKeys.clazz = data.content
        }else{
          this.searchKeys.clazz = ''
        }
        
        this.searchKeys.pageNo = 0
        this.onPullingUp();
      },
      
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.shopList = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      loadPageList() {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.findShopList(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            if(data.resultData.content) {
              
              this.shopList = this.shopList.concat(data.resultData.content)
              setTimeout(() => {
                if(this.$refs.scroll){
                  this.$refs.scroll.forceUpdate(true)
                }
              }, 20)
              if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
                this.searchKeys.pageNo++
              }
              if(this.shopList && this.shopList.length) {
                this.noData = false;
                $('.app-container').css('background','#fff');
              } else {
                this.noData = true;
                $('.app-container').css('background','#f2f2f2');
              }
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
  
      goodsClassFindAll () {
        api.goodsClassFindAll().then(res=>{
          let data = TOOL.toJson(res.data)
          if(data.resultCode === '0'){
            this.sortTypeDatas = data.resultData || []
          }
        })
      },
      
      jumpDetail(listData) {
        this.$router.push({
          name: 'shopDetail',
          query: {
            id: listData.id
          }
        })
      },
  
      jumpToShopSearch () {
        this.$router.push({
          name: 'shopSearch'
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .suggest-header {
    position: relative;
    z-index: 10;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 44PX;
    white-space: nowrap;
    background: #fff;
    box-shadow: 0 2PX 3PX rgba(0,0,0,.12);
    overflow:hidden;
    .city-wrapper {
      padding: 13PX 0;
      &.flex-input{
        flex:1;
      }
      .city-content {
        height: 18PX;
        .city-select {
          line-height: 18PX;
          padding: 0 16PX;
          font-size: 0;
          .text {
            display: inline-block;
            margin-right: 4PX;
            vertical-align: top;
            color: #666;
            font-size: 14PX;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .mfic-pulldown {
            display: inline-block;
            vertical-align: top;
            color: #999;
            font-size: 16PX
          }
          
        }
      }
    }
    
    .address-wrapper {
      position: relative;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      padding: 10PX;
      .address-input {
        display: table-cell;
        width: 100%;
        margin-top: -10PX;
        padding: 14PX 0;
        vertical-align: middle;
        font-size: 14PX;
        background: url("../../../assets/bus/search.png") no-repeat center right;
        background-size: 30px 30px;
        &::placeholder {
          color: #ccc
        }
      }
    }
  }
  @font-face {
    font-family: icon;
    src: url("../../../../static/fonts/icon-v9.woff") format('woff'),url("../../../../static/fonts/icon-v9.ttf") format('truetype'),url("../../../../static/fonts/icon-v9.svg#icon") format('svg')
  }
  
  [class*=" mfic-"],[class^=mfic-] {
    font-family: icon!important;
    font-size: 100%;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: .2px;
    -moz-osx-font-smoothing: grayscale
  }
  
  .mfic-pulldown:before {
    content: "\E603"
  }
  
  .mfic-pullup:before {
    content: "\E604"
  }
  .bg-fff {
    background: #fff !important;
  }
  .page{
    position: absolute;
    top:44PX;
    bottom:0;
    width: 100%;
    background-color: #fff;
  }
  .wareListBox{
    width: 100%;
  }
  .wareUl{
    display: flex;
    padding: 20px;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .wareLi{
    width: 48.5%;
    margin-bottom: 20px;
    box-shadow: 0 1PX 4px rgba(0, 0, 0, 0.2);
    .wareImg{
      width: 100%;
      height: 194px;
    }
  }
  .wareTxtBox{
    width: 100%;
    padding: 6px 20px;
    background: #fff;
    .wareTitle{
      font-size: 28px;
      color: #121212;
      height: 60px;
      padding-top: 4px;
      overflow: hidden;
      word-break: break-all;
      word-wrap: break-word;
      margin-top: 14px;
      margin-bottom: 30px;
      line-height: 30px;
    }
    .wareText{
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      height: 30px;
      align-items: center;
      font-size: 24px;
      margin-bottom: 24px;
    }
  }
  .warePrice{
    color: #ff6600;
  }
  .f-s-32{
    font-size: 32px !important;
  }
  .numTxt{
    color: #888888;
  }
  .sort-type-box{
    position: absolute;
    top:44PX;
    width:100%;
    bottom:0;
    z-index:100;
    background: rgba(0, 0, 0, 0.6);
    .sort-type-list{
      width:100%;
      height:480px;
      background:#fff;
      overflow:scroll;
    }
    li{
      height:86px;
      line-height:86px;
      padding:0 20px;
      color:#4d4d4d;
      font-size:14PX;
    }
  }
</style>
