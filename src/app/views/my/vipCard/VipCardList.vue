<template>
    <main-box :title="title">
       <ul class="card-list pad-20" v-if="!showNoResult">
           <li class="radius-box"
               v-for="card in cardList"
               v-if="card.memberCard"
               :style="[
               card.memberCard.colorRgb ? {backgroundColor: card.memberCard.colorRgb} : '',
               card.memberCard.coverUrl ? {backgroundImage:'url(\'' + card.memberCard.coverUrl + '\')'} : '',
               card.memberCard.fontColorRgb ? {color: card.memberCard.fontColorRgb} : ''
               ]"
               @click="jumpToVipCard(card.memberCard.id)">
               <i class="firm-logo" :style=" firmLogo ? {backgroundImage:'url(\'' + firmLogo + '\')'} : '' "></i>
               {{card.memberCard.name}}
               <span class="pull-right">{{card.memberCard.status == 1 ? '未启用' : '使用中'}}</span>
           </li>
       </ul>
        <no-result :show="showNoResult" :text="noResultText"></no-result>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import NoResult from 'appComponents/noResult/index.vue'

    export default {
        components: {
            MainBox,
            NoResult
        },
        data () {
            return {
                title: this.$route.meta.title,
                firmLogo: appStorage.get('firmLogo'),
                brandName: appStorage.get('Brand_Name'),
                cardList:[],
                showNoResult: false,
                noResultText:'暂无可用会员卡<br/>你可以在公众号菜单中获取会员卡'
            }
        },
        mounted () {
            this.wxUserMemberCardFind()
        },
        methods: {
            wxUserMemberCardFind () {
                this.$store.commit('UPDATE_LOADING', true)
                api.wxUserMemberCardFind().then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                        this.cardList = data.resultData
                        this.showNoResult = !this.cardList.length
                    }else{
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },

            jumpToVipCard (cardId) {
                this.$router.push({
                    name:'vipCard',
                    query:{
                        cardId: cardId
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .card-list{
        li{
            position: relative;
            height:160px;
            line-height:160px;
            margin-bottom:20px;
            padding:0 20px 0 120px;
            font-size:36px;
            color:#fff;
            background-color:#56ab71;
            background-repeat:no-repeat;
            background-size:100%;
            .firm-logo{
                position: absolute;
                left:20px;
                top:40px;
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
    }
</style>
