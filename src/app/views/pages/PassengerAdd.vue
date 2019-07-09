<template>
  <main-box :title="title" :show-more="false">
    <a slot="title" class="hd-cancel fc-4c4c4c" @click="userAddPassengers">保存</a>
    <div class="mar-t-20" v-for="(passenger, index) in passengers">
      <div class="inline-box line line-x-t">
        <label class="auto-width">
          {{passenger.isOwn ? '本人信息' : '其他旅客'}}
          <i class="icon-passenger" :class="[passenger.isOwn ? ' icon-own' : 'icon-qita']"></i>
        </label>
        <div v-if="!passenger.isOwn && index !== 0" class="delete-passenger" @click="deletePassenger(index)"></div>
      </div>
      <div class="inline-box line line-x-t">
        <label>中文姓名</label>
        <input type="text" v-model="passenger.realName" @blur="checkValid(passenger.realName, 'realName')" placeholder="请输入中文姓名" maxlength="16"/>
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
    <a class="add-passenger-btn line line-x" @click="pushPassenger">继续添加旅客</a>
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
        passengers: [{
            realName: '',
            idCard: '',
            telephone: '',
            type: 0,
            isOwn: false
          }]
      }
    },
    mounted () {
      this.userExistOwn()
    },
    methods: {
      /**
       * 添加旅客
       */
      pushPassenger () {
        this.passengers.push({
          realName: '',
          idCard: '',
          telephone: '',
          email: '',
          type: 0,
          isOwn: false
        })
      },

      /**
       * 删除旅客
       */
      deletePassenger (index) {
        this.passengers.splice(index, 1)
      },

      /**
       * 判断添加的旅客中是否存在本人
       */
      userExistOwn () {
        api.userExistOwn().then(res=>{
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
              if(!data.resultData){
                this.passengers[0].isOwn = true
              }
          }
        })
      },

      checkValid (value, type) {
        let validata = true;
        if(type === 'realName'){
          validata = TOOL.formValidate([
            {value: value, emptyTips: '旅客姓名不能为空'},
          ]);
        }else if(type === 'idCard'){
          validata = TOOL.formValidate([
            {value: value, emptyTips: '旅客身份证不能为空', regName: 'idCard', regTips: '旅客身份证格式不正确', ajaxValid: 'existPassenger', ajaxTips: '不能添加相同的旅客'},
          ]);
        }else{
          validata = TOOL.formValidate([
            {value: value, emptyTips: '旅客手机号码不能为空', regName: 'telephone', regTips: '旅客手机号码格式不正确'},
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
      userAddPassengers () {
        let valid = true;
        for(let i = 0; i < this.passengers.length; i++){
          if(!appStorage.get('X-Auth-Token')) {
            let localPassengers = []
            if (appStorage.get('passengers')) {
              localPassengers = JSON.parse(appStorage.get('passengers'))
            }
            for(let m = 0; m < localPassengers.length; m++){
              if(localPassengers[m].idCard === this.passengers[i].idCard){
                valid = false
              }
            }
            if (!valid) {
              this.$store.dispatch('showError', '不能添加相同的旅客');
              return false;
            }
          }
          let validata = TOOL.formValidate([
            {value: this.passengers[i].realName, emptyTips: '旅客姓名不能为空'},
            {value: this.passengers[i].idCard, emptyTips: '旅客身份证不能为空', regName: 'idCard', regTips: '旅客身份证格式不正确', ajaxValid: 'existPassenger', ajaxTips: '旅客为重复添加旅客'},
            {value: this.passengers[i].telephone, emptyTips: '旅客手机号码不能为空', regName: 'telephone', regTips: '旅客手机号码格式不正确'},
          ]);
          if (!validata.valid) {
            this.$store.dispatch('showError', `第${i+1}位` + validata.msg);
            return false;
          }

          let idCardInfo = TOOL.getIdCardInfo(this.passengers[i].idCard)
          let passengerAge = new Date().getFullYear() - idCardInfo.birthday.getFullYear()
          if (passengerAge <= 12) {
            this.passengers[i].type = 1
          }
        }

        this.$store.commit('UPDATE_LOADING', true)

        if(!appStorage.get('X-Auth-Token')){
          let passengers = []
          if(appStorage.get('passengers')){
            passengers = JSON.parse(appStorage.get('passengers'))
          }
          passengers = passengers.concat(this.passengers)
          appStorage.set('passengers', JSON.stringify(passengers))
          this.$store.dispatch('showSuccess', '新增旅客成功');
          this.$router.go(-1)
        }else{
          api.userAddPassengers(this.passengers).then(res => {
            const data = TOOL.toJson(res.data)
            this.$store.commit('UPDATE_LOADING', false)
            if (data.resultCode === '0') {
              this.$store.dispatch('showSuccess', '新增旅客成功');
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
