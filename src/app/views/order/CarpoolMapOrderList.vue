<template>
  <main-box :title="title" main-class="scrollingBox">
    <order-list></order-list>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import OrderList from 'appComponents/orderList/index'
  
  export default {
    components: {
      MainBox,
      OrderList
    },
    data () {
      return {
        title: this.$route.meta.title,
      }
    },
    mounted () {},
    methods: {}
  }
</script>
