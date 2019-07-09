<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox">
    <div class="pop">
      <p class="pop__p1">
        通过分享产品链接，用户进行下单前的注册登录，完成注册，可累计推广注册的新增人数。
      </p>

      <div class="pop__share">
        <MarketShare :marketer="marketer"
                     @shareFriend="shareFriend"
        ></MarketShare>
      </div>

      <h3 class="pop__title">
        奖励说明
      </h3>
      <p class="pop__p2" v-if="registerRewardSetting.rewardType == '1'">1、可累计计算奖励。</p>
      <p class="pop__p2" v-else>1、阶梯计算奖励，到达提现日期，计算最高达到的奖励，不可累计计算奖励。</p>
      <p class="pop__p2" v-if="!!registerRewardSetting.limit&&registerRewardSetting.limitFlag==1">2、每{{rewardDate[registerRewardSetting.limitUnit]}}总的奖励金额限制在{{registerRewardSetting.limit}}元以内，先领先得。</p>
      <p class="pop__p2" v-else>2、奖金金额不限制。</p>

      <h3 class="pop__title">
        奖励列表
      </h3>

      <div class="pop__table-box" v-if="registerRewardSetting.rewardType == '1'">
        <table>
          <tr>
            <th>推广关注</th>
            <th>奖励金额</th>
          </tr>
          <tr v-for="(val, index) of registerRewardSetting.rewardDetailList">
            <td>{{val.above}}人</td>
            <td>{{val.rewardAmount | formatPrice}}</td>
          </tr>
        </table>
      </div>
      <div v-else>
        <p class="pop__p2" v-for="(val, index) of registerRewardSetting.rewardDetailList">
          <span v-if="index == 0">
            每个关注奖励{{val.rewardAmount}}元
          </span>
          <span v-else>
            累计推广关注达{{val.above}}人，每个关注奖励{{val.rewardAmount}}元
          </span>
        </p>
      </div>
    </div>

    <div slot="footer">
      <ShareModal :show="showShareModal"
                  @closeShare="closeShare"
      ></ShareModal>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import MarketShare from 'appComponents/marketShare/index.vue'
  import ShareModal from 'appComponents/shareModal/index.vue'

  export default {
    components: {
      MainBox,
      MarketShare,
      ShareModal,
    },
    data() {
      return {
        title: this.$route.meta.title,
        marketData: {},
        rewardDate: {
          day: '日',
          week: '周',
          month: '月',
        },
        registerRewardSetting: {},
        marketer: {},
        showShareModal: false,
        shareText: '<p>请点击右上角将此页面</p><p>分享给你的好友或分享至朋友圈吧</p>'
      }
    },
    mounted () {
      this.getMarketSet();
      this.getMarketInfo();
    },
    methods: {
      getMarketSet() {
        api.getMarketSet().then((res) => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.marketData = Object.assign({}, this.marketData, data.resultData);
            this.registerRewardSetting = Object.assign({},this.marketData.registerRewardSetting);
            console.log(this.registerRewardSetting);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
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
      shareFriend() {
        this.showShareModal = true;
      },
      closeShare() {
        this.showShareModal = false;
      },
    }

  }
</script>
<style lang="less" scoped>
  .pop {
    padding: 20px;
  }
  .pop__p1,
  .pop__p2 {
    font-size: 28px;
    color: #4c4c4c;
    line-height: 1.4;

    text-align: justify;
  }
  .pop__p2 {
    font-size: 26px;
  }
  .pop__title {
    font-size: 28px;
    color: #121212;
    padding: 10px 0;
  }
  .pop__share {
    padding: 40px;
  }
  .pop__table-box {
    padding: 20px;

  table {
    width: 100%;

    border-collapse: collapse;
    text-align: center;
  }
  td, th {
    height: 80px;
    border: 1px solid #e0e0e0;

    font-size: 24px;
    color: #888;
  }
  th {
    font-size: 26px;
    color: #4c4c4c;
  }
  }
</style>