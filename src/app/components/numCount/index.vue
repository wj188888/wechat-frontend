<template>
    <div class="count" :class="countClass">
        <div class="count__minus"
             @click="minusNum"
             :class="{'count__minus_disable':numCount<=minNumCount}"
        ></div>
        <input class="count__input" type="text"
               @blur="judgeNum"
               v-model="numCount" />
        <div class="count__add"
             @click="addNum"
             :class="{'count__add_disable':numCount>=maxNumCount}"
        ></div>
    </div>
</template>
<script>
    export default {
        props:{
            countClass: {

            },
            maxNum: {
                type: Number,
                default: 100000
            },
            minNum: {
                type: Number,
                default: 0
            },
            num: {

            }
        },
        watch: {
            maxNum(newVal) {
                this.maxNumCount = newVal;
                if(this.numCount > this.maxNumCount) {
                    this.numCount = this.minNumCount;
                    this.emitNum();
                }
            },
            minNum(newVal) {
                this.minNumCount = newVal;
                if(this.numCount < this.minNumCount) {
                    this.numCount = this.minNumCount;
                    this.emitNum();
                }
            },
        },
        data () {
            return {
                maxNumCount: this.maxNum,
                minNumCount: this.minNum,
                numCount: this.num,
            }
        },
        computed: {

        },
        mounted () {

        },
        methods:{
            addNum() {
                if(this.numCount >= this.maxNumCount) {
                    this.$store.dispatch('showError',`最大数量为${this.maxNumCount}`);
                    return;
                }
                this.numCount = Number(this.numCount) + 1;
                this.emitNum();
            },
            minusNum() {
                if(this.numCount <= this.minNumCount) {
                    this.$store.dispatch('showError', `最小数量为${this.minNumCount}`);
                    return;
                }
                this.numCount = Number(this.numCount) - 1;
                this.emitNum();
            },
            judgeNum() {
                if(this.numCount <= this.maxNumCount && this.numCount >= this.minNumCount) {
                    this.emitNum();
                    return;
                }
                this.$store.dispatch('showError', `输入的数字不在限制范围内，请重新输入`);
                this.numCount = this.minNumCount;
                this.emitNum();
            },
            emitNum() {
                this.$emit('emitNum', this.numCount);
            }
        }
    }
</script>
<style type="less" scoped>
    .count {
        display: inline-block;

        width: 200px;
        height: 50px;
    }
    .count__minus,
    .count__add {
        float: left;

        width: 50px;
        height: 50px;
        line-height: 50px;
        border: 1PX solid #e5e5e5;

        text-align: center;
        font-size: 48px;
        color: #999;

        background: url("../../../assets/shop/add-can.png") no-repeat center center;
        background-size: 50px 50px;
    }
    .count__minus {
        background: url("../../../assets/shop/minus-can.png") no-repeat center center;
        background-size: 50px 50px;
    }
    .count__add_disable {
        background: url("../../../assets/shop/add.png") no-repeat center center;
        background-size: 50px 50px;
    }
    .count__minus_disable {
        background: url("../../../assets/shop/minus.png") no-repeat center center;
        background-size: 50px 50px;
    }
    .count__input {
        float: left;

        display: inline-block;
        width: 70px;
        height: 50px;
        /*line-height: 50px;*/
        vertical-align: middle;
        font-size: 32px;
        margin: 0 10px;
        padding: 0 !important;
        border-radius: 0 !important;
        border: 1PX solid #e5e5e5;

        text-align: center;
    }
    .count__disable {
        background: #ccc;
    }
</style>
