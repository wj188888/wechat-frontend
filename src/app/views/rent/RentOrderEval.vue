<template>
  <main-box :title="title" :show-more="true" main-class="scrollingBox bg-ffffff">
    <!--<router-link slot="title" class="hd-cancel" :to="{name: 'userComplain', query:{orderId: orderId, productTypeLevelOne: productTypeLevelOne}}">帮助</router-link>-->

    <rent-address :detailData="detailData" :showTime="false"></rent-address>

    <div class="eval-content back-fff">
      <div class="top-title">
        <div class="border-left"></div>
        <div class="middle">车辆评价</div>
        <div class="border-right"></div>
      </div>
      <div class="anonymous-star wd400 clearfix">
        <div class="any-star star-no mar-r-20" :class="data.selected?'star-yes':''" v-for="(data, index) in starYes" @click="evalScore(index)">
        </div>
      </div>
      <div v-if="webType!='watch'" class="clearfix eval-items">
        <ul>
          <li class="eval-item" :class="{'mar-r-48': index%2 ==0,'border-red':item.isSelected}"
              @click="handleMark(item.text, index)"
              v-for="(item, index) in evalText">
            {{item.text}}
          </li>
        </ul>
      </div>
      <div v-if="webType=='watch'" class="clearfix eval-items">
        <ul>
          <li class="eval-item" :class="{'mar-r-48': index%2 ==0}"
              @click="handleMark(item.text, index)"
              v-for="(item, index) in newevalText">
            {{item.text}}
          </li>
        </ul>
      </div>
      <div v-if="webType!='watch'" class="any-textarea line radius-box mar-t-30 back-fff" style="display: block;">
        <textarea class="textarea widthpre100" placeholder="其他意见和建议（内容匿名，可放心填写）" :disabled="webType == 'watch'" v-model="saveData.comment" maxlength="200"></textarea>
      </div>
      <p v-if="webType=='watch'" class="p-txt">
        “{{saveData.comment}}”
      </p>
      <div v-if="webType!='watch'" class="is-anonymous check-box back-fff" @click="handleAnonymous()">
        匿名 <span class="anonymous-tips">{{saveData.anonymous ? '你写的评价会以匿名的形式展现' : '你的评价能帮助其他小伙伴哦'}}</span>
        <input class="hide" type="checkbox" v-model="saveData.anonymous">
        <i class="icon-check"></i>
      </div>
      <input type="button" v-if="webType != 'watch'" class="any-but button button-primary" :disabled="disableBtn" @click="saveEval" value="提交"/>
    </div>
    <div v-if="webType == 'watch'" class="abs-bottom-box">
      <div class="buy-right buy-w100">
        <a @click="returnPage" class="button button-primary">返回订单</a>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import DriverInfo from 'components/driver-info/index.vue'
  import RentAddress from 'appComponents/rentAddress/index.vue'

  export default {
    components: {
      MainBox,
      DriverInfo,
      RentAddress
    },
    data () {
      return {
        title: this.$route.meta.title,
        webType: this.$route.query.webType,
        orderId:'',
        score: '',
        productTypeLevelOne: '',
        starYes: [{selected: false}, {selected: false}, {selected: false}, {selected: false}, {selected: false}],
        detailData: {
          aAddress:{},
          bAddress:{},
          allTime:{}
        },
        saveData: {
          productTypeLevelOne: '',
          orderId: '',
          score: '',
          comment: '',
          anonymous: true,
          marks: []
        },
        driverData: {},
        currentStatus: 'edit',
        newevalText: [],
        evalText: [
          {text:'操控感很好',isSelected: false},
          {text:'内饰很好看',isSelected: false},
          {text:'车内整洁',isSelected: false},
          {text:'加速度很好',isSelected: false}
        ],
        disableBtn: false,
        starWord: ['非常不满意，各方面都差', '不满意，比较差', '一般需要改善', '比较满意但仍可以改善', '非常满意，无可挑剔']
      }
    },
    computed: {
      starHtml () {
        return TOOL.renderStar(this.driverData.driverScore)
      },
    },
    watch: {
      $route (val, oldVal) {
        this.webType = this.$route.query.webType;
        if(this.webType == 'watch') {
          this.getOrderDetail();
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init() {
        this.orderId = this.$route.query.orderId;
        this.productTypeLevelOne = this.$route.query.productTypeLevelOne;
        this.saveData.productTypeLevelOne = this.productTypeLevelOne;
        this.webType = this.$route.query.webType;
        this.orderDetailById();
        if(this.webType == 'watch') {
          this.getOrderDetail();
        }
      },

      handleAnonymous() {
        if(this.webType == 'watch') {
          return ;
        }
        this.saveData.anonymous = !this.saveData.anonymous
      },

      handleMark(value, index) {
        if(this.webType == 'watch') {
          return ;
        }
        var key = this.checkDuplicate(value, this.saveData.marks);
        if(key == -1) {
          this.saveData.marks.push(value);
          this.evalText[index].isSelected = true;
        } else {
          this.saveData.marks.splice(key, 1);
          this.evalText[index].isSelected = false;
        }
      },

      checkDuplicate(value, arr) {
        for(var x in arr) {
          if(arr[x] == value) {
            return x;
          }
        }
        return -1;
      },

      preHandleMarkDuplicate(value, arr) {
        for(var x in arr) {
          if(arr[x].text == value) {
            return x;
          }
        }
        return -1;
      },

      /**
       * 查找订单详情
       */
      orderDetailById () {
        this.$store.commit('UPDATE_LOADING', true)
        api.rentOrderDetailById({
          orderId:this.orderId
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.detailData = data.resultData;
            this.dateCompare(this.detailData.startTime,this.detailData.endTime);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      dateCompare(startTime, endTime) {
        startTime = TOOL.changeDateStyle(startTime);
        endTime = TOOL.changeDateStyle(endTime);
        let compareMs = new Date(endTime).getTime() - new Date(startTime).getTime();
        let days = Math.floor(compareMs/(3600000*24));
        let hours = Math.ceil((compareMs%(3600000*24))/3600000);
        this.detailData.allTime = {day: days, hour: hours};
        return {day: days, hour: hours}
      },

      getOrderDetail() {
        api.evalDetailById({orderId: this.orderId}).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode == '0') {
            this.saveData = data.resultData;
            for (let j = 0; j < this.saveData.score; j++) {
              this.starYes[j].selected = true
            }
            let markLength = this.saveData.mark.length;
            for (let i = 0; i < markLength; i++) {
              let x = this.preHandleMarkDuplicate(this.saveData.mark[i], this.evalText);
              if(x > -1) {
                this.evalText[x].isSelected = true;
                this.newevalText.push(this.evalText[x]);
              }
            }

          } else {
            this.$store.dispatch('showError', data.resultMsg)
          }
        })
      },
      evalScore (data) {
        if(this.webType == 'watch') {
          return ;
        }
        this.clear()
        let star = $(".any-star")
        let content = this.starWord[data]
        let lenData = data + 1
        this.saveData.score = lenData
        this.saveData.comment = content
        /*if (data == 3 || data == 4) {
         this.saveData.comment = content
         } else {
         this.saveData.comment = ''
         }*/
        for (let j = 0; j < lenData; j++) {
          this.starYes[j].selected = true
        }
      },
      clear () {
        let star = $(".any-star")
        for (let i = 0; i < star.length; i++) {
          this.starYes[i].selected = false
        }
      },
      saveEval () {
        this.saveData.orderId = this.orderId
        let score = this.saveData.score
        let comment = this.saveData.comment
        if (!score || !comment) {
          this.$store.dispatch('showError', '评价内容不能为空')
          return
        }
        let tempMarks = this.saveData.marks
        this.saveData.marks = this.saveData.marks.join(',');
        this.disableBtn = true
        api.orderEval(this.saveData).then(res => {
          const data = TOOL.toJson(res.data)
          this.disableBtn = false
          if (data.resultCode == '0') {
            this.$store.dispatch('showSuccess', data.resultMsg)
            this.$router.replace({
              name: 'rentOrderEval',
              query: {
                orderId: this.orderId,
                productTypeLevelOne: this.productTypeLevelOne,
                webType: 'watch'
              }
            })
          } else {
            this.saveData.marks = tempMarks;
            this.$store.dispatch('showError', data.resultMsg)
          }
        })
      },
      returnPage() {
        let orderListRouter = TOOL.getOrderListPageRouter()
        this.$router.push({
          name: orderListRouter,
          query: {
            status: 5
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .is-anonymous{
    margin-top:60px;
    padding-left:50px;
    border-top:1PX solid #d9d9d9;
    font-size:28px;
    color:#121212;
    background:#f8f8f8;
  .icon-check{
    left:0;
  }
  .anonymous-tips{
    float:right;
    height:100%;
    font-size:24px;
    color:#888;
  }
  }
  .eval-items {
    margin-top: 60px;
  }
  .eval-item {
    float: left;
    width: 45%;
    height: 46px;
    line-height: 46px;
    color: #888;
    font-size: 24px;
    -webkit-border-radius:23px;
    -moz-border-radius:23px;
    border-radius:23px;
    border: 1PX solid #ccc;
    text-align: center;
    margin-bottom: 32px;
  }
  .border-red {
    border-color: #ff6600;
    color: #ff6600;
  }
  .mar-r-48 {
    margin-right: 10%;
  }
  .mar-r-20 {
    margin-right: 20px !important;
  }
  .mar-t-30 {
    margin-top: 30px !important;
  }
  .wd400 {
    width: 400px !important;
  }
  .widthpre100 {
    width: 100% !important;
  }
  .back-fff {
    background: #fff !important;
  }
  .p-txt {
    width: 100%;
    color: #888;
    font-size: 24px;
    line-height: 30px;
    word-break: break-all;
    word-wrap: break-word;
    text-align: center;
  }
</style>
