<template>
  <main-box :title="title">
    <set-common-address></set-common-address>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import SetCommonAddress from 'appComponents/set-common-address/index.vue'

  export default {
    components: {
      MainBox,
      SetCommonAddress
    },
    data() {
      return {
        title: this.$route.meta.title,
      }
    }
  }
</script>
