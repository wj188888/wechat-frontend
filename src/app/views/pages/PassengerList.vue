<template>
  <main-box :title="title">
    <div class="flex-vertical">
      <router-link class="add-passenger-btn line line-x" :to="{name:'passengerAdd'}">添加旅客</router-link>
      <div class="my-info-no-data" v-if="passengerList.length == 0">
        <p>您还没有添加任何旅客信息</p>
      </div>
      <div class="flex-vertical-box mar-b-90" v-if="passengerList.length != 0">
        <ul class="passenger-list check-passenger-list">
          <li class="line line-x" v-for="(passenger, index) in passengerList" @click="checkPassenger(index, passenger)">
            <div class="check-box">
              <input class="hide" type="checkbox" v-model="passenger.check" :checked="passenger.check">
              <i class="icon-check"></i>
            </div>
            <p class="name">
              {{passenger.realName}}
              <i class="icon-passenger-type" :class="{'child': passenger.type==1}" v-text="passenger.type == 1 ? '儿童' : '成人'"></i>
            </p>
            <p class="card-num" v-text="passenger.idCard"></p>
            <i class="icon-edit-info" @click.stop="jumpToPassengerEdit(passenger)"></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="abs-bottom-box">
      <div class="buy-right buy-w100">
        <input class="button button-primary button-no-radius" type="button" @click="setPassenger()" value="确认"/>
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
        page: '', //返回界面路由、本地存储key
        dataKey: '', //需要设置的值的键
        maxBuyNumber: '', // 最大设置乘客数
        passengerList: []
      }
    },
    mounted () {
      this.page = this.$route.query.page
      this.dataKey = this.$route.query.dataKey
      this.maxBuyNumber = this.$route.query.maxBuyNumber
      this.passengerFind()
    },
    methods: {
      /**
       * 查找联系人列表
       */
      passengerFind () {
        this.$store.commit('UPDATE_LOADING', true)
        api.passengerFind().then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            let passengerData = [];
            if(!appStorage.get('X-Auth-Token')){
              if(appStorage.get('passengers')){
                let passengerList = JSON.parse(appStorage.get('passengers'))
                for (let i = 0; i < passengerList.length; i ++){
                  passengerData.push(passengerList[i])
                }
              }
            }
            if(data.resultData && data.resultData.length){
              passengerData = passengerData.concat(data.resultData)
            }
            this.passengerProcess(passengerData)
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 旅客信息处理
       */
      passengerProcess (data) {
        this.passengerList = data
        let localData = {}, len = this.passengerList.length;
        if (appStorage.get(this.page)) {
          localData = JSON.parse(appStorage.get(this.page))
        }

        if (this.dataKey === 'passengers' || this.dataKey === 'children') {
          let passengerArr;
          if (this.dataKey === 'children') {
            passengerArr = localData['children']
          } else {
            passengerArr = localData['passengers']
          }

          let len2 = passengerArr.length
          if (len === 0) return
          for (let i = 0; i < len; i++) {
            this.passengerList[i].check = false
            for (let j = 0; j < len2; j++) {
              //选中已选择的旅客
              if (this.passengerList[i].idCard === passengerArr[j].idCard) {
                this.passengerList[i].buyInsurance = false
                this.passengerList[i].carryKid = passengerArr[j].carryKid
                this.passengerList[i].check = true

              }
            }

            //保险及携童默认值
            this.passengerList[i].buyInsurance = false
            if (this.dataKey === 'passengers') {
              this.passengerList[i].carryKid = false
            }
          }
        } else {

          //城际机场专车
          if (len === 0) return
          for (let i = 0; i < len; i++) {
            this.passengerList[i].check = false

            //选中已选择的旅客
            if (this.passengerList[i].passengerIdCard === localData.passengerIdCard) {
              this.passengerList[i].check = true
            }
          }
        }
      },

      /**
       * 选择旅客
       */
      checkPassenger (index, passenger) {
        if (this.page === 'porderWrite') {
          if (this.dataKey === 'passengers' && passenger.type === 1) {
            this.$store.dispatch('showError', '请选择成人旅客')
            return
          }

          if (this.dataKey === 'children' && passenger.type === 0) {
            this.$store.dispatch('showError', '请选择儿童旅客')
            return
          }
        }

        let len = this.passengerList.length;
        if (this.dataKey === 'passengers' || this.dataKey === 'children') {
          let passengerNum = 0;
          for (let i = 0; i < len; i++) {
            if (this.passengerList[i].check) {
              passengerNum++
            }
          }
          if (passengerNum < this.maxBuyNumber) {
            passenger.check = !passenger.check
          } else if (passengerNum === this.maxBuyNumber) {
            if (!passenger.check) {
              this.$store.dispatch('showError', '单笔订单限购' + this.maxBuyNumber + '张票')
            } else {
              passenger.check = !passenger.check
            }
          }
          this.$set(this.passengerList, index, passenger)
        } else {
          for (let i = 0; i < len; i++) {
            this.passengerList[i].check = false
          }
          passenger.check = !passenger.check
          this.$set(this.passengerList, index, passenger)
        }
      },

      /**
       * 选择旅客
       */
      setPassenger () {
        let localData = {}, len = this.passengerList.length, validate = false
        if (appStorage.get(this.page)) {
          localData = JSON.parse(appStorage.get(this.page))
        }
        if (this.dataKey === 'passengers' || this.dataKey === 'children') {
          let passengerArr = [];
          for (let i = 0; i < len; i++) {
            if (this.passengerList[i].check) {
              delete this.passengerList[i].check;
              passengerArr.push(this.passengerList[i])
            }
          }
          if (passengerArr.length > 0) {
            localData[this.dataKey] = passengerArr;
            validate = true
          }
          if(localData.discountInfo && localData.discountInfo.userCouponId){
            localData.discountInfo.userCouponId = ''
          }
        } else {
          for (let i = 0; i < len; i++) {
            if (this.passengerList[i].check) {
              localData['contactName'] = this.passengerList[i].realName;
              localData['contactTelephone'] = this.passengerList[i].telephone;
              localData['passengerIdCard'] = this.passengerList[i].passengerIdCard;
              validate = true
            }
          }
        }
        if (!validate) {
          this.$store.dispatch('showError', '请选择一个旅客')
          return
        }
        appStorage.set(this.page, JSON.stringify(localData))
        this.$router.go(-1)
      },

      /**
       * 跳转乘客编辑页面
       */
      jumpToPassengerEdit (passenger) {
        delete passenger.buyInsurance
        delete passenger.carryKid
        delete passenger.check
        this.$router.push({
          name: 'passengerEdit',
          query: {
            page: this.page,
            dataKey: this.dataKey,
            passenger: JSON.stringify(passenger)
          }
        })
      }
    }
  }
</script>
