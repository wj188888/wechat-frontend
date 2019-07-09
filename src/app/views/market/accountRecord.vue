<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <scroll ref="scroll"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
      <div>
        <div class="record" v-for="(val, index) of dataList">
          <div class="record__month" v-if="val.createdDiff">
            {{val.createdMonth}}月
          </div>
          <div class="form-div line line-x-b">
            <div class="form-div__title">{{val.createdTime|formatDate('monthDayHour')}}</div>
            <div class="form-div__auto" v-if="val.settleStatus == 1">提现中</div>
            <div class="form-div__auto c-f-f60">{{val.amount|formatPrice}}</div>
          </div>
        </div>
      </div>
    </scroll>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'

  import Page from '../../../utils/page'


  export default {
    components: {
      MainBox,
      Scroll,
    },
    data() {
      return {
        title: this.$route.meta.title,
        page: {},
        dataList: [],
      }
    },
    mounted () {
      this.initPage();
    },
    methods: {
      initPage() {
        this.page = new Page({
          search: {},
          refScroll: this.$refs.scroll,
          pageApi: 'marketSettleFind',
        });
        this.onPullingUp();
      },
      onPullingUp() {
        this.page.onPullingUp().then((dataList) => {
          this.dataList = this.dataList.concat(dataList);
          this.dataList = this.dataList.reduce((pre, curr, currIndex) => {
            curr.createdMonth = curr.createdTime.substring(5,7);
            curr.createdDiff = true;
            if(currIndex === 0) {
                pre.push(curr);
                return pre;
            }
            if(pre[pre.length - 1].createdMonth === curr.createdMonth) {
              curr.createdDiff = false;
            } else {
              curr.createdDiff = true;
            }
            pre.push(curr);
            return pre;
          }, []);
          console.log(this.dataList);
        }).catch((err) => {
          this.$store.dispatch('showError', err);
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .record {

  }
  .record__month {
    padding: 30px 20px 20px;
    font-size: 28px;
    color: #121212;
  }
</style>