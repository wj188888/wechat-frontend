<template>
  <input type="text" :placeholder="holder" :value="viewValue | formatDate(format)" readonly ref="dateTime"/>
</template>
<script>
  
  export default {
    props:{
      startConfig:{
        default: {} // 初始化配置
      },
      value: '', // 绑定的值
      holder: '', // placeholder
      format: {
        default: 'monthDayHour' //格式化
      }
    },
    data () {
      return {
        instance: ''
      }
    },
    computed: {
      defaultConfig () {
        let defaultConfig = {
          theme: 'ios',
          lang: 'zh',
          display: 'bottom',
          focusOnClose: false,
          onSet: (event, inst) => {
            this.$emit('input', event.valueText)
          },
          onCancel: (event, inst) => {
            this.$emit('cancel', event.valueText)
          }
        };
        if(this.startConfig){
          defaultConfig = Object.assign({}, defaultConfig, this.startConfig)
        }
        return defaultConfig
      },
      viewValue () {
        return this.value
      }
    },
    watch: {
      defaultConfig:{
        handler (newVal) {
          if(this.instance){
            this.instance.option(newVal)
          }
        },
        deep:true
      },
     
    },
    mounted() {
      this.instance = mobiscroll.datetime(this.$refs.dateTime, this.defaultConfig)
    },
    methods: {
      showDateTimePicker () {
        if(this.instance){
          this.instance.show()
        }
      },
      
    }
  }
</script>