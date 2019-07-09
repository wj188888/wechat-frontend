<template>
  <main-box :title="title">
    <div class="user-nav line line-x-b">
      <p class="question">你在乘车过程中遇到了什么问题呢？</p>
      <p class="contact" @click="callService('')">联系客服</p>
    </div>
    <div class="mar-lr-20 pd-bot-20" style="padding-top:10px">
      <div class="check-item line line-box radius-box" v-for="data in comItem.items">
        <div class="check-box">
          <label>
            {{data}}
            <input class="hide" type="radio" :value="data" v-model="plainData.item">
            <i class="icon-com"></i>
          </label>
        </div>
      </div>
      <div class="txt-box line line-box radius-box">
        <textarea placeholder="还需要说点什么?" v-model="plainData.content" maxlength="200"></textarea>
        <span class="word-count">1~100字</span>
      </div>
      <input type="button" class="apply-but button button-primary" @click="plainSubmit" value="提交"/>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import phone from 'mixins/phone.js'

  export default {
    components: {
      MainBox
    },
    mixins: [phone],
    data () {
      return {
        title: this.$route.meta.title,
        comItem: '',
        plainData: {
          orderId: '',
          item: '',
          content: '',
          productTypeLevelOne:'',
        },
      }
    },
    mounted(){
      this.plainData.orderId = this.$route.query.orderId
      this.plainData.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.getItem()
    },
    methods: {
      plainSubmit () {
        api.createComplain(this.plainData).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode == '0') {
            this.$store.dispatch('showSuccess', data.resultMsg)
            this.$router.go(-1)
          } else {
            this.$store.dispatch('showError', data.resultMsg)
          }
        })
      },
      getItem () {
        api.getComplainItem().then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode == '0') {
            this.comItem = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg)
          }
        })
      }
    }
  }
</script>
