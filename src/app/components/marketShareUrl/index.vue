<template>
  <div class="footer-modal" v-show="showModal">
    <div class="share-url-box" v-show="!shareCodeFlag">
      <div class="share-main-empty" @click="closeModal"></div>
      <div class="share-main">
        <div class="share-url" id="share-url">
          <div class="share-url__p1" v-for="(pro,index) of shareProduct">
            {{pro.productTypeLevelTwo|getProductTwoName}}的佣金比例为{{pro.commissionRate}}%
          </div>
          <div class="share-url__p2">朋友通过你分享的页面成功购买后，你可获得对应的佣金。</div>
          <!--<input type="text" class="hide"  value="www.baidu.com" id="shareUrl">-->
          <div class="share-operation">
            <div class="share-operation-item" @click="sharePage">
              <div class="share-icon icon-wechat"></div>
              <p class="share-url__p2">分享至微信</p>
            </div>
            <div class="share-operation-item btn">
              <div class="share-icon icon-url"></div>
              <p class="share-url__p2">复制链接</p>
            </div>
            <div class="share-operation-item" @click="shareCode">
              <div class="share-icon icon-code"></div>
              <p class="share-url__p2">二维码</p>
            </div>
          </div>
        </div>
        <div class="bottom-nav" v-if="showBottomNav">
          前往全民营销中心
        </div>
      </div>
    </div>

    <div class="qrcode-box" v-show="shareCodeFlag" @click="closeModal">
      <div @click.stop="stopFun">
        <MarketShare :marketer="marketer"
                     :proType="proType"
                     @shareFriend="shareFriend"
        ></MarketShare>
      </div>

    </div>

    <ShareModal :show="showShareModal"
                @closeShare="closeShare"></ShareModal>
  </div>

</template>
<script>
  import ShareModal from 'appComponents/shareModal/index.vue'
  import MarketShare from 'appComponents/marketShare/index.vue'

  export default {
    components: {
      ShareModal,
      MarketShare,
    },
    computed: {
      proType: function() {
        if(this.shareProduct&&this.shareProduct.length) {
            return this.shareProduct[0].productTypeLevelTwo;
        }
      }
    },
    props: {
      shareUrl: {
        type:String,
        default: '',
      },
      showModal: {
        default: false,
      },
      showBottomNav: {
        default: false,
      },
      shareProduct: {
        type: Array,
        default: function() {
          return [{productTypeLevelTwo:''}];
        }
      },
      shareTheme: {
        type: Object,
        default: function() {
          return {
            title: '邀请关注',
            description: '邀请关注描述...',
          }
        }
      },
    },
    data(){
      return {
        brandName: '',
        codeUrl: '',
        clipboardObj: '',
        showShareModal: false,
        marketer: {},
        shareCodeFlag: false,
      }
    },
    mounted () {
      this.initClipboard();
      this.getMarketInfo();
      console.log(this.shareProduct);
    },
    watch: {
      showModal: function(newVal) {
        if(newVal) {
          this.shareCodeFlag = false;
        }
      }
    },
    methods: {
      initClipboard() {
        let that = this;
        this.clipboardObj = null;
        this.clipboardObj = new Clipboard('.btn', {
          text: function() {
              return that.shareUrl;
          }
        });
        this.clipboardObj.on('success', function(e) {
          that.$store.dispatch('showSuccess', '复制成功');
          e.clearSelection();
        });
        this.clipboardObj.on('error', function(e) {
          that.$store.dispatch('showError', '复制失败');
        });
      },
      getMarketInfo() {
        api.getMarketInfo().then((res) => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.marketer = data.resultData || {};
            console.log(this.marketer);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      stopFun() {
        return null;
      },
      sharePage () {
        if(this.shareTheme&&this.shareUrl){
          interfaceApi.share({
            share: true,
            shareUrl: this.shareUrl,
            shareTitle: this.shareTheme.title,
            shareDesc: this.shareTheme.description,
            shareImgUrl: this.marketer.headImg
          });

          this.shareFriend();
        }
      },
      closeModal() {
        this.$emit('closeModal');
      },
      shareFriend() {
        this.showShareModal = true;
      },
      closeShare() {
        this.showShareModal = false;
      },
      shareCode() {
        this.shareCodeFlag = true;
      }
    }
  }
</script>
<style lang="less" scoped>
  .footer-modal {
    position:absolute;
    top:0;
    bottom:0;
    z-index: 200;

    width:100%;
    background:rgba(0,0,0,0.5);
  }
  .qrcode-box {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    width: 100%;

    padding: 80px 40px 0;
  }
  .share-url-box {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;

    width: 100%;
  }
  .share-main-empty {
    flex: 1;
  }

  .share-main {

  }
  .share-url {
    padding: 15px 50px;
    background: #f0f0f0;
  }
  .share-url__p1 {
    font-size: 32px;
    color: #4c4c4c;
    text-align: center;
    padding: 15px 0 0;
    line-height: 1.4;
  }
  .share-url__p2 {
    font-size: 24px;
    color: #888;
    text-align: center;
    padding: 15px 0;
    line-height: 1.4;
  }

  .share-operation {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
  }
  .share-operation-item {

  }
  .share-icon {
    width: 120px;
    height: 100px;
    margin-bottom: 20px;
  }
  .icon-wechat {
    background: url("../../../assets/share-wechat.png") no-repeat center center;
    background-size: 100px 100px;
  }
  .icon-url {
    background: url("../../../assets/share-url.png") no-repeat center center;
    background-size: 100px 100px;
  }
  .icon-code {
    background: url("../../../assets/share-code.png") no-repeat center center;
    background-size: 100px 100px;
  }

  .bottom-nav {
    width: 100%;
    height: 80px;
    line-height: 80px;

    text-align: center;
    background: #fff;
    font-size: 32px;
    color: #4c4c4c;
  }


</style>
