<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="mar20">
      <product-top-nav :show="pageId == 7" ctg="LINE_BUS" :active="1" :nav1router="jumpToLineCar"></product-top-nav>
      <div class="charter-tip">
        <p>1、请填写您的包车需求、以方便我们做出准确的报价。</p>
        <p>2、预约省内包车需提前 <em>{{innerProvinceTips}}</em>，以方便相应备案手续办理。</p>
        <p>3、预约省际包车需提前 <em>{{crossProvinceTips}}</em>，以方便相应备案手续办理。</p>
      </div>
      <div class="form-box pad-r-110 line line-box radius-box">
        <div class="change" @click="changeStation"></div>
        <div class="input-x vux-1px-b" @click="jumpToBdStation('aAddress')">
          <label>出发地</label>
          <div class="value-x" v-text="enquiryDTO.aAddress.detailAddress"></div>
        </div>
        <div class="input-x" @click="jumpToBdStation('bAddress')">
          <label>目的地</label>
          <div class="value-x" v-text="enquiryDTO.bAddress.detailAddress"></div>
        </div>
      </div>
      <div class="mar-b-20 line line-box radius-box">
        <div class="inline-box">
          <label>包车类型</label>
          <select v-selector="enquiryDTO.type">
            <option value="0">往返</option>
            <option value="1">单程</option>
          </select>
          <i class="icon-r-jt"></i>
        </div>
        <div class="inline-box line line-x-t" @click="showEmptyAddressTips" v-show="!enquiryDTO.aAddress.province || !enquiryDTO.bAddress.province">
          <label>出行时间</label>
          <input type="text" placeholder="请选择出行时间" readonly/>
          <i class="icon-r-jt"></i>
        </div>
        <div class="inline-box line line-x-t" v-show="enquiryDTO.aAddress.province && enquiryDTO.bAddress.province">
          <label>出行时间</label>
          <input type="text" placeholder="请选择出行时间" v-mobidatetime:startConfig="enquiryDTO.startupTime" readonly/>
          <i class="icon-r-jt"></i>
        </div>

        <div class="inline-box line line-x-t" @click="showEmptyAddressTips" v-show="(!enquiryDTO.aAddress.province || !enquiryDTO.bAddress.province) && enquiryDTO.type != 1">
          <label>返程时间</label>
          <input type="text" placeholder="请选择返程时间" readonly/>
          <i class="icon-r-jt"></i>
        </div>
        <div class="inline-box line line-x-t" v-show="enquiryDTO.aAddress.province && enquiryDTO.bAddress.province && enquiryDTO.type != 1">
          <label>返程时间</label>
          <input type="text" placeholder="请选择返程时间" v-mobidatetime:startConfig="enquiryDTO.returnTime" readonly/>
          <i class="icon-r-jt"></i>
        </div>

        <div class="inline-box line line-x-t">
          <label>出行天数</label>
          <span v-if="enquiryDTO.type != 1" v-text="getTravelDays"></span>
          <input type="number" placeholder="输入出行天数" v-if="enquiryDTO.type == 1" v-model.number="enquiryDTO.travelDays"/>
        </div>
        <div class="inline-box line line-x-t">
          <label>乘车人数</label>
          <input type="number" placeholder="输入乘车人数" v-model.number="enquiryDTO.passengerNumber"/>
        </div>
      </div>
      <div class="mar-b-20 line line-box radius-box">
        <div class="inline-box line line-x-t">
          <label>手机号码</label>
          <input type="tel" placeholder="请输入手机号码" v-model="enquiryDTO.contactTelephone"/>
        </div>
      </div>
      <div class="chart-check line line-box radius-box">
        <div class="check-div line line-x-b" @click="enquiryDTO.supplyFood = !enquiryDTO.supplyFood">
          <p :class="{'hole-height':customProduct.subsidizedFood == 0}">是否提供司机餐饮</p>
          <p class="subtitle" v-if="customProduct.subsidizedFood > 0">如果不包&nbsp;&nbsp;报价约贵{{customProduct.subsidizedFood}}元/天</p>
          <input class="hide" type="checkbox" v-model="enquiryDTO.supplyFood">
          <i class="icon-check right-0"></i>
        </div>
        <div class="check-div line line-x-b" @click="enquiryDTO.supplySleep = !enquiryDTO.supplySleep">
          <p :class="{'hole-height':customProduct.subsidizedFood == 0}">是否提供司机住宿</p>
          <p class="subtitle" v-if="customProduct.subsidizedAccommodation > 0">如果不包&nbsp;&nbsp;报价约贵{{customProduct.subsidizedAccommodation}}元/天</p>
          <input class="hide" type="checkbox" v-model="enquiryDTO.supplySleep">
          <i class="icon-check right-0"></i>
        </div>
      </div>
      <div class="base-info"><i class="base-icon"></i>备注</div>
      <div class="textarea-x line line-box radius-box">
        <textarea class="textarea" placeholder="备注在这里，在这里~" maxlength="200" v-model="enquiryDTO.remark"></textarea>
      </div>
      <div class="agree" @click="chooseState = !chooseState">
        <input class="hide" type="checkbox" v-model="chooseState">
        <i class="icon-check inline"></i>
        我已阅读并同意<a @click.stop="jumpToCharterAgreement">包车协议</a>
      </div>
    </div>
    <div class="abs-bottom-box relative">
      <div class="buy-left" v-show="customProduct.needPrePay">
        <label>预付</label>
        <span v-text="'¥' + customProduct.prePayMoney">¥0</span>
      </div>
      <div class="buy-right" :class="{'buy-w100': !customProduct.needPrePay}">
        <input type="button" class="button button-primary button-no-radius" @click="applyCharter" :value="customProduct.needPrePay ? '发起包车': '确认提交'"/>
      </div>
    </div>
  </main-box>

</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ProductTopNav from 'appComponents/productTopNav/index.vue'
  import Mobidatetime from 'directives/mobiDateTime'
  import selector from 'directives/select'
  let now = new Date();

  export default {
    directives: {
      Mobidatetime,
      selector
    },
    components: {
      MainBox,
      ProductTopNav
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        pageId:'',
        enqueryId: '',
        minDate: '',
        chooseState: true, //是否勾选包车协议
        enquiryDTO: {
          formId: TOOL.getTimeStamp(), //防重复提交字段
          productId: '', //产品的ID
          productTypeLevelOne: '', //第一层产品类型：城际班次等
          quoteHour: '', //询价失效时间 （根据产品中用户需求失效时间决定）
          notifyType: '', //通知类型：0通知给公司，1通知司机 (由自定义产品的报价权限来决定，企业报价给通知给公司，司机自行报价则通知给司机)
          aAddress: {
            province: '',
            city: '',
            county: '',
            detailAddress: TOOL.placeHolder.startPlace,
            longitude: 0,
            latitude: 0
          },
          bAddress: {
            province: '',
            city: '',
            county: '',
            detailAddress: TOOL.placeHolder.endPlace,
            longitude: 0,
            latitude: 0
          },
          startupTime: '',
          returnTime: '',
          travelDays: TOOL.placeHolder.travelDays,
          passengerNumber: '',
          type: 1, //行程类别：0往返 1.单程 2.用户定义 3.空返（单程）
          contactName: '',
          contactTelephone: '',
          supplyFood: false, //是否提供司机餐饮
          supplySleep: false, //是否提供司机住宿
          supplyInvoice: false, //是否提供发票
          remark: ''
        },
        customProduct: {},
        innerProvinceTips: '', //省内时间范围提示
        crossProvinceTips: '',//省际时间范围提示
        minTime: '', //出行时间范围
        maxTime: '', //出行时间范围
        charterPayTimer: '', //支付定时器
        provinceType: '', //标记当前选择为省内或省际
      }
    },
    computed: {
      //根据出行时间和返程时间计算出行天数
      getTravelDays () {
        if (this.enquiryDTO.startupTime && this.enquiryDTO.returnTime) {
          let dateComp = TOOL.dateCompare(this.enquiryDTO.returnTime, this.enquiryDTO.startupTime, 'datetime');
          if (dateComp > 0) {
            this.enquiryDTO.travelDays = Math.ceil(dateComp / (24 * 60 * 60 * 1000))
          } else {
            this.enquiryDTO.travelDays = 0
          }
        } else {
          this.enquiryDTO.travelDays = TOOL.placeHolder.travelDays
        }
        return this.enquiryDTO.travelDays
      },
      startConfig () {
        let minTime
        let maxTime
        let nowMs
        let aProvince = this.enquiryDTO.aAddress.province
        let bProvince = this.enquiryDTO.bAddress.province

        if (aProvince && bProvince) {
          if (aProvince === bProvince) {
            this.provinceType = 'inner'
            minTime = this.customProduct.innerProvinceCharterPreOrderMinMinute
            maxTime = this.customProduct.innerProvinceCharterPreOrderMaxMinute
          } else {
            this.provinceType = 'cross'
            minTime = this.customProduct.crossProvinceCharterPreOrderMinMinute
            maxTime = this.customProduct.crossProvinceCharterPreOrderMaxMinute
          }

          /**
           * 填写出行时间及返程时间后，修改省内省外地址清除值重新选择
           */
          let localData = {}
          if (appStorage.get(this.pageRouter)) {
            localData = JSON.parse(appStorage.get(this.pageRouter))
          }
          if (localData.provinceType && localData.provinceType !== this.provinceType) {
            this.enquiryDTO.startupTime = ''
            this.enquiryDTO.returnTime = ''
            this.enquiryDTO.travelDays = TOOL.placeHolder.travelDays
          }

          /**
           * 计算出行时间必须大于当前日期加上预约时间
           */
          minTime = minTime * 60 * 1000
          maxTime = maxTime * 60 * 1000
          nowMs = new Date().getTime();
          this.minTime = minTime + nowMs;
          this.maxTime = maxTime + nowMs;

          return {
            min: new Date(this.minTime),
            max: new Date(this.maxTime),
            dateWheels: '|MM dd DD|',
            dateFormat: 'yy-mm-dd',
            timeWheels: 'HHii',
            steps: {
              minute: TOOL.minuteStep,
              zeroBased: true
            }
          }
        } else {
          return {
            min: now,
            max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
            dateWheels: '|MM dd DD|',
            dateFormat: 'yy-mm-dd',
            timeWheels: 'HHii',
            steps: {
              minute: TOOL.minuteStep,
              zeroBased: true
            }
          }
        }
      }
    },
    mounted () {
      if(this.$route.query.pageName){
        this.title = this.$route.query.pageName
      }
      this.pageId = +this.$route.query.pageId || 7

      this.enqueryId = this.$route.query.enqueryId
      this.customProductFind()

      if (appStorage.get('X-Auth-Token')) {
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        this.enquiryDTO.contactTelephone = usrInfo.phone
      }

      /**
       * 编辑
       */
      if (this.enqueryId) {
        this.enquiryFindById()
      } else {
        if (appStorage.get(this.pageRouter)) {
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          delete localData.provinceType
          this.enquiryDTO = localData
        }
      }
    },
    destroyed () {
      if (this.charterPayTimer) {
        clearInterval(this.charterPayTimer)
      }
    },
    methods: {
      showEmptyAddressTips () {
        this.$store.dispatch('showError', '请先选择地址');
      },

      getTimeTips (time) {
        let day, hour, minite, result;
        if (time / 60 < 24) {
          hour = Math.floor(time / 60)
          minite = time % 60
          result = hour + '小时'
          if (minite !== 0) {
            result += minite + '分钟'
          }
        } else {
          day = Math.floor(time / 60 / 24)
          hour = time / 60 - day * 24
          minite = time % 60
          result = day + '天'
          if (hour !== 0) {
            result += hour + '小时'
          }
          if (minite !== 0) {
            result += minite + '分钟'
          }
        }
        return result
      },

      /**
       * 定制包车产品查询
       */
      customProductFind () {
        api.customProductFind().then(res=>{
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            if (data.resultData.content.length > 0) {
              let info = data.resultData.content[0]
              this.customProduct = info
              this.enquiryDTO.productId = info.id
              this.enquiryDTO.productTypeLevelOne = info.productTypeLevelOne
              this.enquiryDTO.quoteHour = parseInt(info.quoteHour)
              this.enquiryDTO.notifyType = parseInt(info.quotePermission)

              this.innerProvinceTips = this.getTimeTips(this.customProduct.innerProvinceCharterPreOrderMinMinute)
              this.crossProvinceTips = this.getTimeTips(this.customProduct.crossProvinceCharterPreOrderMinMinute)

              //统计产品详情页面pvuv
              TOOL.saveVisitLogs({
                url: this.$route.name,
                productId: this.enquiryDTO.productId,
                productTypeLevelOne: this.enquiryDTO.productTypeLevelOne
              })
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       *  编辑根据id查找询价信息
       */
      enquiryFindById () {
        api.enquiryFindById(this.enqueryId).then(res=>{
            const result = TOOL.toJson(res.data)
            if (result.resultCode === '0') {
              if (appStorage.get(this.pageRouter)) {
                this.enquiryDTO = JSON.parse(appStorage.get(this.pageRouter))
              } else {
                this.enquiryDTO = result.resultData
              }
            } else {
              this.$store.dispatch('showError', result.resultMsg);
            }
          }
        )
      },

      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = this.enquiryDTO
        localData.provinceType = this.provinceType
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 跳转包车协议
       */
      jumpToCharterAgreement () {
        this.saveForm()
        this.$router.push({
          name: 'charterAgreement'
        })
      },

      /**
       * 跳转百度地图选择
       */
      jumpToBdStation (dataKey) {
        this.saveForm()
        appStorage.remove('CURRENTCITY')
        this.$router.push({
          name: 'bdStation',
          query: {
            fromPage: this.pageRouter,
            dataKey: dataKey
          }
        })
      },

      /**
       * 切换按钮
       */
      changeStation () {
        let aAddress = this.enquiryDTO.aAddress;
        if (this.enquiryDTO.bAddress.detailAddress !== TOOL.placeHolder.endPlace) {
          this.enquiryDTO.aAddress = this.enquiryDTO.bAddress
        } else {
          this.enquiryDTO.aAddress = {
            province: '',
            city: '',
            county: '',
            detailAddress: TOOL.placeHolder.startPlace,
            longitude: 0,
            latitude: 0
          }
        }

        if (aAddress.detailAddress !== TOOL.placeHolder.startPlace) {
          this.enquiryDTO.bAddress = aAddress
        } else {
          this.enquiryDTO.bAddress = {
            province: '',
            city: '',
            county: '',
            detailAddress: TOOL.placeHolder.endPlace,
            longitude: 0,
            latitude: 0
          }
        }
      },

      jumpToLineCar () {
        this.$router.push({
          name: 'lineCar'
        })
      },

      /**
       * 询价发起编辑或创建
       */
      applyCharter () {
        if (!appStorage.get('X-Auth-Token')) {
          this.saveForm()
          TOOL.login()
          return;
        }

        let validJson = this.enquiryDTO, validata, errorTimeTips;

        if (this.enquiryDTO.aAddress.province === this.enquiryDTO.bAddress.province) {
          errorTimeTips = '省内包车只能提前' + this.innerProvinceTips + '预约'
        } else {
          errorTimeTips = '省际包车只能提前' + this.crossProvinceTips + '预约'
        }

        validata = TOOL.formValidate([
          {value: validJson.aAddress.city, emptyTips: '出发地不能为空'},
          {value: validJson.bAddress.city, emptyTips: '目的地不能为空'},
        ]);
        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        //出行时间验证
        if (!this.enquiryDTO.startupTime) {
          this.$store.dispatch('showError', '出行时间不能为空');
          return false;
        } else {
          let startupTime = Date.parse(TOOL.newGetDate({date: this.enquiryDTO.startupTime, type: 'formatDate'}))
          if (startupTime < this.minTime || startupTime > this.maxTime) {
            this.$store.dispatch('showError', errorTimeTips);
            return false;
          }
        }

        //返程时间验证
        if (this.enquiryDTO.type === 0) {
          if (!this.enquiryDTO.returnTime) {
            this.$store.dispatch('showError', '返程时间不能为空');
            return false;
          } else {
            let startupTime = Date.parse(TOOL.newGetDate({date: this.enquiryDTO.startupTime, type: 'formatDate'}))
            let returnTime = Date.parse(TOOL.newGetDate({date: this.enquiryDTO.returnTime, type: 'formatDate'}))
            if (returnTime <= startupTime) {
              this.$store.dispatch('showError', '返程时间需大于出行时间');
              return false;
            }
          }
        }

        validata = TOOL.formValidate([
          {value: validJson.travelDays, emptyTips: '出行天数不能为空', regName: 'zsNumber', regTips: '天数必须为大于零的整数'},
          {value: validJson.passengerNumber, emptyTips: '乘车人数不能为空', regName: 'zsNumber', regTips: '人数必须为大于零的整数'},
          {value: validJson.contactTelephone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        let checked = this.chooseState
        if (!checked) {
          this.$store.dispatch('showError', '请阅读并接受包车协议');
          return false;
        }

        this.$store.dispatch('showConfirm', {
          title: '确认',
          content: '是否提交包车申请？',
          onConfirm: ()=>{
            this.$store.commit('UPDATE_LOADING', true)

            this.enquiryDTO.startupTime = TOOL.newGetDate({date: this.enquiryDTO.startupTime, type: 'holeDate'})

            //单程清空返程时间
            if (this.enquiryDTO.type === 1) {
              this.enquiryDTO.returnTime = ''
            } else {
              this.enquiryDTO.returnTime = TOOL.newGetDate({date: this.enquiryDTO.returnTime, type: 'holeDate'})
            }

            api.enquiryCreate(this.enquiryDTO).then(res=>{
              const result = TOOL.toJson(res.data)
              if (result.resultCode === '0') {
                this.deleteForm()
                let enquiryId = result.resultData.id
                if (this.customProduct.needPrePay) {
                  interfaceApi.wxPay({
                    enquiryId: enquiryId,
                    productId: this.enquiryDTO.productId,
                    productTypeLevelOne: 'CUSTOM_BUS_enquiry',
                    wxPaySuccess: TOOL.wxPaySuccess,
                    wxPayFail: TOOL.wxPayFail,
                    price: this.customProduct.prePayMoney
                  })
                } else {
                  this.$router.replace({
                    name: 'charterSuccess',
                    query: {
                      enqueryId: enquiryId
                    }
                  })
                }

              } else {
                this.$store.commit('UPDATE_LOADING', false)
                this.enquiryDTO.formId = TOOL.getTimeStamp()
                this.$store.dispatch('showError', result.resultMsg);
              }
            })
          },
          onCancel: () =>{
            this.$store.commit('UPDATE_LOADING', false)
            this.enquiryDTO.formId = TOOL.getTimeStamp()
          }
        })
      }

    }
  }
</script>
