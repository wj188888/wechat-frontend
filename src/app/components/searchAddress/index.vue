<template>
    <div class="search-address-box">
        <div class="input-box">
            <input type="text" v-model="cityName" :placeholder="holder"/>
            <i v-if="cityName" @click="clearValue" class="clear"></i>
        </div>
        <span class="search-text" v-if="showSearchBtn" @click="setCity(cityName)">搜索</span>
    </div>
</template>
<script>
    export default {
        props:{
          showSearchBtn:{
            default: false
          },
          holder: {
            default: '请输入要搜索的城市名'
          }
        },
        data () {
            return {
                cityName:'',
            }
        },
        watch: {
            cityName: 'searchCity'
        },
        computed: {

        },
        mounted () {

        },
        methods:{
            searchCity () {
                this.$emit('searchCity', this.cityName)
            },

            /**
             * 清空搜索条件
             */
            clearValue () {
                this.cityName = ''
                this.$emit('clearValue')
            },

            /**
             * 搜索按钮
             */
            setCity () {
                this.$emit('setCity', this.cityName)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../styles/theme.less";
    .search-address-box{
        height:100px;
        padding:20px 20px 20px 20px;
        display:flex;
        .input-box{
            flex:1;
            position:relative;
            input{
                width:100%;
                height:100%;
                line-height:30px;
                border-radius:10px;
                border:1PX solid #ccc;
                padding:15px 50px 15px 20px;
                font-size:28px;
            }
            .clear{
                display:block;
                position:absolute;
                top:15px;
                right:20px;
                width:28px;
                height:28px;
                background:url('../../../assets/cha.png') no-repeat center;
                background-size:26px 26px;
            }
        }
        .search-text{
            margin-left:20px;
            font-size:32px;
            color: #888;
            line-height:60px;
        }
    }
</style>