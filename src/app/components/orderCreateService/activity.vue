<template>
    <div>
        <div class="inline-box line line-x-t" v-if="optimalActivity.id">
            <label class="auto-width label-activity"><i>惠</i>优惠活动</label>
            <input class="unui-switch feeder-switch" type="checkbox" :checked="useActivity" :value="useActivity" @change="checkActivity($event.target.value)"/>
        </div>
        <div class="inline-box" v-if="useActivity && optimalActivity.id">
            <label class="auto-width">{{optimalActivity.name}}</label>
            <span class="text-right fc-2390f9" @click="showActivityPicker">修改</span>
        </div>
    </div>
</template>
<script>
  export default {
    props:{
      useActivity:'',
      optimalActivity: {
        default: {}
      },
      activityList:{
        default: []
      }
    },
    data () {
      return {
        picker: '',
        pickerIndex: [0],
        pickerData: []
      }
    },
    watch: {
      activityList (newVal) {
        this.pickerData = [];
        newVal.forEach((value, key) => {
          if(value.id === this.optimalActivity.id){
            this.pickerIndex = [key]
          }
          this.pickerData.push({
            text: value.name,
            value: value
          })
        })
        this.picker = new Picker({
          data: [
            this.pickerData
          ],
          selectedIndex: this.pickerIndex,
          title: '选择优惠活动'
        });

        this.picker.on('picker.select', (selectedVal, selectedIndex) => {
          this.$emit('changeActivity', selectedVal[0])
        })

      }
    },
    created () {

    },
    methods:{
      checkActivity (value) {
        this.$emit('change', value)
      },

      showActivityPicker () {
        this.picker.show()
      }
    }
  }
</script>
<style lang="less" scoped>
    @import "../../../styles/theme.less";
    @import "../../../styles/switch.less";
    .pad-r{
        padding-right: 92px;
    }
    .fc-2390f9{
        color: @fc-2290f9;
    }
</style>