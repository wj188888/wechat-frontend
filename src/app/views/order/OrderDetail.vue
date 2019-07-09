<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="order-status-box">
      <clocker class="clocker" :time="clocker.time" slot="value" @on-finish="finish" v-show="detailData.status === 0 && clocker.timeStatus && detailData.consumeType !== 1">
        <span>%_M1</span>
        <span>%_M2</span>
        <span>:</span>
        <span>%_S1</span>
        <span>%_S2</span>
      </clocker>
      <p class="order-status">
        <span v-if="detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'">
          {{detailData.status | getCityCarpoolOrderStatusText(detailData.carpoolStatus, detailData.consumeType)}}
        </span>

        <span v-else>
          {{detailData.status | getOrderStatusText(detailData.productTypeLevelOne)}}
        </span>
      </p>

      <p class="order-status-tips" v-if="detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'">
        <!-- -1:品牌约车行程中, 0:待支付, 1:已支付, 2:已失效（过了支付时间） 3:已退款 4:未评价 5:已评价 6:已过期（任务已执行但未乘坐）-->
        <!--* 拼车状态 0.未付款 1.未成团，2.未安排，3.已安排，4.已失效（过期未支付），5.已取消（司机或企业超时未响应）-->

        <span v-if="detailData.consumeType === 0 && detailData.status === 0">请在截止时间前完成付款，到期后订单将自动取消</span>

        <span v-if="(detailData.consumeType === 0 && detailData.status === 1 ) ||
        (detailData.consumeType === 1 && (detailData.status === 0 || detailData.status === 1))">
          <span v-if="detailData.carpoolStatus === 0">请在截止时间前完成付款，到期后订单将自动取消</span>
          <span v-if="detailData.carpoolStatus === 1">正在为您安排车辆</span>
          <span v-if="detailData.carpoolStatus === 2">派车成功，请在发车前10分钟到指定站点准备乘车</span>
          <span v-if="detailData.carpoolStatus === 3">车辆已出发，祝您旅途愉快！</span>
        </span>

        <span v-if="detailData.status === 2">订单超时未支付，已为您取消订单</span>
        <span v-if="detailData.status === 3">已成功为您办理退款，车票款将于1-3个工作日内返还到您的账户上</span>
        <span v-if="detailData.status === 4">您的班车已准时出发，请您及时评价</span>
        <span v-if="detailData.status === 5">感谢您的支持，欢迎下次继续乘坐</span>
        <span v-if="detailData.status === 6">您的班车已出发，下次记得准时乘坐哦</span>
        <span v-if="detailData.status === 11">正在申请退款中，请您耐心等待</span>
      </p>
      <p v-else>
        <!-- -1:品牌约车行程中, 0:待支付, 1:已支付, 2:已失效（过了支付时间） 3:已退款 4:未评价 5:已评价 6:已过期（任务已执行但未乘坐）-->
        <!--* 拼车状态 0.未付款 1.未成团，2.未安排，3.已安排，4.已失效（过期未支付），5.已取消（司机或企业超时未响应）-->
        <span v-if="detailData.status === 0">请在截止时间前完成付款，到期后订单将自动取消</span>
        <span v-if="detailData.status === 1">请在发车前10分钟到指定站点准备乘车</span>
        <span v-if="detailData.status === 2">订单超时未支付，已为您取消订单</span>
        <span v-if="detailData.status === 3">已成功为您办理退票，车票款将于1-3个工作日内返还到您的账户上</span>
        <span v-if="detailData.status === 4">您的班车已准时出发，请您及时评价</span>
        <span v-if="detailData.status === 5">感谢您的支持，欢迎下次继续乘坐</span>
        <span v-if="detailData.status === 6">您的班车已出发，下次记得准时乘坐哦</span>
        <span v-if="detailData.status === 11">正在申请退款中，请您耐心等待</span>
      </p>

    </div>
    <div class="order-ticket">
      <order-base-info :data="detailData"></order-base-info>
      <div class="ticket-ewm line line-x mar-t-20"
           v-if="detailData.status !== 0 && detailData.status !== 2 && ticketList && ticketList.length > 0">
        <div class="ewm-pic-box">
          <swiper class="index-swiper" height="26rem" dots-position="center">
            <swiper-item class="swiper-demo-img" v-for="(ticket, index) in ticketList" :key="index">
              <div class="ewm-pic">
                <!--订单状态：0待支付，1已支付，2已失效，3已退款,4未评价，5已评价，6已过期-->
                <!--0未付款, 1未验票, 2已验票, 3已乘坐, 5已退票, 6已失效（未支付，不能支付了）, 7已过期(行程已完成了但未乘坐), 8退款申请中-->
                <div class="ticket-status-tag" :class="{
                  'ticket-status-2': ticket.status === 2,
                  'ticket-status-3': ticket.status === 5,
                  'ticket-status-8': ticket.status === 8,
                  'ticket-status-456': detailData.status === 4 || detailData.status === 6 || detailData.status === 7
                  }"></div>
                <img :class="{'opacity': detailData.status === 2 || detailData.status === 4 || detailData.status === 5 || detailData.status === 6 || ticket.status === 7 || ticket.status === 8}"
                     :src="ticket.ewmPic"/>
              </div>
              <div class="ticket-user" v-if="ticket.passengerName && ticket.passengerTelephone">
                <p><i class="icon-username"></i>{{ticket.passengerName}}</p>
                <p><i class="icon-userphone"></i>{{ticket.passengerTelephone}}</p>
              </div>
            </swiper-item>
          </swiper>
        </div>
      </div>
      <!--<a class="btn-ewm-save" v-if="detailData.status == 1 && detailData.status != 3 ">保存到手机</a>-->
    </div>

    <div class="ticket-info-box" v-if="detailData.status === 1 && ticketList && ticketList.length > 0">
      <h2 class="ticket-h2 ticket-tips-tit" @click="ticketTipsShow = !ticketTipsShow" :class="{'dd-text-active': ticketTipsShow}">
        取票及验票须知<i class="icon-r-jt"></i>
      </h2>
      <div class="ticket-tips line line-x-t" v-show="ticketTipsShow">
        <h3>取票须知</h3>
        <P><span>1、</span>（车站班车）请提前到达乘车车站，找到自主取票机，打印纸质车票，完成取票；</P>
        <P><span>2、</span>（车站班车）如现场自主取票机故障，请联系车站工作人员或到售票柜台出示个人身份证，完成取票；</P>
        <P><span>3、</span>（车站班车）凭打印车票，在发车前10分钟到对应检票口验票上车；（部份车站可用二维码电子票）</P>
        <P><span>4、</span>（其他类型汽车车票）如购买时要求提供纸质发票的，请在上车时主动向当班工作人员索取发票。</P>
        <h3 class="h-2">二维码电子票验票</h3>
        <P><span>1、</span>车站班车以外汽车客运服务，均以二维码电子票为验票标准；</P>
        <P><span>2、</span>请在发车前10分钟，到约定地点向当班工作人员出示二维码电子票。</P>
        <p class="warning-tips">注：更多服务问题，请咨询当班工作人员。</p>
      </div>
    </div>

    <div class="ticket-info-order pad-b-0">
      <p>
        <span class="left-span">订单编号</span>
        <span class="right-span" v-text="detailData.code"></span>
      </p>
      <p>
        <span class="left-span">订单日期</span>
        <span class="right-span" v-text="detailData.createdTime"></span>
      </p>

      <div class="abs-tit-box orange" v-if="detailData.productTypeLevelTwo !== 'LINE_CHARTER_BUS' && detailData.productTypeLevelOne !== 'CUSTOM_BUS' && detailData.productTypeLevelTwo!== 'CITY_CAR_POOL_BUS'">
        <p class="abs-tit">订单价格</p>
        <p class="right-text" v-if="adultNum > 0">
          成人票<span><em>&nbsp;{{detailData.adultPrice | formatPrice}}</em>&nbsp;&times;{{adultNum}}</span>
        </p>
        <p class="right-text" v-if="childNum > 0">
          儿童票<span><em>&nbsp;{{detailData.childPrice | formatPrice}}</em>&nbsp;&times;{{childNum}}</span>
        </p>
      </div>
      <div class="abs-tit-box orange" v-else>
        <p class="abs-tit">订单价格</p>
        <p class="right-text">
          <span>{{orderAmount | formatPrice}}</span>
        </p>
      </div>

      <p v-if="detailData.shuttlePrice > 0">
        <span class="left-span">接送服务</span>
        <span class="right-span">{{ detailData.shuttlePrice | formatPrice }}</span>
      </p>
      <p v-if="insurePrice > 0">
        <span class="left-span">保险服务</span>
        <span class="right-span">
              <em>{{insurePrice | formatPrice}}</em>&nbsp;&times;{{insuranceNum}}
            </span>
      </p>
      <p v-if="detailData.commissionPrice > 0">
        <span class="left-span">服务费用</span>
        <span class="right-span">{{ detailData.commissionPrice | formatPrice }}</span>
      </p>
      <p v-if="detailData.serviceFee > 0">
        <span class="left-span">服务费用</span>
        <span class="right-span">{{ detailData.serviceFee | formatPrice }}</span>
      </p>
      <p v-if="detailData.invoicePrice > 0">
        <span class="left-span">发票费用</span>
        <span class="right-span">{{ detailData.invoicePrice | formatPrice }}</span>
      </p>
      <div class="abs-tit-box orange"
           v-if="detailData.discountInfo && detailData.discountInfo.activityAmount > 0">
        <p class="abs-tit">活动优惠</p>
        <p class="right-text">
          <span>- {{detailData.discountInfo.activityAmount | formatPrice}}</span>
        </p>
      </div>
      <div class="abs-tit-box orange"
           v-if="detailData.discountInfo && detailData.discountInfo.couponAmount > 0">
        <p class="abs-tit">优惠券</p>
        <p class="right-text">
          <span>- {{detailData.discountInfo.couponAmount | formatPrice}}</span>
        </p>
      </div>
      <div class="abs-tit-box orange"
           v-if="detailData.exchangeAmount > 0">
        <p class="abs-tit">{{ detailData.integralType === 1 ? '积分抵现' : '积分兑换'}}</p>
        <p class="right-text">
          <span>- {{detailData.exchangeAmount | formatPrice}}</span>
        </p>
      </div>
      <p class="text-larger orange" v-if="detailData.productTypeLevelOne === 'CUSTOM_BUS' && detailData.depositAmount > 0">
        <span class="left-span orange">已付订金</span>
        <span class="right-span orange">{{ detailData.depositAmount | formatPrice }}</span>
      </p>
      <p class="text-larger" v-if="detailData.payType === 2">
        <span class="left-span orange">预付金额</span>
        <span class="right-span orange">{{ detailData.actualPayment | formatPrice }}</span>
      </p>
      <p class="text-larger" v-if="detailData.payType === 2">
        <span class="left-span" style="width: 20rem;">尾款<em class="gray">(由用户线下交给司机)</em></span>
        <span class="right-span orange">{{ ((detailData.accountPayable - detailData.actualPayment)) | formatPrice }}</span>
      </p>

      <!--加价显示-->
      <p v-if="detailData.addAmountFlag === 1 && detailData.addAmount > 0">
        <span class="left-span">司机调价</span>
        <span class="right-span">{{ detailData.addAmount | formatPrice }}</span>
      </p>

      <p class="text-larger text-price-total line line-x-t">
        <span class="left-span">{{ detailData.consumeType === 1 && detailData.status === 0 ? '待付款' : '实付款'}}</span>
        <span class="right-span orange">{{ detailData.actualPayment | formatPrice }}</span>
      </p>
    </div>

    <div v-if="serviceCarsList && serviceCarsList.length > 0"
         class="dispatch-vehicles ticket-info-order pad-0">
      <swiper class="index-swiper" dots-position="center" height="27rem">
        <swiper-item class="swiper-dispatch" v-for="(serviceCar, index) in serviceCarsList" :key="index">
          <div>
            <p class="mar-t-20">
              <span class="left-span">运输公司</span>
              <span>{{serviceCar.firmName || '-'}}</span>
            </p>
            <span class="orange right-span dispatch-car"
                  v-show="serviceCar.serviceCar"
                  @click="showCarDialog(serviceCar.serviceCar)">调度中</span>
            <p>
              <span class="left-span">车牌号码</span>
              <span v-if="serviceCar.carLicensePlat">
                {{serviceCar.carLicensePlatProvince}}{{serviceCar.carLicensePlat}} {{serviceCar.carLicensePlatType === 1 ? '(蓝)' : '(黄)'}}
              </span>
              <span v-else>-</span>
            </p>
            <p>
              <span class="left-span">用车品牌</span>
              <span>{{serviceCar.carBrand || '-'}}</span>
            </p>
            <p>
              <span class="left-span">用车型号</span>
              <span>{{serviceCar.carModel || '-'}}</span>
            </p>
            <p>
              <span class="left-span">旅客座位</span>
              <span v-if="serviceCar.seats">{{serviceCar.seats}}座</span>
              <span v-else>-</span>
            </p>
            <p>
              <span class="left-span">服务责任人</span>
              <span v-if="serviceCar.responsibleName" @click="callService(serviceCar.responsibleTel, 'driver')">
                <span class="name">{{serviceCar.responsibleName}}</span>
                <span class="tel">{{serviceCar.responsibleTel}}</span>
              </span>
              <span v-else>-</span>
            </p>
            <p>
              <span class="left-span">服务司机</span>
              <span v-if="serviceCar.driverTel" @click="callService(serviceCar.driverTel, 'driver')">
                <span class="name">{{serviceCar.driverFirstName ? `${serviceCar.driverFirstName}师傅` : '匿名'}}</span>
                <span class="tel">{{serviceCar.driverTel}}</span>
              </span>
              <span v-else>-</span>
            </p>
            <p>
              <span class="left-span">随车联系人</span>
              <span v-if="serviceCar.followCarContactName" @click="callService(serviceCar.followCarContactTel, 'driver')">
                <span class="name">{{serviceCar.followCarContactName}}</span>
                <span class="tel">{{serviceCar.followCarContactTel}}</span>
              </span>
              <span v-else>-</span>
            </p>
            <div class="abs-tit-box orange">
              <p class="abs-tit">特别声明</p>
              <p class="right-text special-tips">{{serviceCar.declaration || '-'}}</p>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>

    <x-dialog :show="showDialog" :hide-on-blur="true" @on-hide="showDialog = false" class="dialog-demo">
      <div class="follow-us-dialog ticket-info-order pad-0 mar-b-0">
        <h2 class="dispatch-title line line-x-b">原有车辆</h2>
        <div class="dispatch-vehicles pad-b-50 pad-t-20">
          <p v-if="dialogServiceCar.firmName">
            <span class="left-span">运输公司</span>
            <span class="left-span black-color">{{dialogServiceCar.firmName}}</span>
          </p>
          <p v-if="dialogServiceCar.carLicensePlat">
            <span class="left-span">车牌号码</span>
            <span class="left-span black-color wd-220">
                {{dialogServiceCar.carLicensePlatProvince}}{{dialogServiceCar.carLicensePlat}} <em
              v-text="dialogServiceCar.carLicensePlatType === 1 ? '(蓝)' : '(黄)'"></em>
              </span>
          </p>
          <p v-if="dialogServiceCar.carBrand">
            <span class="left-span">用车品牌</span>
            <span class="left-span black-color">{{dialogServiceCar.carBrand}}</span>
          </p>
          <p v-if="dialogServiceCar.carModel">
            <span class="left-span">用车型号</span>
            <span class="left-span black-color">{{dialogServiceCar.carModel}}</span>
          </p>
          <p v-if="dialogServiceCar.seats">
            <span class="left-span">旅客座位</span>
            <span class="left-span black-color">{{dialogServiceCar.seats}}座</span>
          </p>
          <p v-if="dialogServiceCar.responsibleName">
            <span class="left-span">服务责任人</span>
            <span class="float-l">
                  <span class="name">{{dialogServiceCar.responsibleName}}</span>
                  <span class="tel">{{dialogServiceCar.responsibleTel}}</span>
                </span>
          </p>
          <p v-if="dialogServiceCar.driverTel">
            <span class="left-span">司机</span>
            <span class="float-l">
                <span class="name">{{dialogServiceCar.driverFirstName ? `${dialogServiceCar.driverFirstName}师傅` : '匿名'}}</span>
                <span class="tel">{{dialogServiceCar.driverTel}}</span>
              </span>
          </p>
          <p v-if="dialogServiceCar.followCarContactName">
            <span class="left-span">随车联系人</span>
            <span class="float-l">
                <span class="name">{{dialogServiceCar.followCarContactName}}</span>
                <span class="tel">{{dialogServiceCar.followCarContactTel}}</span>
              </span>
          </p>
          <div class="abs-tit-box orange" v-if="dialogServiceCar.declaration">
            <p class="abs-tit">特别声明</p>
            <p class="right-text special-tips">{{dialogServiceCar.declaration}}</p>
          </div>
        </div>
        <div class="dispatch-bottom line line-x-t" @click="hideCarDialog">关闭</div>
      </div>
    </x-dialog>

    <div class="ticket-info-order pad-0">
      <h2 class="ticket-h2 line line-x-b"
          v-if="detailData.tickets && detailData.tickets.length > 0
              && detailData.productTypeLevelTwo !== 'CITY_SPECIAL_BUS'
              && detailData.productTypeLevelTwo !== 'AIRPORT_SPECIAL_BUS'
              && detailData.productTypeLevelTwo !== 'TRAIN_SPECIAL_BUS'
              && detailData.productTypeLevelOne !== 'CUSTOM_BUS'
              && detailData.productTypeLevelTwo !== 'LINE_CHARTER_BUS'
              &&　detailData.productTypeLevelOne !== 'WORK_BUS'
              && detailData.productTypeLevelOne !== 'SCHOOL_BUS'">
        旅客详情<span>(本订单共{{detailData.ticketNum}}人)</span>
      </h2>
      <div v-if="detailData.tickets && detailData.tickets.length > 0
              && detailData.productTypeLevelTwo !== 'CITY_SPECIAL_BUS'
              && detailData.productTypeLevelTwo !== 'SCHOOL_SPECIAL_BUS'
              && detailData.productTypeLevelTwo !== 'SCENIC_SPECIAL_BUS'
              && detailData.productTypeLevelTwo !== 'AIRPORT_SPECIAL_BUS'
              && detailData.productTypeLevelTwo !== 'TRAIN_SPECIAL_BUS'
              && detailData.productTypeLevelOne !== 'CUSTOM_BUS'
              && detailData.productTypeLevelTwo !== 'LINE_CHARTER_BUS'
              &&　detailData.productTypeLevelOne !== 'WORK_BUS'
              && detailData.productTypeLevelOne !== 'SCHOOL_BUS'">
        <div class="pad-tb-20" v-for="ticket in detailData.tickets">
          <p>
            <span class="left-span">姓名</span>
            <span v-text="ticket.passengerName"></span>
            <span class="tag-age" :class="{'tag-age-child':ticket.ticketType === 1}"
                  v-text="ticket.ticketType === 1 ? '儿童' : '成人'"></span>
            <span class="orange" v-if="ticket.buyInsurance || ticket.carryKid">
                  (<span v-if="ticket.carryKid">携童
                  </span><span v-if="ticket.carryKid && ticket.buyInsurance">、
                  </span><span v-if="ticket.buyInsurance">保险</span>)
                </span>
          </p>
          <p>
            <span class="left-span">证件号</span>
            <span v-text="ticket.passengerIdcard"></span>
          </p>
        </div>
      </div>
      <div class="line-height-100 line line-x"
           v-if="detailData.productTypeLevelOne !== 'WORK_BUS' && detailData.productTypeLevelOne !== 'SCHOOL_BUS'">
        <p v-if="detailData.contactName">
          <span class="left-span">联系人</span>
          <span v-text="detailData.contactName"></span>
        </p>
        <p>
          <span class="left-span">联系电话</span>
          <span v-text="detailData.contactTelephone"></span>
        </p>
      </div>
    </div>

    <div class="ticket-info-order pad-t-0 mar-t-20"
         v-if="detailData.supplyInvoice || detailData.supplyFood || detailData.supplySleep">
      <h2 class="ticket-h2 line line-x-b">其他信息</h2>
      <p v-if="detailData.supplyInvoice" @click="jumpToInvoice">{{detailData.invoice.pickupType == '1' ? '邮寄纸质发票':'自取纸质发票'}}</p>
      <p v-if="detailData.supplyFood">提供司机餐饮</p>
      <p v-if="detailData.supplySleep">提供司机住宿</p>
    </div>

    <div class="ticket-info-order pad-t-0 mar-t-20" v-if="detailData.remark">
      <h2 class="ticket-h2 line line-x-b">旅客留言</h2>
      <p v-text="detailData.remark">需要提供纸质发票</p>
    </div>

    <div v-if="feederData.length">
      <div class="inline-box line line-x-t"
           v-for="feeder in feederData"
           @click="jumpToFeederDetail(feeder)">
        <label class="auto-width" :class="{'icon-feeder-send':feeder.serviceType === 1, 'icon-feeder-pick':feeder.serviceType !== 1}">
          {{feeder.serviceType === 1 ? '送站服务' : '接站服务'}}
      </label>
        <!--0待支付，1已支付， 2已失效（过了支付时间），3已安排，4已退款，5已完成，6退款申请中-->
        <span class="text-right pad-r-20"
              :class="{'text-888': feeder.status === 4 || feeder.status === 6, 'text-ff6600': feeder.status === 3 || feeder.status === 5}"
              v-if="feeder.status === 3 || feeder.status === 4 || feeder.status === 5 || feeder.status === 6">
        {{feeder.status | getFeederStatusText}}
      </span>
        <i class="icon-r-jt"></i>
      </div>
    </div>

    <ticket-notice
      :custom-contents="detailData.customContents"
      :refund-notice-type="refundNotice">
    </ticket-notice>

    <!--未上车前都可以取消订单-->
    <!--订单状态：0待支付，1已支付，2已失效，3已退款,4未评价，5已评价，6已过期-->
    <!--拼车状态 0.待支付 1.待安排，2.已安排，3.已上车，4.已取消 5.已完成-->
    <div class="online-service mar-t-20" v-if="detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS' && detailData.status !== 2 && detailData.status !== 11 && detailData.carpoolStatus < 3">
      <input type="button" class="button button-primary" value="取消订单" @click="cancleOrderAndTicket">
    </div>

    <div class="online-service mar-t-20">
      <input type="button" class="button button-primary" value="联系客服" @click="callService('')">
    </div>

    <div slot="footer">
      <div class="abs-bottom-box line line-x-t"
           v-if="detailData.status === 0 &&
      (detailData.productTypeLevelTwo !== 'CITY_CAR_POOL_BUS' || (detailData.consumeType === 0 && detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS')) ">
        <div class="buy-left clearfix">
          <label>共计</label>
          <span>{{ detailData.actualPayment | formatPrice }}</span>
        </div>
        <div class="buy-right">
          <input type="button" class="button button-primary" @click="payMoney" :disabled="disableBtn" value="立即支付"/>
        </div>
      </div>
      <!--拼车--先付款后出行的支付流程-->
      <div class="abs-bottom-box line line-x-t"
           v-if="detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS' && detailData.carpoolStatus === 2 && detailData.consumeType === 0">
        <div class="buy-left clearfix">
          <label>共计</label>
          <span>{{ detailData.actualPayment | formatPrice }}</span>
        </div>
        <div class="buy-right" v-if="detailData.status !== 11">
          <input v-if="detailData.status === 0" type="button"
                 class="button button-primary" @click="carpoolOrderConfirm" value="立即支付"/>
          <input v-if="detailData.status === 1" type="button" class="button button-primary"
                 @click="carpoolOrderConfirm" value="确认上车"/>
        </div>
      </div>
      <!--拼车--先出行后付款的支付流程-->
      <div class="abs-bottom-box line line-x-t"
           v-if="detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS' && detailData.consumeType === 1 && detailData.status === 0">
        <div class="buy-left clearfix">
          <label>共计</label>
          <span>{{ detailData.actualPayment | formatPrice }}</span>
        </div>
        <div class="buy-right" v-if="detailData.status !== 11">
          <input v-if="detailData.carpoolStatus === 2" type="button" class="button button-primary"
                 @click="carpoolOrderConfirm" value="确认上车"/>
          <input type="button" v-if="detailData.carpoolStatus === 3"
                 class="button button-primary" @click="carpoolOrderConfirm()" value="立即支付"/>
        </div>
      </div>
      <!--<div class="abs-bottom-box  line line-x-t" v-if="detailData.status === 1 && detailData.productTypeLevelTwo !== 'CITY_CAR_POOL_BUS'">-->
      <!--<div class="buy-right buy-w100">-->
      <!--<a class="button button-primary" @click="goTicket()">查看车票</a>-->
      <!--</div>-->
      <!--</div>-->
      
      <div class="abs-bottom-box" v-if="detailData.status === 1 && detailData.tickets.length">
        <div class="buy-left clearfix">
          <input type="button" class="button button-yellow"  @click="goTicket" value="查看车票"/>
        </div>
        <div class="buy-right">
          <input type="button" class="button"
                 :class="isRefund > 0 ? 'button-primary': 'button-gray-lighter'"
                 @click="openRefundTicket" value="退票"/>
        </div>
      </div>
      
      <!--填写退票原因-->
      <div id="tui-clear-over">
        <x-dialog :show="tuiDialog.showDialog" class="dialog-demo">
          <div class="return-title">
            <span>请选择退票原因</span>
            <i class="close" @click="tuiDialog.showDialog = false"></i>
          </div>
          <div class="mar-lr-20 tc-dialog">
            <div class="check-item line line-box radius-box" v-for="data in returnReson">
              <div class="check-box">
                <label>
                  {{data}}
                  <input class="hide" type="radio" :value="data" v-model="returnData.refundReason"/>
                  <i class="icon-com"></i>
                </label>
              </div>
            </div>

            <div class="check-item line line-box radius-box">
              <input type="button" value="确认" @click="retTicket" class="button button-primary return-mg">
            </div>
          </div>
        </x-dialog>
      </div>

      <div class="abs-bottom-box  line line-x-t"
           v-if="detailData.status === 2 || detailData.status === 3 || detailData.status === 5 || detailData.status === 6">
        <div class="buy-right buy-w100">
          <a class="button button-primary" @click="againBuy">重新购买</a>
        </div>
      </div>

      <div class="abs-bottom-box line line-x-t" v-if="detailData.status === 4">
        <div class="buy-right buy-w100">
          <a class="button button-primary" @click="jumpToOederEval">去评价</a>
        </div>
      </div>
      <share-modal :show="showShare" @closeShare="showShare = false"></share-modal>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import OrderBaseInfo from 'appComponents/orderBaseInfo/index'
  import GroupStatus from 'appComponents/groupStatus/index'
  import TicketNotice from 'components/ticketNotice/index'
  import ShareModal from 'appComponents/shareModal/index'
  import { Clocker, Swiper, SwiperItem, XDialog } from 'vux'
  import phone from 'mixins/phone'

  // consumeType消费方式：0.先付款后乘车，1.先乘车后付款
  export default {
    components: {
      MainBox,
      OrderBaseInfo,
      GroupStatus,
      TicketNotice,
      Clocker,
      Swiper,
      SwiperItem,
      XDialog,
      ShareModal
    },
    mixins: [phone],
    data () {
      // 订单状态：0待支付，1已支付，2已失效，3已退款,4未评价，5已评价，6已过期
      return {
        title: this.$route.meta.title,
        orderId: '',
        detailData: {
          aAddress:{},
          bAddress:{},
          tickets:[]
        },
        dispatchVehicles: [],
        ticketList: [], //可用车票列表，拼车为未成团不展示车票
        insurePrice: 0, //保险金额
        insuranceNum: 0, //购买保险数
        adultNum: 0,
        childNum: 0,
//        allowRefund: true, // 是否允许退款
        ticketTipsShow: false, //退票须知
        refundNotice: '', //购票须知
        returnReson: ['车辆故障', '车辆晚点太久', '车辆不符', '多次购票', '其他'],
        countState: false,
        returnData: {
          orderId: '',
          ticketId: '',
          refundReason: ''
        },
        tuiDialog: {
          showDialog: false,
          showSuc: false,
          showFal: false
        },
        clocker: {
          time: TOOL.newGetDate({date: new Date(), type: 'future'}),
          timeStatus: true
        },
        showDialog: false, // 控制弹窗
        dialogServiceCar: '',// 弹窗要显示的服务车辆信息
        showShare: false,
        feederData:[],
        disableBtn: false,
      }
    },
    computed: {
      orderAmount () {
        let commissionPrice = this.detailData.commissionPrice || 0
        let invoicePrice = this.detailData.invoicePrice|| 0
        let addAmount = this.detailData.addAmount|| 0
        return this.detailData.amount - this.insurePrice * this.insuranceNum - commissionPrice - this.detailData.serviceFee - invoicePrice - addAmount
      },
      /**
       * 退票按钮控制
       */
      isRefund () {
        let now = TOOL.newGetDate({type: 'holeDate'})
        let refund = true

        if(this.detailData.productTypeLevelOne === 'STATION_BUS' ||
          this.detailData.productTypeLevelTwo === 'LINE_CAR_POOL_BUS' ||
          this.detailData.productTypeLevelOne === 'CUSTOM_BUS'){
          refund = false
        }
//      && refund
        if(this.detailData.startupTime){
          return TOOL.dateCompare(this.detailData.startupTime, now, 'datetime') > 0
        }
      },

      serviceCarsList () {
        let newObj = Object.assign({},this.detailData)
        if(newObj.serviceCars && newObj.serviceCars.length){
          return newObj.serviceCars
        }else if (newObj.dispatchVehicles && newObj.dispatchVehicles.length){
          return newObj.dispatchVehicles
        }else{
          return []
        }
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.orderId = this.$route.query.orderId;
        this.orderDetailById();
        this.shuttleOrderFindByOrderId();
      },
      /**
       * 查找订单详情
       */
      orderDetailById (type) {
        this.$store.commit('UPDATE_LOADING', true)
        api.orderDetailById({
          orderId: this.orderId
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.detailData = Object.assign(this.detailData, data.resultData);
            console.log(this.detailData);

            this.refundNotice = (this.detailData.productTypeLevelOne === 'LINE_BUS' || this.detailData.productTypeLevelOne === 'CUSTOM_BUS')? 'refundNotice2' : 'refundNotice1'

            this.adultNum = 0
            this.childNum = 0
            this.insuranceNum = 0

            if(data.resultData.tickets){
              for (let i = 0; i < data.resultData.tickets.length; i++) {
                let ticket = data.resultData.tickets[i]

                //用于控制拼车未成团不展示车票
                if (ticket.canUse) {
                  this.ticketList.push(ticket)
                }
                ticket.ewmPic = api.getSrc(ticket.ticketId)
                //取保险价格
                if (i === 0) {
                  this.insurePrice = ticket.insurePrice
                }

                //是否购买保险
                if (ticket.buyInsurance) {
                  this.insuranceNum += 1
                }

                //车票类型 0：成人票 1：儿童票
                if (ticket.ticketType) {
                  this.childNum += 1
                } else {
                  this.adultNum += 1
                }
              }
            }

            if (data.resultData.status === 0) {
              this.clocker.time = data.resultData.paymentInvalidTime
              this.countState = true
            }

            if(this.detailData.addAmountFlag === 1 && this.detailData.addAmount > 0 && this.firstConFun()){
              if(this.firstConFun()){
                this.confirmAddAmount()
              }
            }else{
              if(type && type === 'confirmToBus'){
                this.confirmToBus();
              }else if(type && type === 'payMoney'){
                this.payMoney();
              }
            }

          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

//      checkCanRefundOrder() {
//
//      },

      /**
       * 退票需判断发车时间是否大于当前时间
       * 退票规则：
       * 1.车辆已出发，不能进行退票
       * 2.发车前2小时内退票，收取20%的手续费，发车前大于等于2小时，收取10%的手续费
       */
      openRefundTicket () {
        api.checkCanRefundOrder({orderId: this.detailData.id}).then(res =>{
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          //判断是否已发车
          if(this.isRefund <= 0){
            this.$store.dispatch('showError', '车已出发啦，无法退票')
          }else if(this.isRefund > 0){
            //判断企业后台是否开启不允许线上退票
            if (data.resultCode === '0') {
              //判断是多张票or单张票
              if(this.detailData.tickets.length > 1 && (this.detailData.productTypeLevelOne === 'CITY_BUS' || this.detailData.productTypeLevelOne === 'STATION_BUS')) {
                this.retTicket();
              } else {
                if (this.detailData.productTypeLevelTwo === 'LINE_CAR_POOL_BUS') {
                  this.$store.dispatch('showError', TOOL.LINE_CAR_POOL_BUS + '不支持退票');
                  return
                }
                if (this.detailData.productTypeLevelOne === 'CUSTOM_BUS') {
                  this.$store.dispatch('showError', '不支持线上退款，请与我们的客服人员联系');
                  return
                }
                this.tuiDialog.showDialog = true
              }
            }else {
              if(data.resultCode === '40001') {
                this.$store.dispatch('showAlert', {content: '不支持线上退款，请与我们的客服人员联系',buttonText:'好的'});
              } else {
                this.$store.dispatch('showError', data.resultMsg)
              }
            }
          }
        });

      },

      /**
       * 退票
       * 退票需企业后台审核
       */
      retTicket () {
        let _this = this
        if(this.detailData.tickets.length > 1) {
          appStorage.set('refundMore', JSON.stringify(this.detailData))
          this.$router.push({
            name: 'refundMore',
            query: {
              orderId:this.detailData.id
            }
          });
          return false;
        }
        this.returnData.ticketIds = [];
        this.returnData.orderId = this.detailData.id;
        for(let [index, value] of this.detailData.tickets.entries()) {
          this.returnData.ticketIds.push(value.ticketId)
        }
        this.returnData.ticketIds = this.returnData.ticketIds.join(',');
        this.$store.commit('UPDATE_LOADING', true)
        api.ticketRefundMore(this.returnData).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.tuiDialog.showDialog = false
            this.$store.dispatch('showAlert', {
              title: '退票成功',
              content: '您的车票已退，车票款将于2个工作日内返还到您的账户上',
              buttonText: '好的',
              onHide: ()=> {
                _this.$router.push({
                  name: 'ticketList',
                  query: {
                    productTypeLevelOne: this.detailData.productTypeLevelOne
                  }
                })
              }
            })
          } else {
            this.$store.dispatch('showError', data.resultMsg)
          }
        })
      },

      /**
       * 查询接驳信息
       */
      shuttleOrderFindByOrderId () {
        api.shuttleOrderFindByOrderId(this.orderId).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.feederData = data.resultData || []
          }
        });
      },

      /**
       * 跳转接驳详情
       */
      jumpToFeederDetail (data) {
        this.$router.push({
          name:'feederDetail',
          query:{
            feederId: data.id
          }
        })
      },

      showCarDialog(carData) {
        this.dialogServiceCar = carData;
        this.showDialog = true;
      },

      hideCarDialog() {
        this.showDialog = false;
      },

      finish () {
        this.clocker.timeStatus = false;
        if(this.detailData.productTypeLevelTwo !== 'CITY_CAR_POOL_BUS' && this.detailData.consumeType !== 1){
          api.invalidOrder(this.orderId).then(res => {
            const data = TOOL.toJson(res.data)
            this.$store.commit('UPDATE_LOADING', false)
            if (data.resultCode === '0') {
              this.initialize();
            }
          })
        }
      },

      groupFinish () {
        this.orderDetailById();
      },

      /**
       *  订单支付
       */
      payMoney (){
        this.disableBtn = true
        interfaceApi.wxPay({
          tradeNo: this.orderId,
          productTypeLevelOne: this.detailData.productTypeLevelOne,
          wxPaySuccess: TOOL.wxPaySuccess,
          wxPayFail: TOOL.wxPayFail,
          price: this.detailData.actualPayment
        })
        setTimeout(()=>{
          this.disableBtn = false
        },1000)
      },

      /**
       * 确认上车
       */
      carpoolOrderConfirm () {
        if(this.detailData.consumeType === 0){
          if(this.detailData.carpoolStatus === 3){
            this.confirmToBus()
          }
        }else{
          if(this.detailData.carpoolStatus === 3){
            this.orderDetailById('payMoney')
          }else{
            this.orderDetailById('confirmToBus');
          }

          /*if(this.detailData.status === 1){
           this.confirmToBus()
           }else{
           this.payMoney()
           }*/
        }
      },

      /*
       * 判断是否是第一次弹窗提醒
       * */
      firstConFun () {
        let firstConfirm = true;
        if(appStorage.get('orderCache')){
          for (let x in JSON.parse(appStorage.get('orderCache'))){
            if(x ===  this.orderId){
              firstConfirm = false;
            }
          }
        }
        return firstConfirm;
      },

      /*
       * 确认加价弹窗提示
       * */
      confirmAddAmount () {
        let content = '司机已经标注了您' + this.detailData.addAmountReason + ',为您修改了价格，请在下车前完成支付。';
        this.$store.dispatch('showAlert', {
          title: '司机调价通知',
          buttonText: '知道了',
          content: content,
          onHide: () => {
            if(appStorage.get('orderCache')){
              this.orderCacheObj = JSON.parse(appStorage.get('orderCache'))
            }else{
              this.orderCacheObj = {};
            }
            this.orderCacheObj[this.orderId] = true;
            appStorage.set('orderCache', JSON.stringify(this.orderCacheObj));
          }
        })
      },

      confirmToBus () {
        this.$store.dispatch('showConfirm', {
          title: '温馨提醒',
          content: '是否确定已经上车？',
          onConfirm: () => {
            this.$store.commit('UPDATE_LOADING', true)
            api.carpoolOrderConfirm(this.orderId).then(res => {
              const data = TOOL.toJson(res.data)
              this.$store.commit('UPDATE_LOADING', false)
              if (data.resultCode === '0') {
                this.$store.dispatch('showSuccess', '您已确认上车')
                this.orderDetailById();
              } else {
                this.$store.dispatch('showError', data.resultMsg);
              }
            })
          },
          onCancel: () => {
          }
        })
      },

      /**
       *  取消订单
       */
      cancleOrderAndTicket () {
        if(this.detailData.status != 1) {
          this.$store.dispatch('showConfirm', {
            title: '温馨提醒',
            content: '是否确定要取消订单？',
            onConfirm: () => {
              this.$store.commit('UPDATE_LOADING', true)
              if(this.detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'){
                api.carpoolOrderCancel(this.orderId).then(res => {
                  const data = TOOL.toJson(res.data)
                  this.$store.commit('UPDATE_LOADING', false)
                  if (data.resultCode === '0') {
                    this.$store.dispatch('showSuccess', '取消订单成功')
                    this.orderDetailById();
                  } else {
                    this.$store.dispatch('showError', data.resultMsg);
                  }
                })
              }else{
                api.cancleOrderAndTicket(this.orderId).then(res => {
                  const data = TOOL.toJson(res.data)
                  this.$store.commit('UPDATE_LOADING', false)
                  if (data.resultCode === '0') {
                    this.$store.dispatch('showSuccess', '取消订单成功')
                    this.orderDetailById();
                  } else {
                    this.$store.dispatch('showError', data.resultMsg);
                  }
                })
              }

            },
            onCancel: () => {
            }
          })
        } else {
          api.carpoolCancelCharge(this.orderId).then(res => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {
              let refundCharge = data.resultData;
              let refundTip = `取消订单要扣取<span style="color:#f60;">${refundCharge}元</span>的手续费，是否确定要取消订单`;
              if(refundCharge>0) {
                this.$store.dispatch('showConfirm', {
                  title: '温馨提醒',
                  content: refundTip,
                  onConfirm: () => {
                    this.$store.commit('UPDATE_LOADING', true)
                    if(this.detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'){
                      api.carpoolOrderCancel(this.orderId).then(res => {
                        const data = TOOL.toJson(res.data)
                        this.$store.commit('UPDATE_LOADING', false)
                        if (data.resultCode === '0') {
                          this.$store.dispatch('showSuccess', '取消订单成功')
                          this.orderDetailById();
                        } else {
                          this.$store.dispatch('showError', data.resultMsg);
                        }
                      })
                    }else{
                      api.cancleOrderAndTicket(this.orderId).then(res => {
                        const data = TOOL.toJson(res.data)
                        this.$store.commit('UPDATE_LOADING', false)
                        if (data.resultCode === '0') {
                          this.$store.dispatch('showSuccess', '取消订单成功')
                          this.orderDetailById();
                        } else {
                          this.$store.dispatch('showError', data.resultMsg);
                        }
                      })
                    }

                  },
                  onCancel: () => {
                  }
                });
              } else {
                this.$store.commit('UPDATE_LOADING', true)
                if(this.detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'){
                  api.carpoolOrderCancel(this.orderId).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                      this.$store.dispatch('showSuccess', '取消订单成功')
                      this.orderDetailById();
                    } else {
                      this.$store.dispatch('showError', data.resultMsg);
                    }
                  })
                }else{
                  api.cancleOrderAndTicket(this.orderId).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                      this.$store.dispatch('showSuccess', '取消订单成功')
                      this.orderDetailById();
                    } else {
                      this.$store.dispatch('showError', data.resultMsg);
                    }
                  })
                }
              }

            } else {
              this.$store.dispatch('showError', data.resultMsg);
            }
          })
        }
      },

      /**
       *  订单查看线路详情跳转到对应的车票页面
       *  如只有一张票则跳转至车票详情页面
       */
      goTicket () {
        if(this.detailData.tickets && this.detailData.tickets.length === 1){
          this.$router.push({
            name: 'ticketDetail',
            query: {
              ticketId: this.detailData.tickets[0].ticketId
            }
          });
        }else{
          let productTypeLevelOne = this.detailData.productTypeLevelOne
          if (productTypeLevelOne === 'LINE_BUS') {
            productTypeLevelOne = 'CUSTOM_BUS'
          }
          this.$router.push({
            name: 'ticketList',
            query: {
              productTypeLevelOne: productTypeLevelOne,
              orderId:this.detailData.id,
              ticketType: 'own'
            }
          });
        }
      },

      /**
       * 再次购买
       */
      getSearchKey (address) {
        if(address.county) {
          if(address.town){
            return address.county + '('+ address.town +')'
          }else{
            return address.county
          }
        }
        return address.city
      },

      againBuy () {
        let routeName
        let type = this.detailData.productTypeLevelOne
        let queryData = {
          startPlace: this.getSearchKey(this.detailData.aAddress),
          endPlace: this.getSearchKey(this.detailData.bAddress),
          startTime: TOOL.newGetDate({type: 'holeDate'})
        }
        switch (type) {
          case 'CITY_BUS':
          case 'STATION_BUS':
            if(this.detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'){
              if(appStorage.get('indexRouter') === 'carpoolbusMap'){
                routeName = 'carpoolbusMap'
              }else{
                routeName = 'list'
              }
            }else{
              routeName = 'list'
            }
            break;
          case 'AIRPORT_BUS':
            if (this.detailData.airportType === 0) {
              routeName = 'airportPickList'
            } else {
              routeName = 'airportSendList'
            }
            break;
          case 'TRAIN_STATION_BUS':
            if (this.detailData.shuttleType === 0) {
              routeName = 'trainPickList'
              queryData.startPlace = this.detailData.aAddress.detailAddress
              queryData.endPlace = this.detailData.bAddress.searchShowAddress
            } else {
              routeName = 'trainSendList'
              queryData.startPlace = this.detailData.aAddress.searchShowAddress
              queryData.endPlace = this.detailData.bAddress.detailAddress
            }
            break;
          case 'SCENIC_BUS':
            routeName = 'scenicList'
            break;
          case 'SCHOOL_BUS':
            routeName = 'schoolList'
            break;
          case 'TOUR_BUS':
            routeName = 'sights'
            break;
          case 'WORK_BUS':
            routeName = 'workList'
            queryData = {
              onStation: JSON.stringify(this.detailData.onStation),
              offStation: JSON.stringify(this.detailData.offStation)
            }
            break;
          case 'CUSTOM_BUS':
            routeName = 'charterList'
            queryData = {}
            break;
          case 'LINE_BUS':
            routeName = 'carpoolingList'
            queryData = {productId: this.detailData.productId}
            break;
        }
        this.$router.push({
          name: routeName,
          query: queryData
        });
      },

      // 跳转到发票页面
      jumpToInvoice() {
        this.$router.push({
          name: 'invoice',
          query: {
            edit: 0
          }
        })
      },

      /**
       * 跳转评价
       */
      jumpToOederEval () {
        if (this.detailData.productTypeLevelOne === 'CUSTOM_BUS') {
          this.$store.dispatch('showError', TOOL.CUSTOM_BUS + '不支持评价')
          return
        }
        this.$router.push({
          name:'orderEval',
          query: {
            orderId: this.detailData.id,
            productTypeLevelOne: this.detailData.productTypeLevelOne
          }
        })
      }
    }

  }
</script>
<style lang="less" scoped>
  .order-status-box {
    position: relative;
    height: 170px;
    margin-bottom: 20px;
    padding: 20px;
    background-color: #ff9900;
    color: #fff;
    .order-status {
      margin: 22px 0 28px;
      font-size: 36px;
    }
    .order-status-tips {
      font-size: 24px;
      line-height: 1.414;
    }
    .clocker{
      position:absolute;
      right:20px;
      top:42px;
      font-size:28px;
    }
  }

  .order-ticket {
    margin-bottom: 20px;
    overflow: hidden;
  }

  .ewm-pic-box {
    height: 520px;
    background-color: #fff;
    .ewm-pic {
      position: relative;
      width: 100%;
      height: 312px;
      margin-top: 140px;
      text-align: center;
      .ticket-status-tag {
        position: absolute;
        top: -20px;
        left: 50%;
        width: 168px;
        height: 135px;
        background: no-repeat center center;
        background-size: 168px 135px;
        z-index: 1;
      }
      .ticket-status-2 {
        background-image: url("../../../assets/ticket_2.png");
      }
      .ticket-status-3 {
        background-image: url("../../../assets/ticket_3.png");
      }
      .ticket-status-456 {
        background-image: url("../../../assets/ticket_456.png");
      }
      .ticket-status-8 {
        background-image: url("../../../assets/ticket_8.png");
      }
      img {
        width: 260px;
        height: 260px;
        &.opacity {
          opacity: 0.3;
        }
      }
    }

    .ticket-user {
      position: absolute;
      left: 0;
      bottom: 32px;
      width: 100%;
      display: flex;
      text-align: center;
      font-size: 26px;
      color: #b2b2b2;
      p {
        flex: 1;
        height: 34px;
        line-height: 34px;
      }
      i {
        display: inline-block;
        vertical-align: bottom;
      }
      .icon-username {
        width: 40px;
        height: 34px;
        background: url('../../../assets/user.png') no-repeat 0 center;
        background-size: 27px 31px;
      }
      .icon-userphone {
        width: 32px;
        height: 34px;
        background: url('../../../assets/phone.png') no-repeat 0 center;
        background-size: 19px 31px;
      }
    }
  }

  .btn-ewm-save {
    display: block;
    height: 80px;
    line-height: 80px;
    font-size: 28px;
    color: #272a35;
    text-align: center;
  }

  .ticket-info-box {
    margin-bottom: 20px;
    background-color: #fff;
  }

  .ticket-h2 {
    height: 86px;
    line-height: 86px;
    padding: 0 20px;
    font-size: 28px;
    color: #272a35;
    font-weight: normal;
    &.ticket-tips-tit {
      position: relative;
      padding-left: 77px;
      background: url('../../../assets/ticket_tips.png') no-repeat 20px center;
      background-size: 37px 37px;
      i:after {
        right: 20px;
      }
    }
    span {
      margin-left:5px;
      color: #999;
      font-size: 24px;
    }
  }

  .ticket-tips {
    padding: 0 20px 60px;
    overflow: hidden;
    h3 {
      margin: 30px 0 26px;
      font-size: 26px;
      color: #272a35;
    }
    .h-2 {
      margin-top: 60px;
    }
    p {
      position: relative;
      padding-left: 40px;
      margin-bottom: 20px;
      line-height: 1.414;
      font-size: 26px;
      color: #6b6c70;
    }
    span {
      position: absolute;
      left: 0;
      top: 0;
    }
    .warning-tips {
      padding-left: 0;
      color: #ff6600;
    }
  }

  .ticket-info-order {
    padding: 28px 0;
    margin-bottom: 20px;
    background-color: #fff;
    p {
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
      margin-top: 20px;
      font-size: 26px;
      color: #272a35;
      &:first-child {
        margin-top: 0;
      }
    }
    .left-span {
      float: left;
      width: 160px;
      height: 30px;
      color: #999;
    }
    .right-span {
      float: right;
      height: 30px;
      color: #999;
      em {
        color: #272a35;
      }
    }
    .name {
      display: inline-block;
      min-width: 140px;
    }
    .tel {
      display: inline-block;
      padding-left: 20px;
      margin-left: 16px;
      background: url('../../../assets/phone-blue.png') no-repeat 0 center;
      background-size: 15px 24px;
      color:#2772CC;
    }
    .text-larger .left-span,
    .text-larger .right-span {
      font-size: 30px;
      color: #272a35;
    }
    .text-larger .gray {
      color: #999;
    }
    .text-price-total {
      height: 88px;
      line-height: 88px;
      .left-span,
      .right-span {
        height: 88px;
      }
    }
    .abs-tit-box {
      position: relative;
      color: #999;
      .abs-tit {
        position: absolute;
        left: 0;
        top: 0;
        height: 30px;
        color: #999;
      }
      .right-text {
        height: 30px;
        color: #999;
        text-align: right;
      }
      .special-tips {
        margin-left: 180px;
        padding-left: 0;
        height: auto;
        text-align: left;
        color: #272a35;
      }
      .right-text span {
        display: inline-block;
      }
      .right-text em {
        height: 30px;
        color: #272a35;
      }
    }
  }
  .line-height-100 p{
    height:100px;
    line-height:100px;
  }

  .tag-age {
    display: inline-block;
    margin-left: 20px;
    line-height: 1;
    padding: 4px 8px;
    background-color: #FF9900;
    color: #fff;
    font-size: 20px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    vertical-align: top;
    &.tag-age-child {
      background-color: #2772CC;
    }
  }
  .orange {
    color: #ff6600 !important;
  }
  .abs-bottom-box{
    .order-tips{
      float:left;
      line-height:96px;
      padding-left:20px;
      font-size:24px;
      color:#4c4c4c;
    }
    .price{
      font-size:28px;
      span{
        font-size: 30px;
        color: #ff6600;
      }
    }
    .icon-tips{
      padding-left:60px;
      background:url("../../../assets/i.png") no-repeat 20px center;
      background-size:30px 30px;
    }
    .button-small{
      float:right;
      margin-right:20px;
      margin-top:23px;
      font-size: 28px;
      width: auto;
      padding:0 20px;
      height: 50px !important;
      line-height: 50px
    }
  }

  .swiper-dispatch {
    padding-top: 50px;
  }
  .dispatch-vehicles {
    span {
      text-align: left !important;
    }
  }
  .dispatch-car {
    position: absolute;
    right: 20px;
    top: 70px;

    font-size: 28px;
    padding-right: 28px;
    background: url("../../../assets/charter/gantan.png") no-repeat right top;
    background-size: 24px 24px;
  }
  .dispatch-hide {
    display: none;
  }
  .dispatch-title {
    width: 100%;
    height: 80px;
    line-height: 80px;
    padding-left: 20px;

    text-align: left;
    font-size: 28px;
  }
  .dispatch-bottom {
    width: 100%;
    height: 80px;
    line-height: 80px;

    text-align: center;
    font-size: 28px;
  }
  .pad-0 {
    padding: 0 !important;
  }
  .pad-t-20 {
    padding-top: 20px !important;
  }
  .pad-b-50 {
    padding-bottom: 50px !important;
  }
  .mar-b-0 {
    margin-bottom: 0 !important;
  }
  .black-color {
    color: #272a35 !important;
  }
  .txt-left {
    text-align: left !important;
  }
  .float-l {
    float: left !important;
  }
  .wd-220 {
    width: 220px !important;
  }
  .icon-feeder-send{
    padding-left:36px;
    background:url("../../../assets/icon-feeder-send.png") no-repeat 0 center;
    background-size:26px 26px;
  }
  .icon-feeder-pick{
    padding-left:36px;
    background:url("../../../assets/icon-feeder-pick.png") no-repeat 0 center;
    background-size:26px 26px;
  }
  .text-888{
    color:#888;
    padding-right:20px;
  }
  .text-ff6600{
    color:#ff6600;
    padding-right:20px;
  }
  .online-service {
    padding: 0 20px;
    input {
      height: 80px;
      background-color: #fff;
      font-size: 28px;
      color: #4c4c4c;
      border-color: #e5e5e5;
    }
  }
  .button-gray-one{
    background: #8e8e8e;
    border: none;
  }
  .pull-left{
    float: left;
  }
  .width-500{
    width: 500px;
  }
  .display-flex{
    display: flex;
  }
  .border{
    border: 1PX solid #e5e5e5;
  }
</style>
