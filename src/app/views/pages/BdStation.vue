
<template>
  <div>
    <select-station :changeCityAllowed="changeCity" :setStationType="stationType"></select-station>
  </div>
</template>
<script>
  import SelectStation from 'components/select-station/index.vue'
  export default {
    components: {
      SelectStation
    },
    data() {
      return {
        changeCity: true,
        stationType: 2
      }
    }
  }
</script>

