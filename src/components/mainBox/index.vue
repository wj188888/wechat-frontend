<template>
<div class="app-layout">
    <c-header v-if="showHeader" :title="title" :show-back="showBack" :show-more="showMore" :close-callback="goBack">
        <slot name="title"></slot>
    </c-header>
    <slot name="header"></slot>
    <div class="app-container">
        <div class="app-main" :class="[mainClass]">
            <slot></slot>
        </div>
        <slot name="main-footer"></slot>
    </div>
    <slot name="footer"></slot>
</div>
</template>
<script>
    import CHeader from 'components/c-header/index.vue'
    export default {
        components: {
            CHeader
        },
        props:{
            showHeader:{
                default:true
            },
            title: String,
            showBack:{
                default: true
            },
            showMore:{
                default: true
            },
            goBack: Function,
            mainClass: String,
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