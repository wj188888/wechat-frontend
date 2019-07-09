<template>
    <main-box :title="title" :go-back="goBack">
        <div class="inline-box line line-x-b" v-for="reason in refundReasons" @click="checkReason(reason)">
            <span>{{reason}}</span>
            <input class="hide" type="radio" :value="reason" v-model="reasonValue">
            <i class="icon-check"></i>
        </div>
        <div class=" line line-x-t" v-show="reasonValue == '其他'">
            <textarea class="reason" placeholder="请填写退票理由" v-model="text"></textarea>
        </div>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'

    export default {
        components: {
            MainBox
        },
        data () {
            return {
                title: this.$route.meta.title,
                refundReasons:['车辆发生故障', '信息填写有误，重新购买', '实际车辆与票上不符', '其他'],
                page:'',
                reasonValue: '',
                refundReason: '',
                localData: {},
                text:'',
            }
        },
        mounted () {
            this.page = this.$route.query.pageRouter
            if(appStorage.get(this.page)){
                this.localData = JSON.parse(appStorage.get(this.page))
            }

            if(this.localData.refundReason && $.inArray(this.localData.refundReason, this.refundReasons) == -1){
                this.reasonValue = '其他'
                this.text = this.localData.refundReason
            }else{
                this.reasonValue = this.localData.refundReason
            }

        },
        methods: {
            checkReason (reason) {
                this.reasonValue = reason
            },

            goBack () {
                if(this.reasonValue){
                    if(this.reasonValue != '其他'){
                        this.localData.refundReason = this.reasonValue
                      appStorage.set(this.page, JSON.stringify(this.localData))
                    }else if(this.text){
                        this.localData.refundReason = this.text
                      appStorage.set(this.page, JSON.stringify(this.localData))
                    }
                }
                this.$router.go(-1)
            }
        }
    }
</script>
<style lang="less" scoped>
    .reason{
        width:100%;
        height:200px;
        padding:20px;
        font-size:28px;
    }
</style>