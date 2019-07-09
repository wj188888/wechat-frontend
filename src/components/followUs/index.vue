<template>
    <div class="follow-us-box">
        <div class="car-nav" @click="jumpToIndex">
            <div class="cha" @click.stop="closeFollowUs"></div>
            <div class="store-avator" :style=" firmLogo ? {backgroundImage:'url(\'' + firmLogo + '\')'} : '' "></div>
            <span class="name">{{brandName}}</span>
            <span class="word-box" @click.stop="showDialogEvent">{{ isFollow ?  '已关注' : '关注我们'}}</span>
        </div>
        <x-dialog :show="showDialog" :hide-on-blur="true" @on-hide="showDialog = false" class="dialog-demo">
            <div class="follow-us-dialog">
                <h2>{{brandName}}</h2>
                <div class="share-ewm-box">
                    <img :src="ewmPic">
                </div>
                <p class="ewm-tips">长按二维码 识别关注</p>
            </div>
        </x-dialog>
    </div>
</template>
<script>
    import { XDialog } from 'vux'

    export default {
        props:['isFollow'],
        components: {
            XDialog
        },
        data () {
            return {
                storeId: this.$route.query.StoreId || appStorage.get('StoreId'),
                showDialog: false,
                firmLogo: appStorage.get('firmLogo'),
                brandName: appStorage.get('Brand_Name'),
                ewmPic:''
            }
        },
        computed: {

        },
        mounted () {
            this.getStoreQrCodeUrl ()
        },
        methods:{
            /**
             * 获取微信公众号二维码
             */
            getStoreQrCodeUrl () {
                api.getStoreQrCodeUrl(this.storeId).then(res => {
                    const data = TOOL.toJson(res.data)
                    if (data.resultCode === '0') {
                        this.ewmPic = data.resultData
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },

            showDialogEvent () {
                if(this.isFollow) return
                this.showDialog = true
            },

            jumpToIndex () {
                if(this.isFollow) return
                this.$router.push({
                    name: appStorage.get('indexRouter')
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../styles/theme.less";
    .car-nav{
      position: relative;
      height:120px;
      line-height:120px;
      background:  #373d4d;
      z-index: 100;
      .cha{
        position: absolute;
        left:10px;
        top:10px;
        display: block;
        width: 20px;
        height: 20px;
        background:url("../../assets/close-dialog.png") no-repeat center center;
        background-size:20px 20px;
      }
      .store-avator{
        display: inline-block;
        width:80px;
        height:80px;
        margin-left:30px;
        margin-top:20px;
        border-radius: 50%;
        background: no-repeat center center #d9d9d9;
        background-size:cover;
      }
      .name{
        display: inline-block;
        font-size:28px;
        color: #fff;
        height:56px;
        line-height: 56px;
        position: absolute;
        top:32px;
        left:126px;
      }
      .word-box{
        display: block;
        position: absolute;
        top:30px;
        right:20px;
        width:140px;
        height:60px;
        line-height: 60px;
        font-size:26px;
        text-align: center;
        color: #fff;
        background:#ff6600;
        border-radius: 4PX;
      }
    }
    .follow-us-dialog{
        background-color: @c-fff;
        text-align:center;
        color:@c-121212;
        h2{
            padding:40px 0 80px;
            font-size:36px;
            font-weight:normal;
        }
        .ewm-tips{
            padding-bottom:140px;
            font-size:26px;
        }
        .share-ewm-box{
            width:365px;
            height:365px;
            margin:0 auto 60px;
            img{
                width:100%;
                height:100%;
            }
        }
    }
</style>