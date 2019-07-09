<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox">
    <div class="market">
      <div class="market-title">点击下列产品类别，快速分享拿佣金。</div>
      <div class="market-product-box">
        <div class="market-product-item"
             :class="{'color1':index%3===1,'color2':index%3===2,'color3':index%3===0}"
             @click="marketProShareUrl(val)"
             v-for="(val, index) of productList"
        >
          <p class="pro-title">{{val.productTypeLevelTwo|getProductTwoName}}</p>
          <p>
            <span class="pro-percent">{{val.commissionRate}}</span>
            <span class="pro-text">% 佣金</span>
          </p>
        </div>
      </div>
    </div>

    <div slot="footer">
      <ShareUrl :shareUrl="shareData.shareUrl"
                :showModal="showFooter"
                :shareProduct="shareProduct"
                @closeModal="closeModal"
      ></ShareUrl>
    </div>

  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ShareUrl from 'appComponents/marketShareUrl/index.vue'

  // cache marketSetting
  export default {
    components: {
      MainBox,
      ShareUrl,
    },
    data() {
      return {
        title: this.$route.meta.title,
        productList: [],
        showFooter: false,
        shareData: {},
        shareProduct: [],
      }
    },
    mounted () {
      this.getMarketSet();
    },
    methods: {
      getMarketSet() {
        api.getMarketSet().then((res) => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.productList = data.resultData.marketProductSettingList || [];
            console.log(this.productList);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      marketProShareUrl(proData) {
        this.shareProduct = [];
        api.marketProShareUrl({
          productTypeLevelTwo: proData.productTypeLevelTwo
        }).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.shareData = data.resultData;
            this.shareProduct.push({
              productTypeLevelOne: proData.productTypeLevelOne,
              productTypeLevelTwo: proData.productTypeLevelTwo,
              commissionRate: proData.commissionRate,
            });
            this.showFooter = true;
            console.log(data.resultData);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      closeModal() {
        this.showFooter = false;
      }
    }
  }
</script>
<style lang="less" scoped>


  .market {
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .market-title {
    padding: 30px 20px 20px;
    font-size: 32px;
    color: #4c4c4c;
    text-align: center;
  }
  .market-product-box {
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    /*justify-content: flex-start;*/
    width: 100%;
  }
  .market-product-item {
    /*float: left;*/
    width: 30%;
    padding: 20px;
    margin: 20px 0;
    border-radius: 10px;
    background: green;
  }
  .market-product-item:nth-of-type(3n + 2) {
    margin: 20px 5%;
  }
  .pro-title {
    padding-bottom: 20px;
    font-size: 32px;
    color: #fff;
  }
  .pro-percent {
    font-size: 40px;
    color: rgba(255,255,255,.5);
  }
  .pro-text {
    font-size: 24px;
    color: rgba(255,255,255,.5);
  }
  .color1 {
    background: #f3853b !important;
  }
  .color2 {
    background: #448ddf !important;
  }
  .color3 {
    background: #e44e95 !important;
  }
</style>