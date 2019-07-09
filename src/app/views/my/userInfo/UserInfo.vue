<template>
  <main-box :title="title">
    <div class="inline-box mar-t-20 line line-x-t">
      <label>头像</label>
      <div class="user-avator">
        <div class="user-avator-img" :style="userInfo.headimgurl?{backgroundImage:'url(\'' + userInfo.headimgurl + '\')'}:''"></div>
      </div>
    </div>
    <router-link tag="div" class="inline-box line line-x-t" :to="{name:'userNickName', query:{nickname: userInfo.nickname}}">
      <label>昵称</label>
      <input type="text" placeholder="请设置昵称" readonly v-model="userInfo.nickname"/>
      <i class="icon-r-jt"></i>
    </router-link>

    <router-link tag="div" class="inline-box mar-t-20 line line-x-t" :to="{name:'userName', query:{realName: userInfo.realName}}">
      <label>姓名</label>
      <input type="text" placeholder="方便您的信息录入" readonly v-model="userInfo.realName"/>
      <i class="icon-r-jt"></i>
    </router-link>
    <router-link tag="div" class="inline-box line line-x-t" :to="{name:'userIdCard', query:{idCard: userInfo.idCard}}">
      <label>身份证号</label>
      <input type="text" placeholder="方便您的信息审核" readonly v-model="idCard"/>
      <i class="icon-r-jt"></i>
    </router-link>
    <div class="inline-box line line-x-t">
      <label>手机号码</label>
      <input type="text" placeholder="请输入手机号码" readonly v-model="userInfo.phone"/>
    </div>
    <div class="inline-box line line-x-t input-sex">
      <label>性别</label>
      <input type="text" placeholder="您的性别" readonly v-model="sexName" @click="changeSex"/>
      <i class="icon-r-jt"></i>
    </div>
    <router-link tag="div" class="inline-box line line-x-t" :to="{name:'userEmail', query:{email: userInfo.email}}">
      <label>电子邮箱</label>
      <input type="text" placeholder="接收出发提醒" readonly v-model="userInfo.email"/>
      <i class="icon-r-jt"></i>
    </router-link>
    <div class="mar20 mar-t-40" v-show="!isUndunionApp">
      <input type="button" class="button button-primary" value="退出" @click="signOut"/>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  let sexData = [
    {text: '保密',value: 0},
    {text: '男',value: 1},
    {text: '女',value: 2}
  ]

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        userInfo: {},
        idCard: '',
        picker:'',
        sexName:'',
        isUndunionApp: TOOL.browser().undunion_app
      }
    },
    mounted(){
      this.userGetUserInfo()
    },
    methods: {

      changeSex () {
        this.picker.show();
      },

      /**
       * 获取用户的基本信息
       */
      userGetUserInfo () {
        api.userGetUserInfo().then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode == '0') {
            this.userInfo = result.resultData
            if (this.userInfo.idCard) {
              this.idCard = this.userInfo.idCard.substr(0, 3) + '******' + this.userInfo.idCard.substr(-4, 4)
            }
            this.userInfo.sex = this.userInfo.sex || 0;
            this.sexName = sexData[this.userInfo.sex].text
            this.initSexPicker(this.userInfo.sex)
          } else {
            this.$store.dispatch('showError', result.resultMsg)
          }
        })
      },

      /**
       * 初始化性别选择器
       */
      initSexPicker (defaultVal) {
        this.picker = new Picker({
          data: [sexData],
          selectedIndex: [defaultVal],
          title: '选择性别'
        })
        this.picker.on('picker.select', (selectedVal, selectedIndex) => {
          this.userInfo.sex = selectedVal[0]
          this.sexName = sexData[selectedIndex[0]].text
          this.uptSex()
        })
      },

      /**
       * 性别修改
       */
      uptSex () {
        api.uptSex({sex: this.userInfo.sex}).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode === '0') {
            this.$store.dispatch('showSuccess', '修改成功')
          } else {
            this.$store.dispatch('showError', result.resultMsg)
          }
        })
      },

      /**
       * 退出登录
       * 清除本地缓存token及用户信息
       * 缓存微信端用于识别openid的logoutToken
       */
      signOut () {
        this.$store.dispatch('showConfirm', {
          title: '确认',
          content: '是否确认退出？',
          onConfirm: () => {
            api.userUnAuth().then(res => {
              const result = TOOL.toJson(res.data)
              if (result.resultCode === '0') {
                appStorage.remove('X-Auth-Token')
                appStorage.remove('userInfo')
                appStorage.set('logoutToken', result.resultData)
                this.$store.dispatch('showSuccess', '退出成功')
                this.$router.go(-1)
              } else {
                this.$store.dispatch('showError', result.resultMsg)
              }
            })
          },
          onCancel: () => {
          }
        })
      }

    }
  }
</script>
<style scoped>
  .inline-box input {
    text-align: right;
    padding-right: 30px;
  }

  .user-avator {
    flex: 1;
    margin-right: 30px;
  }

  .user-avator-img {
    float: right;
    margin-top: 10px;
    width: 80px;
    height: 80px;
    background: url('../../../../assets/my/geren.png') no-repeat right center;
    background-size: 80px 80px;
    -webkit-border-radius: 50%;
    border-radius: 50%;
  }
</style>
