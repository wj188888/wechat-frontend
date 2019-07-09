<template>
  <main-box :title="title" :show-back="!isUndunionApp" :show-more="!isUndunionApp">
    <div class="flex-vertical">
      <ul class="top-flex-nav line line-x-b">
        <router-link tag="li" :to="{name:'commonUsedAddress'}" activeClass="active" replace>
          <a>常用地址</a>
        </router-link>
        <router-link tag="li" :to="{name:'passengerInfo'}" activeClass="active" replace>
          <a>旅客信息</a>
        </router-link>
      </ul>
      <router-link class="add-passenger-btn line line-x" :to="{name:'passengerAdd'}">添加旅客</router-link>
      <div class="flex-vertical-box" v-if="passengerList.length != 0">
        <ul class="passenger-list">
          <li class="line line-x" v-for="passenger in passengerList" @click.stop="jumpToPassengerEdit(passenger)">
            <p class="name">
              {{passenger.realName}}
              <i class="icon-passenger-type" :class="{'child': passenger.type==1}" v-text="passenger.type == 1 ? '儿童' : '成人'"></i>
            </p>
            <p class="card-num" v-text="passenger.idCard"></p>
            <i class="icon-edit-info"></i>
          </li>
        </ul>
      </div>
      <div class="my-info-no-data" v-if="passengerList.length == 0">
        <p>您还没有添加任何旅客信息</p>
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
        pageRouter: this.$route.name,
        isUndunionApp: TOOL.browser().undunion_app,
        passengerList: [],
        passenger: {
          realName: '',
          telephone: '',
          idCard: '',
          email: ''
        }
      }
    },
    mounted () {
      this.passengerFind()
    },
    methods: {
      /**
       * 查找联系人列表
       */
      passengerFind () {
        api.passengerFind().then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode == '0') {
            this.passengerList = data.resultData;
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 跳转乘客编辑页面
       */
      jumpToPassengerEdit (passenger) {
        this.$router.push({
          name: 'passengerEdit',
          query: {
            page: this.pageRouter,
            dataKey: 'myInfo',
            passenger: JSON.stringify(passenger)
          }
        })
      }

    }
  }
</script>
