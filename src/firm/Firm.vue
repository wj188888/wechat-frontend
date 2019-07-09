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
    @import '../styles/form.less';
    @import '../styles/button.less';
    @import '../styles/layout.less';
    @import '../styles/vux.less';
    @import '../styles/map.less';
    @import '../styles/index.less';
    @import '../styles/work.less';
    @import '../styles/my.less';
    @import '../styles/charter.less';
    @import '../styles/ticket.less';
    @import '../styles/common.less';
    @import '../styles/car.less';
    @import '../styles/sight.less';
</style>
