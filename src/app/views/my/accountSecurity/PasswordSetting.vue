<template>
  <main-box :title="title" :show-back="!isUndunionApp" :show-more="!isUndunionApp">
    <div class="normal-list pad-l-20 vux-1px-tb mar-t-0">
      <ul>
        <router-link tag="li" :to="{name:'setPayPasswordStep1'}" class="line line-x-b" v-if="!whetherSetPayPS">
          设置支付密码<i class="icon-r-jt"></i>
        </router-link>
        <router-link tag="li" :to="{name:'changePayPasswordStep1'}" class="line line-x-b" v-if="whetherSetPayPS">
          修改支付密码<i class="icon-r-jt"></i>
        </router-link>
        <router-link tag="li" :to="{name:'setPayPasswordStep1'}" class="line line-x-b" v-if="whetherSetPayPS">
          忘记支付密码<i class="icon-r-jt"></i>
        </router-link>
      </ul>
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
        whetherSetPayPS: false,
        isUndunionApp: TOOL.browser().undunion_app
      }
    },
    mounted () {
      let usrInfo = JSON.parse(appStorage.get('userInfo'));
      this.whetherSetPayPS = usrInfo.whetherSetPayPS
    },
  }
</script>
