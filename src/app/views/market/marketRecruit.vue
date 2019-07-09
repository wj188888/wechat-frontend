<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox">
    <div class="recruit-plan" v-html="marketData.marketRecruitSchedule.content">
    </div>

    <div slot="footer">
      <div class="abs-bottom-box  line line-x-t" v-if="!marketer">
        <div class="buy-right buy-w100" >
          <a  class="button button-primary"
             @click="marketApply"
          >加入全名营销</a>
        </div>
      </div>

      <div v-if="!!marketer&&(marketer.status==3||marketer.status==4)" class="abs-bottom-box  line line-x-t">
        <div class="buy-right buy-w100" >
          <a class="button button-primary disabled"
          >{{marketerStatus[marketer.status]}}</a>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox
    },
    data() {
      return {
        title: this.$route.meta.title,
        marketData: {
          marketRecruitSchedule: {
              content: '',
          }
        },
        marketerStatus: {
            '1': '正常',
            '2': '清退',
            '3': '申请中',
            '4': '申请被驳回',
        },
        marketer: '',
      }
    },
    mounted () {
      this.init();
    },
    methods: {
      init() {
        this.getMarketSet();
        this.getMarketInfo();
      },
      getMarketSet() {
        api.getMarketSet().then((res) => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.marketData = Object.assign(this.marketData, data.resultData);
            console.log(data);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      getMarketInfo() {
        api.getMarketInfo().then((res) => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.marketer = data.resultData;
            console.log(this.marketer);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      marketApply() {
        if(this.marketer) {
            return;
        }
        this.$store.commit('UPDATE_LOADING', true);
        api.marketApply().then((res) => {
          this.$store.commit('UPDATE_LOADING', false);
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.$store.dispatch('showSuccess', '申请成功');
            setTimeout(() => {
                this.init();
            }, 1500);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>

</style>