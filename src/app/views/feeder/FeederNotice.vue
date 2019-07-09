<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="comy-int-box" v-if="companyIntro" v-html="companyIntro"></div>
    <div class="empty-company-info" v-if="!companyIntro">公司暂未设置接送服务须知</div>
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
        title: this.$route.meta.title,
        companyIntro:''
      }
    },
    mounted () {
      this.feederId = this.$route.query.feederId
      this.shuttleFindNotice()
    },
    methods: {
      shuttleFindNotice () {
        api.shuttleFindNotice(this.feederId).then(res => {
          const data = TOOL.toJson(res.data)
          if(data.resultCode === '0'){
            this.companyIntro = data.resultData
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      }
    }
  }
</script>
