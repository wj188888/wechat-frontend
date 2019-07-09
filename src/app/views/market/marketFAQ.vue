<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <div class="outer-box">
      <div class="faq">
        <p class="faq__title">
          Q：什么是全民营销？
        </p>
        <div class="faq__content">
          <div class="faq__class">
            A：
          </div>
          <div class="faq__main-content">
            全民营销是连接平台推出的一款可帮助企业拓宽渠道的应用营销工具，您可以通过分享产品，成功推荐旅客后给予奖励，以此为企业带来更多传播和促进销量提升。
          </div>
        </div>
      </div>

      <div class="faq">
        <p class="faq__title">
          Q：司机如何进行营销推广？
        </p>
        <div class="faq__content">
          <div class="faq__class">
            A：
          </div>
          <div class="faq__main-content">
            将分享链接分享至微信或朋友圈，好友只要浏览了该链接，就可以作为临时客户显示在司机的客户列表，当用户进行了下单支付并完成行程任务，则算作该营销员的正式客户，以后该客户的成交金额营销员都可以赚取佣金。
          </div>
        </div>
      </div>

      <div class="faq">
        <p class="faq__title">
          Q：累计客户为什么有时消失了？
        </p>
        <div class="faq__content">
          <div class="faq__class">
            A：
          </div>
          <div class="faq__main-content">
            如果管理员设置了客户有效期，则超过了有效时间，则该客户将不再是该营销员的客户。
          </div>
        </div>
      </div>

      <div class="faq">
        <p class="faq__title">
          Q：为什么全民营销入口会消失？
        </p>
        <div class="faq__content">
          <div class="faq__class">
            A：
          </div>
          <div class="faq__main-content">
            如果企业管理员将全民营销的功能关闭了，就不会显示该入口了。但是如果您还有未结算的金额，则还会继续显示，但是不能再进行分享，也无法再获得客户的佣金。
          </div>
        </div>
      </div>

      <div class="faq">
        <p class="faq__title">
          Q：营销员之间客户互为客户关系吗？
        </p>
        <div class="faq__content">
          <div class="faq__class">
            A：
          </div>
          <div class="faq__main-content">
            营销员之间不能互为客户关系。如果您之前为其他营销员的客户，成为营销员之后，将不再是其他人的客户。
          </div>
        </div>
      </div>

      <p class="server-tel">客服电话：<a>1878183123</a></p>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox
    },
    data() {
      return {
        title: this.$route.meta.title,
      }
    },
    mounted () {

    },
    methods: {

    }
  }
</script>
<style lang="less" scoped>
  .outer-box {
    padding: 0 20px;
  }
  .faq {

  }
  .faq__title {
    font-size: 28px;
    color: #121212;
    padding: 30px 0 20px 0;
  }
  .faq__content {
    display: flex;
    width: 100%;
    font-size: 26px;
    color: #888;
    line-height: 1.2;
  }
  .faq__class {

  }
  .faq__main-content {
    word-break: break-all;
    word-wrap: break-word;
    text-align: justify;
  }

  .server-tel {
    margin-top: 60px;
    font-size: 26px;
    color: #888;

    text-align: center;

    a {
      color: #07d;
    }
  }

</style>