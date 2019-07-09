<template>
    <div class="inp-notice" v-if="show">
        <slot></slot>
        <div v-html="text"></div>
    </div>
</template>
<script>
    export default {
        props:{
            show:{
                default:true
            },
            text:{
                default:''
            }
        },
        data () {
            return {

            }
        },
        computed: {

        },
        mounted () {

        },
        methods:{

        }
    }
</script>
<style lang="less">
    @import "../../../styles/theme.less";
    .inp-notice{
        padding:30px 20px 60px;
        line-height:30px;
        font-size: 26px;
        color: @c-4c4c4c;
        background-color: @c-fff;
        min-height: 100px;
        word-break: break-all;
        overflow:hidden;
        h2{
            font-size:30px;
        }
        h3{
            margin-bottom:30px;
            font-size:28px;
            font-weight: bold;
            text-align: left;
        }
        p{
            line-height:1.7;
            font-size:26px;
            margin-bottom:30px;
            color: @c-4c4c4c;
        }
        .warning{
            color: @c-ff6600;
            margin-bottom:10px;
        }
        .pad-l{
            padding-left:76px;
        }
        .text{
            margin-top:50px;
            margin-bottom:35px;
            font-size:20px;
            color:#cbcbcb;
        }
        img{
            max-width: 100%;
        }
    }
</style>