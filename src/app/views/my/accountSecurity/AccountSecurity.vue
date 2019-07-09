<template>
  <main-box :title="title">
    <div class="normal-list pad-l-20 mar-t-0">
      <ul>
        <router-link tag="li" :to="{name:'passwordSetting'}" class="line line-x-b">
          支付密码管理<i class="icon-r-jt"></i>
        </router-link>
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
        title: this.$route.meta.title
      }
    },
  }
</script>
