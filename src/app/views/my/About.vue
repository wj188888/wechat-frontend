<template>
  <main-box :title="title" :show-back="!isUndunionApp" :show-more="!isUndunionApp">
    <div class="normal-list pad-l-20 vux-1px-tb">
      <ul>
        <router-link tag="li" :to="{name:'registerProtocol'}" class="line line-x-b">
          注册协议<i class="icon-r-jt"></i>
        </router-link>
        <router-link tag="li" :to="{name:'companyIntro'}" class="line line-x-b">
          公司简介<i class="icon-r-jt"></i>
        </router-link>
        <router-link tag="li" :to="{name:'support'}">
          技术支持<i class="icon-r-jt"></i>
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
        isUndunionApp: TOOL.browser().undunion_app
      }
    },
  }
</script>
