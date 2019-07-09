<template>
  <div class="inline-box mar-b-20 line line-x">
    <label>手机号码</label>
    <input type="tel" :value="value" @input="updateValue($event)" placeholder="请输入手机号码"/>
    <!--<div class="select-passenger" @click="jumpToPassenger">-->
      <!--<i class="icon-r-jt"></i>-->
    <!--</div>-->
  </div>
</template>
<script>
  export default {
    props:['value', 'pageRouter', 'saveForm'],
    methods:{
      updateValue ($event) {
        this.$emit('input', $event.target.value)
      },

      /**
       * 跳转到乘客列表新增乘客
       */
//      jumpToPassenger () {
//        this.saveForm()
//        this.$router.push({
//          name: 'passengerList',
//          query: {
//            page: this.pageRouter,
//            dataKey: 'contact'
//          }
//        })
//      },

    }
  }
</script>
<!--<style lang="less" scoped>-->
  <!--.select-passenger {-->
    <!--position: absolute;-->
    <!--width:60px;-->
    <!--height:100%;-->
    <!--right:0;-->
    <!--top:0;-->
  <!--}-->
<!--</style>-->
