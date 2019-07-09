<template>
  <main-box :title="title" main-class="scrollingBox" :go-back="goBack">
    <div class="operate-time">
      <ul class="line-list">
        <li v-for="item in insuranceList">
          <div class="check-box" @click="checkInsure(item)">
            {{item.insureText}} <i class="icon-insure" @click.stop="jumpToInsureTips"></i>
            <input class="hide" type="radio" v-model="insureTypeId" :value="item.insureTypeId">
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
        localData: {},
        insuranceList: [],
        insureTypeId: '',
        totalPrem: 0
      }
    },
    mounted () {
      this.pageRouter = this.$route.query.pageRouter
      this.insurancePlanTypeFind(this.$route.query.price)
    },
    methods: {

      /**
       * 查询保险类型
       */
      insurancePlanTypeFind (price) {
        this.insuranceList = []
        api.insurancePlanTypeFind({price: price}).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            for (let i = 0; i < data.resultData.length; i++) {
              let insurance = {},
                coverage = 0,
                temp = data.resultData[i];
              insurance.insureTypeId = temp.id
              for (let j = 0; j < temp.insurancePlanTypeItems.length; j++) {
                coverage += temp.insurancePlanTypeItems[j].coverage
              }

              insurance.insureText = '交通意外险' + temp.totalPrem + '元/份保额' + coverage + '元'
              insurance.totalPrem = temp.totalPrem
              this.insuranceList.push(insurance)
            }
            this.insuranceList.push({insureTypeId: '', insureText: '不购买保险', totalPrem: 0})

            //赋初始值
            if (appStorage.get(this.pageRouter)) {
              this.localData = JSON.parse(appStorage.get(this.pageRouter))
              this.insureTypeId = this.localData.insureTypeId
              this.totalPrem = this.localData.totalPrem
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 选择保险
       */
      checkInsure (insure) {
        this.insureTypeId = insure.insureTypeId
        this.totalPrem = insure.totalPrem
        this.goBack()
      },

      checkInsureEmpty () {
        this.insureTypeId = ''
        this.totalPrem = 0
        this.goBack()
      },

      /**
       * 保存保险数据
       */
      saveForm () {
        this.localData.insureTypeId = this.insureTypeId
        this.localData.totalPrem = this.totalPrem
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
      },

      /**
       * 跳转保险介绍页面
       */
      jumpToInsureTips () {
        this.saveForm()
        this.$router.push({name: 'insureAgreement'})
      },

      /**
       * 返回
       */
      goBack () {
        this.saveForm()
        this.$router.go(-1)
      }
    }
  }
</script>
