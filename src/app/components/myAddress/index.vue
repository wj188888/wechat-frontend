<template>
  <div class="user-info-address line line-x-b" v-show="infoType != 'hide'">
    <ul>
      <li class="line line-y-r clearfix border-r" @click="setMyaddress(address1)">
        <p>常用地址1</p>
        <p class="small" v-if="address1 && address1.detailAddress">{{address1.detailAddress}}</p>
        <p class="small" v-else>常用地址</p>
      </li>
      <li @click="setMyaddress(address2)">
        <p>常用地址2</p>
        <p class="small" v-if="address2 && address2.detailAddress">{{address2.detailAddress}}</p>
        <p class="small" v-else>常用地址</p>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props:['infoType', 'setMyaddress'],
    data () {
      return {
        address1:'',
        address2:'',
      }
    },
    computed: {

    },
    mounted () {
      this.getAddress()
    },
    methods:{
      /**
       * 获取常用地址
       */
      getAddress () {
        api.userGetCommonAddressOne().then(res1 => {
          if(res1.data.resultCode === '0') {
            this.address1 = res1.data.resultData;
          }

        });
        api.userGetCommonAddressTwo().then(res2 => {
          if(res2.data.resultCode === '0') {
            this.address2 = res2.data.resultData;
          }
        });
      },
    }
  }
</script>
<style lang="less" scoped>
  .user-info-address{
    ul{
      display:flex;
    }
    li{
      flex:1;
      width:50%;
      padding-top:28px;
      padding-left:90px;
      height:120px;
      background: url("../../../assets/map_no.png") no-repeat 30px center;
      background-size:22px 28px;
      color:#121212;
      text-align:center;
      p{
        width:160px;
        line-height: 34px;
        font-size:28px;
        margin-bottom:5px;
        white-space:nowrap;
        text-overflow: ellipsis;
        overflow:hidden;
        text-align:left;
      }
      .small{
        font-size:24px;
        color:#999;
      }
    }
  }
  .map-back {
    display: block;
    float: left;
    height: 100%;
    width: 40px;
    background-size: 24px 28px;
  }
  .border-r {
    border-right: 1PX solid #e5e5e5;
  }
</style>
