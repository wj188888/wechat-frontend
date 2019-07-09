<template>
  <main-box :title="title" main-class="scrollingBox" :go-back="goBack">
    <div class="input-p100-box">
      <input class="input-p100" type="text" v-model="realName" placeholder="请设置您的姓名" maxlength="16">
      <div class="clear-value" v-show="realName" @click="realName = ''"></div>
    </div>
    <div class="mar20">
      <p class="input-tips">姓名要求为2-20个汉字或2-40个英文，支持空格和“.”，不能中英混搭</p>
      <input type="button" class="button button-primary" value="确认提交" :disabled="!realName"  @click="uptRealName"/>
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
        realName: ''
      }
    },
    mounted () {
      this.realName = this.$route.query.realName
    },
    methods: {
      /**
       * 修改用户姓名
       */
      uptRealName () {
        var validata = TOOL.formValidate([
          {value: this.realName, emptyTips: '请填写您的姓名', regName: 'userName', regTips: '姓名最少2位中文或英文字符'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.$store.commit('UPDATE_LOADING', true)

        api.uptRealName({realName: this.realName}).then(res => {
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
        if (this.realName != this.$route.query.realName) {
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
