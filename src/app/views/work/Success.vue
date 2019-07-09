<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="mar20">
      <div class="success-nav">
        <div class="a-address">
          <p v-text="applicationData.aAddress.detailAddress"></p>
        </div>
        <div class="sus-line">
          <span class="am" v-text="applicationData.startTime">AM 07:00</span>
          <span class="pm" v-text="applicationData.endTime">PM 07:00</span>
          <p class="suc-bd border-top">
            <i class="com-jt right"></i>
          </p>
          <p class="suc-bd border-bot">
            <i class="com-jt left"></i>
          </p>
        </div>
        <div class="b-address">
          <p v-text="applicationData.bAddress.detailAddress"></p>
        </div>
      </div>
      <div class="sus-container">
        <div class="con-icon">
          <div class="sus-right">
            <img src="../../../assets/gou.png">
          </div>
        </div>
        <div class="con-info">
          <p>您的信息我们已经收到</p>
          <p>我们将尽快与您联系</p>
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
    data () {
      return {
        title: this.$route.meta.title,
        id: '',
        applicationData: {
          aAddress:{},
          bAddress:{},
        }
      }
    },
    mounted () {
      this.id = this.$route.query.id
      this.schoolWorkApplicationFindById()
    },
    methods: {
      /**
       * 校园专车定制包车查询
       */
      schoolWorkApplicationFindById () {
        api.schoolWorkApplicationFindById(this.id).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode == '0') {
            this.applicationData = result.resultData
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      }
    }
  }
</script>
