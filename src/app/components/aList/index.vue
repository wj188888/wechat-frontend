<template>
  <ul class="city-zm-list mar-t-20">
    <li v-for="(value, index) in listData" :key="index" @click="setValue(value)">
      <span v-if="type === 'city'">{{value}}</span>
      <span v-if="type === 'nameHtml'" v-html="value.nameHtml"></span>
      <span v-if="type === 'airportName'">{{value.airportName}}</span>
      <span v-if="type === 'cityName'">{{value.name}}</span>
      <span v-if="type === 'airportStation'">
        <span class="city-name">{{value.city}}</span>
        <span class="station-name">{{value.name}}<span v-if="value.terminal">-{{value.terminal}}</span></span>
      </span>
      <span v-if="type === 'trainStation'">
          <span class="city-name">{{value.city}}</span>
          <span class="station-name">{{value.name}}</span>
      </span>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      listData:{
        default: []
      },
      type:{
        default: 'city'
      },
      show:{
        default: true
      }
    },
    data () {
      return {
      
      }
    },
    computed: {
    
    },
    mounted () {
    
    },
    methods:{
      setValue (value) {
        this.$emit('setValue', value)
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .city-zm-list li{
    height:86px;
    line-height:86px;
    padding:0 20px;
    color:#4d4d4d;
    border-bottom:1PX solid #e1e1e1;
    background: #fff;
    font-size:28px;
    .city-name{
      font-size:30px;
      color:#121212;
      margin-right:28px;
    }
    .station-name{
      font-size:26px;
    }
  }
</style>