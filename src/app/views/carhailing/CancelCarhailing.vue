<template>
  <div>
    <c-header :title="title" :show-more="false"></c-header>
    <div class="app-container">
      <div class="app-main">
        <div class="inline-box mar-t-20 line line-x-t"
             v-for="reason in reasonList"
             @click="cancleReason = reason">
          <span>{{reason}}</span>
          <input class="hide" type="radio" :value="reason" v-model="cancleReason">
          <i class="icon-check"></i>
        </div>
        <textarea class="cancel-ch-detail mar-t-20 line line-x"
                  placeholder="还需要说点什么？"
                  v-model="content">
        </textarea>
      </div>
    </div>
    <div class="abs-bottom-box">
      <div class="buy-right buy-w100">
        <a class="button button-primary" @click="chOrderCancle">取消约车</a>
      </div>
    </div>
  </div>
</template>
<script>
  import CHeader from 'components/c-header/index.vue'

  export default {
    components: {
      CHeader
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        reasonList: [
          '我的行程有变化，暂时不需要用车',
          '我需要等待的时间太长了',
          '司机要求我取消',
          '无法取得联系',
          '其他'
        ],
        orderId:'',
        productTypeLevelOne:'',
        cancleReason:'',
        content:''
      }
    },
    mounted () {
      this.orderId = this.$route.query.orderId
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
    },
    methods: {
      chOrderCancle () {
        let cancleReason = this.cancleReason
        if(cancleReason === '其他'){
          cancleReason = this.content
        }
        if(!cancleReason){
          this.$store.dispatch('showError', '取消原因不能为空')
          return false
        }
        this.$store.dispatch('showConfirm', {
          title: '确认',
          content: '确认取消约车？',
          onConfirm: () => {
            this.$store.commit('UPDATE_LOADING', true)
            api.chBaseOrderCancle(this.orderId, cancleReason, this.productTypeLevelOne).then(res => {
              const data = TOOL.toJson(res.data)
              this.$store.commit('UPDATE_LOADING', false)
              if (data.resultCode === '0') {
                this.$store.dispatch('showSuccess', '取消约车成功')
                this.$router.go(-2)
              } else {
                this.$store.dispatch('showError', data.resultMsg);
              }
            })
          },
          onCancel: () => {
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .cancel-ch-detail{
    width: 100%;
    height:230px;
    padding:20px;
    font-size:28px;
    color:#121212;
  }
</style>
