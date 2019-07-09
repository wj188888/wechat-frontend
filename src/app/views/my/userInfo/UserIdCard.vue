<template>
  <main-box :title="title" main-class="scrollingBox" :go-back="goBack">
    <div class="input-p100-box">
      <input class="input-p100" type="text" v-model="idCard" placeholder="请设置您的身份证号" maxlength="18">
      <div class="clear-value" v-show="idCard" @click="idCard = ''"></div>
    </div>
    <div class="mar20">
      <p class="input-tips">身份证号码要求为17位纯数字，末位为数字或X</p>
      <input type="button" class="button button-primary" value="确认提交" :disabled="!idCard" @click="uptIdCard"/>
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
        idCard: ''
      }
    },
    mounted(){
      this.idCard = this.$route.query.idCard
    },
    methods: {
      /**
       * 获取用户的基本信息
       */
      uptIdCard () {
        let validata = TOOL.formValidate([
          {value: this.idCard, emptyTips: '请填写您的身份证号码', regName: 'idCard', regTips: '身份证号码格式不正确'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.$store.commit('UPDATE_LOADING', true)

        api.uptIdCard({idCard: this.idCard}).then(res => {
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

      goBack(){
        if (this.idCard != this.$route.query.idCard) {
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
