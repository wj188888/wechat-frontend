<template>
  <div class="market-share">
    <div class="share-img-outer">
      <img class="share-img" :src="marketer.headImg" alt="">
    </div>
    <p class="share-name">{{marketer.name}}</p>
    <p class="share-main-content" v-if="fromPage!=='popFocus'">邀请您关注 <span>{{brandName}}</span> 公众号</p>
    <p class="share-main-content" v-else>推荐您使用 <span>{{brandName}}</span></p>

    <div class="share-code-box">
      <img :src="codeUrl" alt="">
    </div>
    <p class="share-code-text">
      <span class="share-press-icon"></span>
      <span>长按识别二维码</span>
    </p>

    <div class="share-operation">
      <div class="share-operation-item" @click="sharePage">
        <div class="icon-wechat"></div>
        <p>发送给朋友</p>
      </div>
      <div class="share-operation-item" @click="sharePage">
        <div class="icon-friend"></div>
        <p>发送给朋友圈</p>
      </div>
      <div class="share-operation-item" @click="saveImg">
        <div class="icon-down"></div>
        <p>保存到本地</p>
      </div>
    </div>
  </div>
</template>
<script>
  import Config from '../../../utils/config'
  export default {
    data(){
      return {
        brandName: '',
        codeUrl: '',
      }
    },
    props: {
      marketer: {
        type: Object,
        default: function() {
            return {}
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
      proType: {
        default: ''
      },
      urlFirst: {
        default: ''
      },
      fromPage: {
        default: ''
      }
    },
    watch: {
      marketer: function(newVal, oldVal) {
        if(newVal.customerId!== oldVal.id&&!!newVal.customerId) {
          this.getCodeUrl();
        }
      },
      proType: function() {
        this.getCodeUrl();
      },
      urlFirst: function() {
        this.getCodeUrl();
      },
    },
    mounted () {
      this.brandName = appStorage.get('Brand_Name');
    },

    methods: {
      getCodeUrl() {
        if(this.urlFirst) {
          this.codeUrl = this.urlFirst;
        } else {
          this.codeUrl = `${Config.webUrl}/marketer/a/getShareQrCode?customerId=${this.marketer.customerId}&productTypeLevelTwo=${this.proType}`;
        }
      },
      sharePage () {
        if(this.shareTheme&&this.codeUrl){
          interfaceApi.share({
            share: true,
            shareUrl: location.href,
            shareTitle: this.shareTheme.title,
            shareDesc: this.shareTheme.description,
            shareImgUrl: this.codeUrl
          });

          this.$emit('shareFriend');
        }
      },
      saveImg() {
        this.$store.dispatch('showError', '长按图片进行保存');
      },
    }
  }
</script>
<style lang="less" scoped>
  .market-share {
    overflow: hidden;
    width: 100%;
    background: #fff;
  }
  .share-img-outer {
    width: 110px;
    height: 110px;
    margin: 46px auto 10px;

    border: 10px solid #fff5ee;
    border-radius: 100%;
    overflow: hidden;
  }
  .share-img {
    width: 100%;
    height: 100%;
  }
  .share-name {
    font-size: 20px;
    color: #4c4c4c;

    text-align: center;
  }

  .share-main-content {
    padding: 15px 0;
    font-size: 26px;
    color: #4c4c4c;

    text-align: center;
    span {
      font-weight: bold;
    }
  }
  .share-code-box {
    margin: 20px auto 0;

    width: 248px;
    height: 248px;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .share-code-text {
    padding: 15px 0;
    font-size: 22px;
    color: #888;

    text-align: center;
  }
  .share-press-icon {
    display: inline-block;
    width: 21px;
    height: 23px;

    background: url("../../../assets/fingerPress.png") no-repeat center center;
    background-size: 21px 23px;
    vertical-align: middle;
  }

  .share-operation {
    display: flex;

    padding: 0 20px;
    margin-bottom: 20px;
  }
  .share-operation-item {
    width: 0;
    flex: 1;

    font-size: 24px;
    color: #888;
    text-align: center;
  }
  .icon-wechat,
  .icon-friend,
  .icon-down {
    width: 100px;
    height: 100px;
    margin: 0 auto;

    background: url("../../../assets/share-wechat.png") no-repeat center center;
    background-size: 100px 100px;
  }
  .icon-friend {
    background: url("../../../assets/share-friend.png") no-repeat center center;
    background-size: 100px 100px;
  }
  .icon-down {
    background: url("../../../assets/share-down.png") no-repeat center center;
    background-size: 50px 50px;
  }

</style>
