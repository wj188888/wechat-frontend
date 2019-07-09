<template>
    <div>
        <div class="inline-box mar-t-20 line line-x-t"
             :class="{'dd-text-active': showNotice}"
             @click="showNotice = !showNotice">
            <span>乘车、购票、退票须知</span>
            <span class="text-right text-detail">详情</span>
            <i class="icon-r-jt"></i>
        </div>

        <div class="route-detail" v-show="showNotice">
            <notice-custom :contents="customContents"></notice-custom>
            <notice :text="refundNotice"></notice>
        </div>

        <p class="firm-name-box line line-x" v-if="firmName">
            <span v-text="firmName"></span>
            <i class="icon-v"></i>
        </p>
    </div>
</template>
<script>
    import NoticeCustom from 'appComponents/noticeCustom/index.vue'
    import Notice from 'appComponents/notice/index.vue'

    export default {
        props:['customContents', 'refundNoticeType', 'firmName'],
        components:{
            Notice,
            NoticeCustom
        },
        data () {
            return {
                showNotice: false
            }
        },
        computed : {
          refundNotice () {
            return TOOL[this.refundNoticeType]
          }
        }
    }
</script>
<style scoped>
    .text-detail{
        padding-right:20px;
        color:#999;
    }
</style>
