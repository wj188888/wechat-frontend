<template>
    <main-box :title="title">
        <div class="vip-card-box radius-box" :style="[
        cardInfo.colorRgb ? {backgroundColor: cardInfo.colorRgb} : '',
        cardInfo.coverUrl ? {backgroundImage:'url(\'' + cardInfo.coverUrl + '\')'} : '',
        cardInfo.fontColorRgb ? {color: cardInfo.fontColorRgb} : ''
        ]">
            <h1 class="firm-name">
                <i class="firm-logo" :style=" firmLogo ? {backgroundImage:'url(\'' + firmLogo + '\')'} : '' "></i>
                {{brandName}}
            </h1>
            <p class="card-type">{{cardInfo.name}}</p>
            <p class="use-time">
                有效期：
                <em v-if="cardInfo.termDays">{{cardInfo.termDays == -1 ? '无限期' : cardInfo.termDays +　'天'}}</em>
                <em v-else>{{cardInfo.termStartAt | formatDate('date')}} 至 {{cardInfo.termEndAt | formatDate('date')}}</em>
                <span>{{myCard ? '已领取' : '未领取'}}</span>
            </p>
        </div>
        <h2 class="vip-tit line line-x-b">会员权益</h2>
        <ul class="vip-use clearfix">
            <li class="icon-score"
                :class="{'icon-discount':  right.type == 1, 'icon-coupon':  right.type == 2, 'icon-score': right.type == 3}"
                v-for="right in cardInfo.rights">
                <span v-if="right.type == 1">{{right.discount}}折</span>
                <span v-if="right.type == 2">优惠券</span>
                <span v-if="right.type == 3">{{right.points}}积分</span>
            </li>
        </ul>
        <router-link tag="p" :to="{name:'vipCardInfo', query:{cardId:cardId}}" class="vip-link mar-t-20 line line-x-b">使用须知<i class="icon-r-jt"></i></router-link>
        <p class="vip-link" @click="jumpToIndex">平台主页<i class="icon-r-jt"></i></p>
        <div slot="footer">
            <div class="abs-bottom-box line line-x-t" v-if="cardInfo.status == 0 && (!myCard || (cardInfo.syncWeixin && cardInfo.weixinCardId && myCard && !myCard.cardNo))">
                <div class="button-box buy-right buy-w100">
                    <input type="button" class="button button-primary button-small radius-box button-w300" v-if="!myCard" @click="memberCardObtain" value="领取会员卡"/>
                    <input type="button" class="button button-primary button-small radius-box button-w300"
                           v-if="cardInfo.syncWeixin && cardInfo.weixinCardId && myCard && !myCard.cardNo"
                           @click.stop="showDialog = true" value="添加到微信卡包"/>
                </div>
            </div>
         </div>
        <x-dialog :show="showDialog" :hide-on-blur="true" @on-hide="initialize" class="dialog-410">
            <div class="follow-us-dialog">
                <div class="share-ewm-box">
                    <img :src="ewmPic">
                </div>
                <p class="ewm-tips">长按二维码 识别关注</p>
            </div>
        </x-dialog>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import { XDialog } from 'vux'

    export default {
        components: {
            MainBox,
            XDialog
        },
        data () {
            return {
                title: this.$route.meta.title,
                cardId:'',
                firmLogo: appStorage.get('firmLogo'),
                brandName: appStorage.get('Brand_Name'),
                cardInfo:{},
                myCard:{},
                ewmPic:'',
                showDialog: false,
            }
        },
        mounted () {
            this.initialize()
        },
        methods: {
            initialize () {
                this.showDialog = false
                this.cardId = this.$route.query.cardId
                this.memberCardFindById()
            },
            memberCardFindById () {
                this.$store.commit('UPDATE_LOADING', true)
                api.memberCardFindById(this.cardId).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                        this.cardInfo = data.resultData
                        this.wxUserMemberCardFindById()
                    }else{
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },

            /**
             * 查询用户是否领取过会员卡
             */
            wxUserMemberCardFindById () {
                this.$store.commit('UPDATE_LOADING', true)
                api.wxUserMemberCardFindById(this.cardId).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                        this.myCard = data.resultData
                        if(this.cardInfo.weixinCardId && this.myCard && !this.myCard.cardNo){
                            this.memberCardGetQrcode()
                        }
                    }else{
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },

            /**
             * 获取添加到微信卡包二维码
             */
            memberCardGetQrcode () {
                this.$store.commit('UPDATE_LOADING', true)
                api.memberCardGetQrcode(this.cardInfo.weixinCardId).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                        this.ewmPic = data.resultData
                    }else{
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },

            /**
             * 领取会员卡
             */
            memberCardObtain () {
                this.$store.commit('UPDATE_LOADING', true)
                api.memberCardObtain(this.cardId).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                        this.$store.dispatch('showAlert', {
                            title: '领取成功',
                            content: '领取成功',
                            buttonText: '确定',
                            onHide: ()=> {
                                this.initialize()
                            }
                        })
                    }else{
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },

            jumpToIndex () {
                this.$router.push({
                    name: appStorage.get('indexRouter')
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../../styles/theme.less";
    .vip-card-box{
        margin:20px 20px 50px;
        padding:20px 20px 30px;
        background-color:#56ab71;
        color:#fff;
        background-repeat:no-repeat;
        background-size:100%;
        .firm-name{
            position: relative;
            height:80px;
            line-height:80px;
            padding-left:96px;
            font-size:36px;
            text-align: left;
            .firm-logo{
                position: absolute;
                left:0;
                top:0;
                width:76px;
                height:76px;
                border:4px solid #fff;
                background:#fff;
                background-repeat:no-repeat;
                background-size:80px 80px;
                background-position: center center;
                border-radius:50%;
            }
        }
        .card-type{
            margin-top:70px;
            margin-bottom:27px;
            font-size:36px;
        }
        .use-time{
            font-size:24px;
            span{
                float: right;
            }
        }
    }
    .vip-tit{
        padding-left:20px;
        height:88px;
        line-height:88px;
        font-size:28px;
        color:#121212;
        background-color:#fff;
    }
    .vip-use{
        background:#fff;
        padding:0 20px;
        li{
            float:left;
            width:100px;
            margin-right:30px;
            padding-top:140px;
            padding-bottom:30px;
            font-size:24px;
            color:#ccc;
            text-align: center;
            background-repeat:no-repeat;
            background-position:center 20px;
            background-size:100px 100px;
            &.icon-score{
                background-image:url("../../../../assets/my/score.png");
            }
            &.icon-discount{
                background-image:url("../../../../assets/my/discount.png");
            }
            &.icon-coupon{
                background-image:url("../../../../assets/my/coupon.png");
            }
        }
    }
    .vip-link{
        position: relative;
        height:110px;
        line-height:110px;
        padding-left:20px;
        font-size:28px;
        color:#121212;
        background:#fff;
    }
    .button-box{
        height:96px;
    }
    .button-w300{
        width:300px;
        height:60px;
        line-height:60px;
        margin:18px auto 0;
    }
    .follow-us-dialog{
        background-color: @c-fff;
        text-align:center;
        color:@c-121212;
        .share-ewm-box{
            width:260px;
            height:260px;
            margin:40px auto 70px;
            img{
                width:100%;
                height:100%;
            }
        }
        .ewm-tips{
            font-size:26px;
            margin-bottom:30px;
        }
    }
</style>
