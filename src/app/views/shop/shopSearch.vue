<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="city-s-top">
      <search-address holder="请输入要搜索的商品名称" @searchCity="goodsTypeAhead"></search-address>
      <ticket-title title="搜索历史" v-if="searchGoodsHistory.length">
        <slot name="title">
          <i class="delete-shop-history" @click="clearSearchHistory"></i>
        </slot>
      </ticket-title>
      <div class="city-top-box pad-t-20 pad-b-0 line line-x-t" v-if="searchGoodsHistory.length">
        <ul class="hot-city">
          <li v-for="goods in searchGoodsHistory" @click="jumpDetail(goods)">
            <a>{{goods.name}}</a>
          </li>
        </ul>
      </div>
    </div>
    <a-list :show="!showNoResult" :list-data="goods" type="nameHtml" @setValue="jumpDetail"></a-list>
    <no-result :show="showNoResult" :text="noResultText"></no-result>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import TicketTitle from 'appComponents/title/ticketTitle'
  import SearchAddress from 'appComponents/searchAddress/index'
  import AList from 'appComponents/aList/index'
  import NoResult from 'appComponents/noResult/index'
  
  export default {
    components: {
      MainBox,
      TicketTitle,
      SearchAddress,
      AList,
      NoResult
    },
    data () {
      return {
        title: this.$route.meta.title,
        hasCity:'',
        searchGoodsHistory:[],
        goods: [],
        showNoResult: true,
        noResultText:'请输入关键字进行搜索'
      }
    },
    watch: {
    
    },
    mounted () {
      if(appStorage.get('searchGoodsHistory')){
        this.searchGoodsHistory = JSON.parse(appStorage.get('searchGoodsHistory'))
      }
    },
    methods:{
      goodsTypeAhead (keyword) {
        if(!keyword){
          this.noResultText = '请输入关键字进行搜索'
          return
        }
        api.goodsTypeAhead(keyword).then(res=>{
          let data = TOOL.toJson(res.data)
          if(data.resultCode === '0'){
            this.goods = data.resultData
            let len = this.goods.length
            this.showNoResult = !len
            this.noResultText = this.showNoResult ? '暂无搜索结果' : '请输入关键字进行搜索'
            for(let i = 0; i < len; i ++){
              this.goods[i].nameHtml = this.goods[i].name.replace(keyword, `<em style="color:#ff6600">${keyword}</em>`)
            }
          }
        })
      },
  
      clearSearchHistory () {
        this.searchGoodsHistory = []
        appStorage.remove('searchGoodsHistory')
      },
      
      setSearchGoodsHistory (listData) {
        let len = this.searchGoodsHistory.length
        for(let i = 0; i < len; i++){
          if(this.searchGoodsHistory[i].id === listData.id){
            this.searchGoodsHistory.splice(i, 1)
            break;
          }
        }
        this.searchGoodsHistory.unshift(listData)
        this.searchGoodsHistory = this.searchGoodsHistory.splice(0, 5)
        appStorage.set('searchGoodsHistory', JSON.stringify(this.searchGoodsHistory))
      },
      
      jumpDetail (listData) {
        this.setSearchGoodsHistory(listData)
        this.$router.push({
          name: 'shopDetail',
          query: {
            id: listData.id
          }
        })
      }
    }
  }
</script>
<style>
  .delete-shop-history{
    position: absolute;
    top:0;
    right:0;
    display: block;
    width: 80px;
    height:100%;
    background:url("../../../assets/lajitong.png") no-repeat 30px center;
    background-size: 30px 30px;
  }
</style>
<style lang="less" scoped>

</style>
