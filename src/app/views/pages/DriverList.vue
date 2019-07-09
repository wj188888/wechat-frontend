<template>
  <main-box :title="title">
    <div class="flex-vertical">
      <router-link class="add-passenger-btn line line-x" :to="{name:'driverAdd'}">添加驾驶员</router-link>
      <div class="my-info-no-data" v-if="passengerList.length == 0">
        <p>您还没有添加任何驾驶员信息</p>
      </div>
      <div class="flex-vertical-box mar-b-90" v-if="passengerList.length != 0">
        <ul class="passenger-list check-passenger-list">
          <li class="line line-x" v-for="(passenger, index) in passengerList" @click="checkPassenger(index, passenger)">
            <div class="check-box">
              <input class="hide" type="radio" :checked="selectDriver==index">
              <i class="icon-check"></i>
            </div>
            <p class="name">
              {{passenger.realName}}
            </p>
            <p class="card-num" v-text="passenger.idCard"></p>
            <i class="icon-edit-info" @click.stop="jumpToPassengerEdit(index)"></i>
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
        passengerList: [],
        selectDriver: 0
      }
    },
    mounted () {
      this.page = this.$route.query.page
      this.dataKey = this.$route.query.dataKey
      this.maxBuyNumber = this.$route.query.maxBuyNumber

      if(!appStorage.get('X-Auth-Token')){
        if(appStorage.get('drivers')){
          let passengerList = JSON.parse(appStorage.get('drivers'))
          this.passengerProcess(passengerList)
        }
      }else{
        this.driverFind()
      }

    },
    methods: {
      /**
       * 查找联系人列表
       */
      driverFind () {
        this.$store.commit('UPDATE_LOADING', true)
        api.driverFind().then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            appStorage.set('drivers', JSON.stringify(data.resultData))
            this.passengerProcess(data.resultData)
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 旅客信息处理
       */
      passengerProcess (data) {
        if(data){
          this.passengerList = data
          this.passengerList.forEach((value, index) => {
            if(value.check) {
              value.check = true;
              this.selectDriver = index;
            } else {
              value.check = false;
            }
          });
        }
      },

      /**
       * 选择旅客
       */
      checkPassenger (index, passenger) {
          this.passengerList.forEach((value, index) => {
              value.check = false;
          });
          this.passengerList[index].check = true;
          this.selectDriver = index;
      },

      /**
       * 选择旅客
       */
      setPassenger () {
        let localData = {}, len = this.passengerList.length;
        if (appStorage.get(this.page)) {
          localData = JSON.parse(appStorage.get(this.page));
        }

        localData.driverList = this.passengerList[this.selectDriver];
        if(!localData.driverList.idCard) {
          this.$store.dispatch('showError', '请选择一个驾驶员')
          return
        }
  
        appStorage.set(this.page, JSON.stringify(localData))
        appStorage.set('drivers', JSON.stringify(this.passengerList))
        this.$router.go(-1)
      },

      /**
       * 跳转乘客编辑页面
       */
      jumpToPassengerEdit (index) {
        appStorage.set('drivers', JSON.stringify(this.passengerList))
        this.$router.push({
          name: 'driverEdit',
          query: {
            page: this.page,
            dataKey: this.dataKey,
            driverIndex: index
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
