<template>
  <main-box :title="title" main-class="scrollingBox">
    <user-center class="mar-t-20"></user-center>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import UserCenter from 'appComponents/userCenter/index'
  
  export default {
    components: {
      MainBox,
      UserCenter
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
      
      }
    },
    mounted(){
    
    },
    methods: {
    
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  
 
</style>
