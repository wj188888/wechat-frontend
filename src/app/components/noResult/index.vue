<template>
    <div class="city-no-bus" v-if="show">
      <slot></slot>
      <div v-html="text"></div>
    </div>
</template>
<script>
    export default {
        props:['show', 'text'],
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
