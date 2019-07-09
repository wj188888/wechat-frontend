<template>
  <main-box :title="title" :show-back="!isUndunionApp" :show-more="!isUndunionApp" main-class="scrollingBox">
    <div class="comy-int-box" v-if="companyIntro" v-html="companyIntro"></div>
    <div class="empty-company-info" v-if="!companyIntro">公司暂未设置介绍信息</div>
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
        companyIntro:'',
        isUndunionApp: TOOL.browser().undunion_app
      }
    },
    mounted () {
      this.brandBriefFind()
    },
    methods: {
      brandBriefFind () {
        this.$store.commit('UPDATE_LOADING', true)
        api.brandBriefFind().then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
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
