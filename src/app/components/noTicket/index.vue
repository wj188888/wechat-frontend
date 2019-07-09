<template>
    <div class="tic-box" v-if="show">
        <div class="no-container">
            <p>
                <img src="../../../assets/ticket/no_ticket.png">
            </p>
            <p v-html="text"></p>
        </div>
        <div class="no-but">
            <slot></slot>
        </div>
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