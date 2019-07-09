<template>
    <div class="app-page">
        <!--loading动画-->
        <loading v-model="showLoding" position="absolute" text="数据加载中"></loading>
        <router-view></router-view>
    </div>
</template>

<script>
  import Loading from 'components/loading/index'
  import { mapState } from 'vuex'

  export default {
    components: {
      Loading
    },
    mounted () {

    },
    computed: {
      ...mapState({
        showLoding: state => state.loading.showLoding,
      })
    },
    methods: {

    }
  }
</script>
<style lang="less">
    @import '../styles/reset.less';
    @import '../styles/layout.less';
    .app-page{
        min-height:100%;
    }
</style>
