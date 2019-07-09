<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="mar20">
      <div class="base-info info-mg"><i class="base-icon"></i>基础信息填写</div>
      <div class="form-box pad-r-110 line line-box radius-box">
        <div class="change" @click="changeStation"></div>
        <div class="input-x vux-1px-b" @click="jumpToBdStation('aAddress')">
          <label>出发地</label>
          <div class="value-x" v-text="SchoolWorkApplication.aAddress.detailAddress"></div>
        </div>
        <div class="input-x" @click="jumpToBdStation('bAddress')">
          <label>目的地</label>
          <div class="value-x" v-text="SchoolWorkApplication.bAddress.detailAddress"></div>
        </div>
      </div>

      <div class="inline-box mar-t-20 line line-box radius-box" @click="jumpToOperateTime">
        <label>运行时间</label>
        <span v-text="SchoolWorkApplication.operateTime.join(',')"></span>
        <i class="icon-r-jt"></i>
      </div>

      <div class="inline-box mar-t-20 line line-x-t">
        <label>开始日期</label>
        <input type="text" placeholder="请选择开始日期" v-mobidate:dateStart="SchoolWorkApplication.startDate" readonly/>
        <i class="icon-r-jt"></i>
      </div>
      <div class="inline-box line line-x-t">
        <label>结束日期</label>
        <input type="text" placeholder="请选择结束日期" v-mobidate:dateEnd="SchoolWorkApplication.endDate" readonly/>
        <i class="icon-r-jt"></i>
      </div>
      <div class="inline-box line line-x-t">
        <label>乘车人数</label>
        <input type="number" placeholder="输入乘车人数"
               v-model.number="SchoolWorkApplication.passengerNum"/>
      </div>
      <div class="inline-box line line-x-t">
        <label>用车数量</label>
        <input type="number" placeholder="输入用车数量"
               v-model.number="SchoolWorkApplication.vehicleNum"/>
      </div>
      <div class="inline-box line line-x-t">
        <label>上班发车时间</label>
        <input type="text"
               placeholder="请选择上班发车时间"
               v-mobitime:timeStart="SchoolWorkApplication.startTime"
               readonly/>
        <i class="icon-r-jt"></i>
      </div>
      <div class="inline-box line line-x-t">
        <label>下班发车时间</label>
        <input type="text"
               placeholder="请选择下班发车时间"
               v-mobitime:timeEnd="SchoolWorkApplication.endTime"
               readonly/>
        <i class="icon-r-jt"></i>
      </div>

      <div class="inline-box mar-t-20 line line-box radius-box" @click="SchoolWorkApplication.hasBidding = !SchoolWorkApplication.hasBidding">
        <span>是否需要招投标</span>
        <input class="hide" type="checkbox" v-model="SchoolWorkApplication.hasBidding">
        <i class="icon-check"></i>
      </div>

      <div class="base-info">
        <i class="base-icon"></i>备注
      </div>
      <div class="textarea-x line line-box radius-box">
            <textarea class="textarea" placeholder="如需发票，请备注发票抬头" maxlength="200"
                      v-model="SchoolWorkApplication.note"></textarea>
      </div>
      <label class="agree">
        <input class="hide" v-model="chooseState" type="checkbox">
        <i class="icon-check inline"></i>
        我已阅读并同意<a @click.stop="jumpToCharterAgreement">包车协议</a>
      </label>
    </div>
    <input @click="applyBusNext" type="button" class="button button-primary button-no-radius" value="下一步"/>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Mobidate from 'directives/mobiDate'
  import Mobitime from 'directives/mobiTime'
  const now = new Date()

  export default {
    directives:{
      Mobidate,
      Mobitime
    },
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        chooseState:true,  //是否勾选包车协议
        SchoolWorkApplication:{
          productTypeLevelOne:'企业班车',
          aAddress:{
            province: '',
            city: '',
            county: '',
            detailAddress: TOOL.placeHolder.startPlace,
            longitude: 0,
            latitude: 0
          },
          bAddress:{
            province: '',
            city: '',
            county: '',
            detailAddress: TOOL.placeHolder.endPlace,
            longitude: 0,
            latitude: 0
          },
          operateTime:[],
          startDate:'',
          endDate:'',
          passengerNum:'',
          vehicleNum:'',
          startTime:'',
          endTime:'',
          hasInvoice:false,
          hasBidding:false,
          note:''
        },
        dateStart: {
          min: now,
          max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
          yearSuffix:'年',
          daySuffix:'日',
          dateFormat: 'yy-mm-dd'
        },
        dateEnd: {
          min: now,
          max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
          yearSuffix:'年',
          daySuffix:'日',
          dateFormat: 'yy-mm-dd',
        },
        timeStart: {
          timeFormat: 'HH:ii'
        },
        timeEnd: {
          timeFormat: 'HH:ii'
        }
      }
    },
    mounted(){
      if(appStorage.get(this.pageRouter)){
        this.SchoolWorkApplication = JSON.parse(appStorage.get(this.pageRouter))
      }
    },
    methods:{

      /**
       * 切换按钮
       */
      changeStation () {
        let aAddress = this.SchoolWorkApplication.aAddress;
        if(this.SchoolWorkApplication.bAddress.detailAddress != TOOL.placeHolder.endPlace){
          this.SchoolWorkApplication.aAddress = this.SchoolWorkApplication.bAddress
        }else{
          this.SchoolWorkApplication.aAddress = {
            province: '',
            city: '',
            county: '',
            detailAddress: TOOL.placeHolder.startPlace,
            longitude: 0,
            latitude: 0
          }
        }
        if(aAddress.detailAddress != TOOL.placeHolder.startPlace){
          this.SchoolWorkApplication.bAddress = aAddress
        }else{
          this.SchoolWorkApplication.bAddress = {
            province: '',
            city: '',
            county: '',
            detailAddress: TOOL.placeHolder.endPlace,
            longitude: 0,
            latitude: 0
          }
        }
      },

      /**
       * 存储订单到本地数据
       */
      saveForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.SchoolWorkApplication))
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
          name:'bdStation',
          query: {
            fromPage: this.pageRouter,
            dataKey: dataKey
          }
        })
      },

      /**
       * 跳转百度地图选择
       */
      jumpToOperateTime () {
        this.saveForm()
        this.$router.push({
          name:'operateTime',
          query: {
            pageRouter: this.pageRouter
          }
        })
      },

      /**
       * 下一步
       */
      applyBusNext () {
        let validJson = this.SchoolWorkApplication;

        let validata = TOOL.formValidate([
          {value:validJson.aAddress, emptyTips:'出发地不能为空'},
          {value:validJson.bAddress, emptyTips:'目的地不能为空'},
          {value:validJson.operateTime.length, emptyTips:'运行时间不能为空'},
          {value:validJson.startDate, emptyTips:'开始日期不能为空', minDate:validJson.startDate, errorTips:'开始日期必须大于当前日期'},
          {value:validJson.endDate, emptyTips:'结束日期不能为空', minDate:validJson.startDate, errorTips:'结束日期必须大于开始日期'},
          {value:validJson.passengerNum, emptyTips:'乘车人数不能为空', regName:'zsNumber', regTips:'人数必须为大于零的整数'},
          {value:validJson.vehicleNum, emptyTips:'用车数量不能为空', regName:'zsNumber', regTips:'车量数必须为大于零的整数'},
          {value:validJson.startTime, emptyTips:'上班发车时间不能为空'},
          {value:validJson.endTime, emptyTips:'下班发车时间不能为空', minTime:validJson.startTime, errorTips:'下班时间必须大于上班时间'}
        ]);

        if(!validata.valid){
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        let checked = this.chooseState
        if(!checked){
          this.$store.dispatch('showError', '请阅读并接受包车协议');
          return false;
        }

        this.saveForm()
        this.$router.replace({name:'applyNext'})
      }
    }
  }
</script>
