<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom pad-20">
    <div class="base-info info-mg">
      <i class="base-icon"></i>公司信息填写
    </div>
    <div class="form-box pad-l-20 line line-box radius-box">
      <div class="input-x vux-1px-b">
        <label>公司名称</label>
        <input type="text" placeholder="请输入公司名称"
               v-model="application.name"/>
      </div>
      <div class="input-x vux-1px-b">
        <label>公司地址</label>
        <input type="text" placeholder="请输入公司地址"
               v-model="application.address"/>
      </div>
      <div class="input-x vux-1px-b">
        <label>手机号码</label>
        <div class="input-verify">
          <input type="tel"
                 class="input-code"
                 placeholder="请输入手机号码"
                 v-model="application.contactPhone"/>
          <input type="button"
                 class="button button-verify ver-inp"
                 v-model="verifyCodeTimer.value"
                 :disabled="btnStatus.verifyCodebtn"
                 @click="sendVerifyCode"/>
        </div>
      </div>
      <div class="input-x">
        <label>验证码</label>
        <input type="text" v-model="application.smsCode" placeholder="请输入验证码"/>
      </div>
    </div>
    <p class="user-tip line line-box vux-1px-b">
      用户提醒文案
    </p>
    <div slot="footer">
      <div class="abs-bottom-box">
        <div class="buy-left">
          <input type="button" class="button button-gray button-no-radius" value="上一步"  @click="applyPrev"/>
        </div>
        <div class="buy-right">
          <input type="button" class="button button-primary button-no-radius" value="确认提交" @click="createSchoolWorkApplication" :disabled="btnStatus.applyBtn"/>
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
        pageRouter: 'applyBus',
        application: {
          formId: TOOL.getTimeStamp(), //防重复提交字段
          name: '',
          address: '',
          contactName: '',
          contactPhone: ''
        },
        verifyCodeTimer: {
          totalTime: 60,
          value: '获取验证码'
        },
        btnStatus: {
          verifyCodebtn: false,
          applyBtn: false
        }
      }
    },
    mounted(){
      if (appStorage.get(this.pageRouter)) {
        let localData = JSON.parse(appStorage.get(this.pageRouter))
        this.application = Object.assign({}, localData);
      }
      if (appStorage.get('X-Auth-Token')) {
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        if(!this.application.contactPhone){
          this.application.contactPhone = usrInfo.phone
        }
      }
    },
    methods: {
      saveForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.application))
      },

      /**
       * 返回上一步
       */
      applyPrev () {
        this.saveForm()
        this.$router.push({name: this.pageRouter});
      },

      /**
       *  发送验证码
       */
      sendVerifyCode () {
        let validata = TOOL.formValidate([
          {value: this.application.contactPhone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.btnStatus.verifyCodebtn = true
        api.smsFind({phone: this.application.contactPhone}).then(res => {
          const result = TOOL.toJson(res.data)
          this.$store.dispatch('showError', '验证码发送成功')
          if (result.resultCode == '0') {
            let timer = window.setInterval(()=> {
              if (this.verifyCodeTimer.totalTime > 0) {
                this.verifyCodeTimer.value = this.verifyCodeTimer.totalTime + '(s)'
                this.verifyCodeTimer.totalTime--
              } else {
                window.clearInterval(timer)
                this.verifyCodeTimer.value = '重新发送'
                this.verifyCodeTimer.totalTime = 60
                this.btnStatus.verifyCodebtn = false
              }
            }, 1000)
          } else {
            this.btnStatus.verifyCodebtn = false
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

      /**
       * 生成企业班车车包车申请
       */
      createSchoolWorkApplication () {
        if (!appStorage.get('X-Auth-Token')) {
          this.saveForm()
          TOOL.login()
          return;
        }

        let validJson = this.application;
        let validata = TOOL.formValidate([
          {value: validJson.name, emptyTips: '公司名称不能为空'},
          {value: validJson.address, emptyTips: '公司地址不能为空'},
          {value: validJson.contactPhone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
          {value: validJson.smsCode, emptyTips: '短信验证码不能为空'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.btnStatus.applyBtn = true
        this.application.vehicleType = ''
        let operateT = [
          {name: '周一', value: '1'},
          {name: '周二', value: '2'},
          {name: '周三', value: '3'},
          {name: '周四', value: '4'},
          {name: '周五', value: '5'},
          {name: '周六', value: '6'},
          {name: '周日', value: '7'},
        ]
        if (this.application.operateTime[0] == '每天') {
          this.application.operateTime = [1, 2, 3, 4, 5, 6, 7]
        } else {
          let timeArr = [];
          for (let t = 0; t < this.application.operateTime.length; t++) {
            for (let a = 0; a < operateT.length; a++) {
              if (this.application.operateTime[t] == operateT[a].name) {
                timeArr.push(operateT[a].value);
              }
            }
          }
          this.application.operateTime = timeArr;
        }

        this.application.startDate = TOOL.newGetDate({date: this.application.startDate, type: 'holeDate'})
        this.application.endDate = TOOL.newGetDate({date: this.application.endDate, type: 'holeDate'})

        this.$store.dispatch('showConfirm', {
          title: '确认',
          content: '是否确认提交工作班车申请？',
          onConfirm: () => {
            api.createSchoolWorkApplication(this.application).then(res => {
              const result = TOOL.toJson(res.data)
              if (result.resultCode == '0') {
                appStorage.remove(this.pageRouter)
                this.$router.replace({
                  name: 'success',
                  query: {
                    id: result.resultData
                  }
                });
              } else {
                this.btnStatus.applyBtn = false
                this.application.formId = TOOL.getTimeStamp()
                this.$store.dispatch('showError', result.resultMsg);
              }
            })
          },
          onCancel: () => {
            this.btnStatus.applyBtn = false
            this.application.formId = TOOL.getTimeStamp()
          }
        });

      }
    }
  }
</script>
