<template>
    <div class="share-box" v-show="showShareBox" @click="closeShare">
        <div class="share-tips" v-html="shareText"></div>
    </div>
</template>
<script>
    export default {
        props:{
            show:{
                default:false,
            },
            shareText:{
                default:'<p>请点击右上角将此行程</p><p>分享给你的好友或分享至朋友圈吧</p>'
            }
        },
        data () {
            return {

            }
        },
        computed: {
            showShareBox () {
                return this.show
            }
        },
        mounted () {

        },
        methods:{
            closeShare () {
                this.$emit('closeShare')
            }
        }
    }
</script>
<style lang="less" scoped>
    .share-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background-color:rgba(0, 0, 0, 0.7);
        z-index: 210;
    }

    .share-tips {
        position: relative;
        padding-top: 280px;
        background: url('../../../assets/charter/share_jt.png') no-repeat right 0;
        background-size: 71px 312px;
        text-align: center;
        font-size: 28px;
        line-height:1.6;
        color: #fff;
        z-index: 200;
    }

    .share-tips p:first-child {
        margin-bottom: 30px;
    }

    .share-tips em {
        color: #ff6600;
        font-size: 36px;
    }
</style>
