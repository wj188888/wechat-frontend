<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="comy-int-box" v-if="info" v-html="info.html"></div>
    <div class="empty-company-info" v-if="!info">公司暂未设置车辆租金信息</div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: '',
        pageRouter: '',
        info:''
      }
    },
    mounted () {
      this.pageRouter = this.$route.query.pageRouter;
      try {
          this.info = JSON.parse(appStorage.get(this.pageRouter));
      } catch(error) {
          alert(error);
      }
    },
    methods: {

    }
  }
</script>
