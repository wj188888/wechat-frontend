<template>
  <main-box :title="title" main-class="scrollingBox" :go-back="goBack">
    <div class="input-p100-box">
      <input class="input-p100" type="email" v-model="email" placeholder="请设置您的邮箱" maxlength="30">
      <div class="clear-value" v-show="email" @click="email = ''"></div>
    </div>
    <div class="mar20">
      <p class="input-tips">邮箱将用来接收旅游合同及出发提醒，请谨慎填写</p>
      <input type="button" class="button button-primary" value="确认提交" :disabled="!email" @click="uptEmail"/>
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
        email: ''
      }
    },
    mounted () {
      this.email = this.$route.query.email
    },
    methods: {
      /**
       * 修改邮箱
       */
      uptEmail () {
        var validata = TOOL.formValidate([
          {value: this.email, emptyTips: '请填写您的邮箱', regName: 'email', regTips: '邮箱格式不正确'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.$store.commit('UPDATE_LOADING', true)

        api.uptEmail({email: this.email}).then(res => {
          const result = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (result.resultCode == '0') {
            this.$store.dispatch('showSuccess', '修改成功')
            this.$router.go(-1)
          } else {
            this.$store.dispatch('showError', result.resultMsg)
          }
        })
      },

      goBack () {
        if (this.email != this.$route.query.email) {
          this.$store.dispatch('showConfirm', {
            title: '确认',
            cancelText: '继续填写',
            content: '尚未保存，确定离开当前页面？',
            onConfirm: () => {
              this.$router.go(-1)
            }
          })
        } else {
          this.$router.go(-1)
        }
      }

    }
  }
</script>
<style scoped>
  .input-p100-box {
    position: relative;
    height: 100px;
    background-color: #fff;
  }

  .input-p100 {
    width: 100%;
    margin: 34px 0;
    padding: 0 20px;
    background-color: #fff;
    border: 0;
    font-size: 28px;
    color: #393a3e;
  }

  .input-tips {
    margin: 14px 0 50px;
    font-size: 22px;
    color: #7e7f80;
  }

  .clear-value {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: url('../../../../assets/cha.png') no-repeat 30px center;
    background-size: 26px 26px;
  }

  .button[disabled] {
    color: #ffffff;
    background-color: #FFDFCC !important;
    border-color: #FFDFCC !important;
  }
</style>
