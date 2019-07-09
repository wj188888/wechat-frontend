<template>
    <div class="form-box mar-b-40 line line-box radius-box">
        <div class="change top-120" @click="changeStation"></div>
        <div class="input-x vux-1px-b mar-r-110" @click="jumpToFrom">
            <label>出发地</label>
            <div class="value-x">{{startPlace}}</div>
        </div>
        
        <div class="input-x mar-r-110" @click="jumpToTo">
            <label>目的地</label>
            <div class="value-x">{{endPlace}}</div>
        </div>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        props:['startPlace', 'endPlace'],
        data () {
            return {

            }
        },
        computed: {

        },
        mounted () {

        },
        methods:{
            changeStation () {
                this.$emit('changeStation')
            },

            jumpToFrom () {
                this.$emit('jumpToFrom')
            },

            jumpToTo () {
                this.$emit('jumpToTo')
            },
        }
    }
</script>
<style scoped>
    .top-120{
      top:120px;
    }
    .mar-r-110{
        margin-right:110px;
    }
</style>