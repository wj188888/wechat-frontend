<template>
  <main-box :title="title" :show-more="false">
    <a slot="title" class="hd-cancel fc-4c4c4c" @click="userAdddrivers">保存</a>
    <div class="mar-t-20" v-for="(passenger, index) in drivers">
      <div class="inline-box line line-x-t">
        <label>驾驶员</label>
        <input type="text" v-model="passenger.realName" @blur="checkValid(passenger.realName, 'realName')" placeholder="驾驶员姓名与有效证件保持一致" maxlength="16"/>
      </div>
      <div class="inline-box line line-x">
        <label>身份证号</label>
        <input type="text" v-model="passenger.idCard" @blur="checkValid(passenger.idCard, 'idCard')" placeholder="请输入身份证号码" maxlength="18"/>
      </div>
      <div class="inline-box line line-x-t">
        <label>手机号码</label>
        <input type="tel" v-model="passenger.telephone" @blur="checkValid(passenger.telephone, 'telephone')" placeholder="请输入手机号码" maxlength="11"/>
      </div>
    </div>
    <!--<a class="add-passenger-btn line line-x" @click="pushPassenger">继续添加驾驶员</a>-->
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
        drivers: [{
          realName: '',
          idCard: '',
          telephone: '',
          type: 0,
          check: false,
          isOwn: false
        }]
      }
    },
    mounted () {
//      this.userExistOwn()

    },
    methods: {
      /**
       * 添加驾驶员
       */
      pushPassenger () {
        this.drivers.push({
          realName: '',
          idCard: '',
          telephone: '',
          email: '',
          type: 0,
          isOwn: false
        })
      },

      /**
       * 删除驾驶员
       */
      deletePassenger (index) {
        this.drivers.splice(index, 1)
      },

      /**
       * 判断添加的驾驶员中是否存在本人
       */
      userExistOwn () {
        api.driverExistOwn().then(res=>{
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            if(!data.resultData){
              this.drivers[0].isOwn = true
            }
          }
        })
      },

      checkValid (value, type) {
        let validata = true;
        if(type === 'realName'){
          validata = TOOL.formValidate([
            {value: value, emptyTips: '驾驶员姓名不能为空'},
          ]);
        }else if(type === 'idCard'){
          validata = TOOL.formValidate([
            {value: value, emptyTips: '驾驶员身份证不能为空', regName: 'idCard', regTips: '驾驶员身份证格式不正确', ajaxValid: 'driverExistOwn', ajaxTips: '不能添加相同的驾驶员'},
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
       * 新增联系人
       */
      userAdddrivers () {
        let valid = true;
        for(let i = 0; i < this.drivers.length; i++){
          if(!appStorage.get('X-Auth-Token')) {
            let localdrivers = []
            if (appStorage.get('drivers')) {
              localdrivers = JSON.parse(appStorage.get('drivers'))
            }
            for(let m = 0; m < localdrivers.length; m++){
              if(localdrivers[m].idCard === this.drivers[i].idCard){
                valid = false
              }
            }
            if (!valid) {
              this.$store.dispatch('showError', '不能添加相同的驾驶员');
              return false;
            }
          }
          let validata = TOOL.formValidate([
            {value: this.drivers[i].realName, emptyTips: '驾驶员姓名不能为空'},
            {value: this.drivers[i].idCard, emptyTips: '驾驶员身份证不能为空', regName: 'idCard', regTips: '驾驶员身份证格式不正确', ajaxValid: 'driverExistOwn', ajaxTips: '不能添加相同的驾驶员'},
            {value: this.drivers[i].telephone, emptyTips: '驾驶员手机号码不能为空', regName: 'telephone', regTips: '驾驶员手机号码格式不正确'},
          ]);
          if (!validata.valid) {
            this.$store.dispatch('showError', '请完整填写驾驶员的基本信息');
            return false;
          }

          let idCardInfo = TOOL.getIdCardInfo(this.drivers[i].idCard)
          let passengerAge = new Date().getFullYear() - idCardInfo.birthday.getFullYear()
          if (passengerAge <= 12) {
            this.drivers[i].type = 1
          }
        }

        this.$store.commit('UPDATE_LOADING', true)

        if(!appStorage.get('X-Auth-Token')){
          let drivers = []
          if(appStorage.get('drivers')){
            drivers = JSON.parse(appStorage.get('drivers'))
          }
          drivers = drivers.concat(this.drivers)
          appStorage.set('drivers', JSON.stringify(drivers))
          this.$store.dispatch('showSuccess', '新增驾驶员成功');
          this.$router.go(-1)
        }else{
          api.driverAdd(this.drivers[0]).then(res => {
            const data = TOOL.toJson(res.data)
            this.$store.commit('UPDATE_LOADING', false)
            if (data.resultCode === '0') {
              this.$store.dispatch('showSuccess', '新增驾驶员成功');
              this.$router.go(-1)
            } else {
              this.$store.dispatch('showError', data.resultMsg);
            }
          })
        }

      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .add-passenger-btn{
    display:block;
    width:100%;
    height:86px;
    margin-top:20px;
    margin-bottom:20px;
    line-height:86px;
    font-size:30px;
    font-weight:normal;
    color: @c-ff6600;
    text-align: center;
    background-color: @c-fff;
  }
  .icon-passenger{
    position: relative;
    top:-2PX;
    margin-left:5px;
    display:inline-block;
    width:30px;
    height:30px;
    background-repeat:no-repeat;
    background-position:center center;
    background-size:30px 30px;
    vertical-align: middle;
  }
  .icon-own{
    background-image:url("../../../assets/my/benren.png");
  }
  .icon-qita{
    background-image:url("../../../assets/my/qita.png");
  }
  .fc-4c4c4c{
    color:#4c4c4c;
  }
  .delete-passenger{
    position: absolute;
    right:0;
    top:0;
    height:100px;
    width:100px;
    background:url("../../../assets/lajitong.png") no-repeat 50px center;
    background-size: 30px 30px;
  }
</style>
