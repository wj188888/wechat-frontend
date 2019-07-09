<template>
  <main-box :title="title" :show-back="!isUndunionApp" :show-more="!isUndunionApp">
    <div class="flex-vertical">
      <div class="flex-vertical-box">

        <div class="inline-box line line-x-t">
          <label>中文姓名</label>
          <input type="text" v-model="passenger.realName" placeholder="请输入中文姓名" maxlength="16"/>
        </div>
        <div class="inline-box line line-x">
          <label>身份证号</label>
          <input type="text" v-model="passenger.idCard" maxlength="18"/>
        </div>

        <div class="inline-box line line-x-t">
          <label>手机号码</label>
          <input type="tel" v-model="passenger.telephone" placeholder="请输入手机号码" maxlength="11"/>
        </div>
      </div>
      <div class="mar-lr-20 mar-b-20">
        <input @click="eidtPassenger" type="button" class="button button-primary" value="确认修改"/>
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
        isUndunionApp: TOOL.browser().undunion_app,
        page: '',
        dataKey: '',
        passengers: [],
        passenger: {
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
      this.passenger = JSON.parse(this.$route.query.passenger)
      this.idCard = this.passenger.idCard
      if(appStorage.get('passengers')){
          this.passengers = JSON.parse(appStorage.get('passengers'))
          let passengersLength = this.passengers.length;
          for(let i = 0; i < passengersLength; i++){
              if(this.passengers[i].idCard === this.passenger.idCard){
                  this.passengers.splice(i, 1);
                  break;
              }
          }
      }
    },
    methods: {
      /**
       * 编辑联系人
       */
      eidtPassenger () {
        //未登录本地添加身份证不能重复
        if(!appStorage.get('X-Auth-Token')){
          /*let passengers = []
          if(appStorage.get('passengers')){
            passengers = JSON.parse(appStorage.get('passengers'))
          }*/
          let passengersLength = this.passengers.length;
          let valid = true;
          for(let i = 0; i < passengersLength; i++){
            if(this.passengers[i].idCard === this.passenger.idCard){
              valid = false
            }
          }
          if (!valid) {
            this.$store.dispatch('showError', '不能添加相同的旅客');
            return false;
          }
        }

        let validArr = [
          {value: this.passenger.realName, emptyTips: '旅客姓名不能为空'},
          {value: this.passenger.idCard, emptyTips: '旅客身份证不能为空', regName: 'idCard', regTips: '身份证格式不正确',},
          {value: this.passenger.telephone, emptyTips: '旅客手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
        ]
        if (this.idCard !== this.passenger.idCard) {
          validArr[1] = {value: this.passenger.idCard, emptyTips: '旅客身份证不能为空', regName: 'idCard', regTips: '身份证格式不正确', ajaxValid: 'existPassenger', ajaxTips: '不能添加相同的旅客'}
        }
        let validata = TOOL.formValidate(validArr);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.$store.commit('UPDATE_LOADING', true)
        let idCardInfo = TOOL.getIdCardInfo(this.passenger.idCard)
        let passengerAge = new Date().getFullYear() - idCardInfo.birthday.getFullYear()
        if (passengerAge <= 12) {
          this.passenger.type = 1
        }

        if(!appStorage.get('X-Auth-Token')){
          let passengers = []
          if(appStorage.get('passengers')){
            passengers = JSON.parse(appStorage.get('passengers'))
          }
          for(let i = 0; i < passengers.length; i++){
              if(passengers[i].idCard === this.idCard){
                passengers[i] = this.passenger
              }
          }
          appStorage.set('passengers', JSON.stringify(passengers))
          this.editPassengerSuccess()
        }else{
          api.passengerEdit(this.passenger).then(res=>{
            const data = TOOL.toJson(res.data)
            this.$store.commit('UPDATE_LOADING', false)
            if (data.resultCode === '0') {
              this.editPassengerSuccess()
            } else {
              this.$store.dispatch('showError', data.resultMsg);
            }
          })
        }
      },

      editPassengerSuccess () {
        this.$store.dispatch('showSuccess', '编辑旅客成功');
        this.changeOrderPassenger()
        this.$router.go(-1)
      },

      /**
       * 下单添加乘客，编辑需更新localStorage乘客数据
       */
      changeOrderPassenger () {
        if (this.dataKey !== 'myInfo') {
          let localData = {};
          if (appStorage.get(this.page)) {
            localData = JSON.parse(appStorage.get(this.page))
          }
          if (this.dataKey === 'passengers') {
            if (localData[this.dataKey].length > 0) {
              for (let i in localData[this.dataKey]) {
                if (this.idCard === localData[this.dataKey][i].idCard) {
                  localData[this.dataKey][i].realName = this.passenger.realName
                  localData[this.dataKey][i].telephone = this.passenger.telephone
                  localData[this.dataKey][i].idCard = this.passenger.idCard
                  appStorage.set(this.page, JSON.stringify(localData))
                }
              }
            }
          } else {
            if (localData['contactName']) {
              localData['contactName'] = passenger.realName
              localData[contactTelephone] = passenger.telephone
              appStorage.set(this.page, JSON.stringify(localData))
            }
          }
        }
      }

    }
  }
</script>
