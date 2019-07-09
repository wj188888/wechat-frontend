<template>
  <main-box :title="title" :show-more="true" main-class="scrollingBox has-abs-bottom">
    <div class="shop__detail">
      {{shopDetail.name}}
    </div>
    
    <div class="mar-t-20" v-show="!shopDetail.goodsPriceSetting.unifiedSetting">
      <div class="goods-props-box line line-x-b" v-for="(modal, index) in modals">
        <p class="goods-type">{{modal.title}}：</p>
        <ul class="goods-prop clearfix">
          <li v-for="(item, subIndex) in modal.contents"
              @click="setProps(modal, index, item, subIndex)"
              :class="{'active': item.name === modal.selectVal, 'disabled': !item.inventory}">
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>
    
    <div class="inline-box line line-x-b mar-t-20">
      <label>购买数量：</label>
      <NumCount countClass="mar-t-20"
                :minNum="1"
                :maxNum="maxBuyNumber"
                @emitNum="emitNum"
                :num="orderDetail.num"></NumCount>
    </div>
    
    <div class="inline-box line line-x-b mar-t-20">
      <label>用户姓名：</label>
      <input type="text" placeholder="请输入用户姓名" maxlength="15"  v-model="orderDetail.contactName"/>
    </div>
    
    <div class="inline-box line line-x-t">
      <label>手机号码：</label>
      <input type="text" placeholder="请输入手机号码"  v-model="orderDetail.contactTelephone" maxlength="13"/>
    </div>
    
    <div class="inline-box line mar-t-20">
      <label>备注：</label>
      <input type="text" placeholder="请填写您要填写的备注信息" v-model="orderDetail.remark" maxlength="20"/>
    </div>
    
    <div slot="footer">
      <div class="abs-bottom-box">
        <div class="buy-left" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span>{{orderDetail.price | formatPrice}}</span>
        </div>
        <div class="buy-right">
          <input class="button button-primary"
                 type="button"
                 @click="createOrder"
                 :disabled="!orderDetail.price"
                 value="提交订单"/>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import CHeader from 'components/c-header/index.vue'
  import MainBox from 'components/mainBox/index.vue'
  import NumCount from 'appComponents/numCount/index.vue'
  import { Swiper, SwiperItem } from 'vux'
  
  export default {
    components: {
      MainBox,
      CHeader,
      Swiper,
      SwiperItem,
      NumCount,
    },
    data () {
      return {
        title: this.$route.meta.title,
        serviceTel: 'tpl:110',
        pageRouter: this.$route.name,
        id: this.$route.query.id || '',
        userInfo: {},
        shopDetail: {
          banners: ['../../../assets/range_down.png'],
          goodsPriceSetting: {
            // 默认统一规格
            unifiedSetting: true,
          },
        },
        itemDtos:[],
        orderDetail: {
          goodsId: this.$route.query.id || '',
          contactName: '',
          contactTelephone: '',
          properties: [],
          // 购买数量
          num: 1,
          // 订单来源 0：网约（微信公众号） 1：电招 2：android 3：ios
          orderSource: 0,
          remark: '',
          price: '',
          // 表单id
          formId: '',
        },
        // 最大购买数量
        maxBuyNumber: 1111111,
        modals: [],
        canCreateOrder: true,
        showPriceDetail: false,
        priceMore: true,
      }
    },
    mounted(){
      if(appStorage.get('userInfo')) {
        this.userInfo = JSON.parse(appStorage.get('userInfo'));
        this.orderDetail.contactTelephone = this.userInfo.phone || '';
      }
      this.findShopDetailById();
    },
    watch: {
      'orderDetail.num'(newVal) {
        this.getPrice();
      }
    },
    methods: {
      findShopDetailById() {
        if(!this.id) {
          this.$store.dispatch('showError', '参数id不存在');
        }
        api.findShopDetailById(this.id).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.serviceTel = 'tpl:'+data.resultData.serviceTel;
            this.shopDetail = data.resultData.goods;
            this.itemDtos = data.resultData.itemDtos
            this.visitLog();
            this.initModal();
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      visitLog () {
        TOOL.saveVisitLogs({
          url: this.$route.name,
          productId: this.shopDetail.id,
          productTypeLevelOne: this.shopDetail.productTypeLevelOne,
          productTypeLevelTwo: this.shopDetail.productTypeLevelTwo
        })
      },
      
      initModal() {
        if(!this.shopDetail.goodsPriceSetting.unifiedSetting) {
          this.modals.length = 0;
          let properties = this.shopDetail.goodsPriceSetting.properties;
          let items = []
          for(let [index, item] of this.itemDtos.entries()) {
            let modalObj = JSON.parse(JSON.stringify(item));
            items.push(modalObj);
          }
          this.modals.push({
            title: properties[0].title,
            contents: items,
            selectVal: ''
          })
          this.getSubItems(items, 0)
        }
      },
      
      getSubItems (itemDtos, index) {
        let itemDto = itemDtos[index]
        let items = []
//        console.log(itemDtos)
        if(itemDto && itemDto.subItems && itemDto.subItems.length > 0){
          for(let [i, item] of itemDto.subItems.entries()) {
            let modalObj = JSON.parse(JSON.stringify(item));
            items.push(modalObj);
          }
          let modalObj = {
            title: itemDto.subItemsTitle,
            contents: items,
            selectVal: ''
          }
          let hasItem = 'no'
          for(let [i, item] of this.modals.entries()) {
           if(item.title === modalObj.title){
             hasItem = i
             break;
           }
          }
          if(hasItem !== 'no'){
            this.$set(this.modals, hasItem, modalObj)
          }else{
            this.modals.push(modalObj)
          }
          
          this.getSubItems(items, 0)
        }
      },
      
      setProps (modal, index, item, subIndex) {
        this.orderDetail.price = 0
        this.modals[index].selectVal = item.name
        this.getSubItems(modal.contents, subIndex)
        this.setMaxBuyNumber(item.inventory)
        this.getProperties();
        this.getPrice();
      },
      
      setMaxBuyNumber (inventory) {
        // 如果不限购，最大购买数量等于库存
        if(!this.shopDetail.limitBuyNumber) {
          this.maxBuyNumber = inventory;
        } else {
          // 如果限购，最大购买数量去库存和限制数量中的最小值
          this.maxBuyNumber = inventory > this.shopDetail.maxBuyNumber ? this.shopDetail.maxBuyNumber : inventory;
        }
      },
  
      getProperties() {
        this.orderDetail.properties.length = 0;
        for(let [index, val] of this.modals.entries()) {
          if(val.selectVal){
            this.orderDetail.properties.push(val.selectVal);
          }
        }
      },
      
      getPrice() {
        let apiData = {
          goodsId: this.$route.query.id,
          num: this.orderDetail.num,
          properties: '',
        };
        if(!this.shopDetail.goodsPriceSetting.unifiedSetting) {
          if(this.orderDetail.properties.length  !== this.modals.length){
            return
          }
          apiData.properties = this.orderDetail.properties + '';
        } else {
          this.orderDetail.properties.length = 0;
        }
        api.getShopPrice(apiData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.orderDetail.price = data.resultData.price || 0;
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
  
     
      
      emitNum(num) {
        this.orderDetail.num = num;
      },
      
      createOrder() {
        if(!this.canCreateOrder) {
          return;
        }
        let validata = TOOL.formValidate([
          {value: this.orderDetail.contactName, emptyTips: '请输入用户姓名'},
          {value: this.orderDetail.contactTelephone, emptyTips: '请输入手机号码', regName: 'telephone',regTips: '手机号码格式不正确'},
          {value: this.orderDetail.num, emptyTips: '请输入购买数量'},
        ]);
        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        if(!this.shopDetail.goodsPriceSetting.unifiedSetting) {
          this.getProperties();
        } else {
          this.orderDetail.properties.length = 0;
        }
        this.orderDetail.formId = Date.now() + '';
        
        let apiData = Object.assign({}, this.orderDetail);
        this.canCreateOrder = false;
        api.createShopOrder(apiData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.$router.push({
              name: 'shopOrderDetail',
              query: {
                orderId: data.resultData
              }
            })
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
          this.canCreateOrder = true;
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  .shop__detail {
    width: 100%;
    padding: 20px;
    
    font-size: 32px;
    color: #121212;
    background: #fff;
    
    word-break: break-all;
    word-wrap: break-word;
  }
  .goods-props-box{
    padding-bottom:10px;
    background: #fff;
    .goods-type{
      font-size:28px;
      color:#121212;
      padding:20px 20px 40px;
    }
    .goods-prop{
      padding: 0 20px;
      li{
        float:left;
        min-width:130px;
        padding:12px;
        text-align: center;
        font-size:26px;
        color:#888;
        background:#e6e6e6;
        margin-left:10px;
        margin-bottom:20px;
        border-radius:4PX;
        &:first-child{
          margin-left:0;
        }
        &.active{
          color:#fff;
          background:#ff6600;
        }
        &.disabled{
          color:#ccc;
          background:#e5e5e5;
        }
      }
    }
  }
</style>