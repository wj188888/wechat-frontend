<template>
  <main-box :title="title">
    <div class="flex-vertical">
      <div class="flex-vertical-box">

        <div class="inline-box line line-x-t">
          <label>驾驶员</label>
          <input type="text" v-model="driver.realName" @blur="checkValid(driver.realName, 'realName')" placeholder="驾驶员姓名与有效证件保持一致" maxlength="16"/>
        </div>
        <div class="inline-box line line-x">
          <label>身份证号</label>
          <input type="text" v-model="driver.idCard" @blur="checkValid(driver.idCard, 'idCard')" placeholder="请输入身份证号码" maxlength="18"/>
        </div>
        <div class="inline-box line line-x-t">
          <label>手机号码</label>
          <input type="tel" v-model="driver.telephone" @blur="checkValid(driver.telephone, 'telephone')" placeholder="请输入手机号码" maxlength="11"/>
        </div>
      </div>
      <div class="mar-lr-20">
        <input @click="eidtdriver" type="button" class="button button-primary" value="确认修改"/>
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
        driverList: [],
        page: '',
        dataKey: '',
        driver: {
          realName: '',
          idCard: '',
          telephone: '',
          email: '',
          type: 0
        },
        idCard: '',
      }
    },
    mounted(){
      this.page = this.$route.query.page
      this.dataKey = this.$route.query.dataKey
      this.driverIndex = this.$route.query.driverIndex
      this.driverList = JSON.parse(appStorage.get('drivers'))
      this.driver = this.driverList[this.driverIndex];
//      this.idCard = this.driver.idCard
    },
    methods: {
      /**
       * 编辑联系人
       */
      eidtdriver () {
        let validArr = [
          {value: this.driver.realName, emptyTips: '驾驶员姓名不能为空'},
          {value: this.driver.idCard, emptyTips: '驾驶员身份证不能为空', regName: 'idCard', regTips: '身份证格式不正确',},
          {value: this.driver.telephone, emptyTips: '驾驶员手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
        ]
        if (this.idCard !== this.driver.idCard) {
          validArr[1] = {value: this.driver.idCard, emptyTips: '驾驶员身份证不能为空', regName: 'idCard', regTips: '身份证格式不正确', ajaxValid: 'existdriver', ajaxTips: '不能添加相同的驾驶员'}
        }
        let validata = TOOL.formValidate(validArr);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.$store.commit('UPDATE_LOADING', true)


        if(!appStorage.get('X-Auth-Token')){
          let drivers = []
          if(appStorage.get('drivers')){
            drivers = JSON.parse(appStorage.get('drivers'))
          }
          this.driverList[this.driverIndex] = this.driver;
          appStorage.set('drivers', JSON.stringify(this.driverList))
          this.editdriverSuccess()
        }else{
          api.driverEdit(this.driver).then(res=>{
            const data = TOOL.toJson(res.data)
            this.$store.commit('UPDATE_LOADING', false)
            if (data.resultCode === '0') {
              this.editdriverSuccess()
            } else {
              this.$store.dispatch('showError', data.resultMsg);
            }
          })
        }
      },

      editdriverSuccess () {
        this.$store.dispatch('showSuccess', '编辑驾驶员成功');
        this.$router.go(-1)
      },

      checkValid (value, type) {
        let validata = true;
        if(type === 'realName'){
          validata = TOOL.formValidate([
            {value: value, emptyTips: '驾驶员姓名不能为空'},
          ]);
        }else if(type === 'idCard'){
          validata = TOOL.formValidate([
            {value: value, emptyTips: '驾驶员身份证不能为空', regName: 'idCard', regTips: '驾驶员身份证格式不正确', ajaxValid: 'existPassenger', ajaxTips: '不能添加相同的驾驶员'},
          ]);
        }else{
          validata = TOOL.formValidate([
            {value: value, emptyTips: '驾驶员手机号码不能为空', regName: 'telephone', regTips: '驾驶员手机号码格式不正确'},
          ]);
        }
        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
      },

      /**
       * 下单添加乘客，编辑需更新localStorage乘客数据
       */
      changeOrderdriver () {
        if (this.dataKey !== 'myInfo') {
          let localData = {};
          if (appStorage.get(this.page)) {
            localData = JSON.parse(appStorage.get(this.page))
          }
          if (this.dataKey === 'drivers') {
            if (localData[this.dataKey].length > 0) {
              for (let i in localData[this.dataKey]) {
                if (this.idCard === localData[this.dataKey][i].idCard) {
                  localData[this.dataKey][i].realName = this.driver.realName
                  localData[this.dataKey][i].telephone = this.driver.telephone
                  localData[this.dataKey][i].idCard = this.driver.idCard
                  appStorage.set(this.page, JSON.stringify(localData))
                }
              }
            }
          } else {
            if (localData['contactName']) {
              localData['contactName'] = driver.realName
              localData[contactTelephone] = driver.telephone
              appStorage.set(this.page, JSON.stringify(localData))
            }
          }
        }
      }

    }
  }
</script>
