<template>
    <div>
      <div class="inline-box mar-t-20 line line-x-t">
        <i class="map-back"></i>
        <label class="mar-r-40">常用地址1</label>
        <input type="text" v-model="address1" class="color-4c4c4c" placeholder="请设置常用地址1" readonly @click="jumpToBdStation('address1')"/>
        <i class="icon-r-jt"></i>
      </div>
      <div class="inline-box mar-b-20 line line-x">
        <i class="map-back"></i>
        <label class="mar-r-40">常用地址2</label>
        <input type="text" v-model="address2" class="color-4c4c4c" placeholder="请设置常用地址2" readonly @click="jumpToBdStation('address2')"/>
        <i class="icon-r-jt"></i>
      </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        address1:'',
        address2:''
      }
    },
    mounted(){
      this.getAddress()
    },

    methods: {
      /**
       * 获取常用地址
       */
      getAddress () {
        api.userGetCommonAddressOne().then(res1 => {
          if(res1.data.resultCode == 0) {
            this.address1 = res1.data.resultData.detailAddress;
          } else {
            this.$store.dispatch('showError', res1.data.resultMsg);
          }

        });
        api.userGetCommonAddressTwo().then(res2 => {
          if(res2.data.resultCode == 0) {
            this.address2 = res2.data.resultData.detailAddress;
          } else {
            this.$store.dispatch('showError', res2.data.resultMsg);
          }

        });
      },

      /**
       * 跳转百度地图选择
       */
      jumpToBdStation (dataKey) {
        appStorage.remove('CURRENTCITY')
        this.$router.push({
          name: 'bdStation',
          query: {
            fromPage: this.pageRouter,
            dataKey: dataKey,
            infoType: 'hide'
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .color-4c4c4c {
    color: #4c4c4c !important;
  }
  .mar-r-40 {
    margin-right: 40px;
  }
  .map-back {
    display: block;
    line-height: 40px;
    padding: 30px 27px;
    background: url("../../../assets/map_no.png") no-repeat left center;
    background-size: 22px 28px;
  }
</style>

