<template>
  <main-box :title="title" :go-back="goBack">
    <div class="operate-time">
      <ul class="line-list">
        <li>
          <div class="check-box" @click="checkAll">
            每天
            <input class="hide" type="checkbox" v-model="operateTime" value="每天">
            <i class="icon-check"></i>
          </div>
        </li>
        <li v-for="item in operateTimeList">
          <div class="check-box" @click="checkOne(item)">
            {{item}}
            <input class="hide" type="checkbox" v-model="operateTime" :value="item">
            <i class="icon-check"></i>
          </div>
        </li>
      </ul>
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
        pageRouter: '',
        localData: '',
        operateTimeList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        operateTime: []
      }
    },
    mounted () {
      this.pageRouter = this.$route.query.pageRouter
      if (appStorage.get(this.pageRouter)) {
        this.localData = JSON.parse(appStorage.get(this.pageRouter))
        this.operateTime = this.localData.operateTime
      }
    },
    methods: {
      /**
       * 每天
       */
      checkAll () {
        if (this.operateTime.length == 1 && this.operateTime[0] == '每天') {
          this.operateTime = []
        } else {
          this.operateTime = ['每天']
        }
      },

      /**
       * 单选一天
       */
      checkOne (item) {
        if ($.inArray(item, this.operateTime) > -1) {
          let index = this.operateTime.indexOf(item)
          this.operateTime.splice(index, 1)
        } else {
          this.operateTime.push(item)
        }
        if (this.operateTime.length == 7) {
          this.operateTime = ['每天']
        } else {
          if ($.inArray('每天', this.operateTime) > -1) {
            let index = this.operateTime.indexOf('每天')
            this.operateTime.splice(index, 1)
          }
        }
      },
      goBack () {
        this.localData.operateTime = this.operateTime
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
        this.$router.go(-1)
      }
    }
  }
</script>
