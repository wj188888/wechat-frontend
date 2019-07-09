<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="rsp-box">
      <h1>《包车协议》</h1>
      <p class="special-tip">
        &nbsp;&nbsp;&nbsp;&nbsp;
        尊敬的用户，欢迎您使用定制包车服务。本服务协议双方为包车提供方与平台用户，
        本服务协议具有合同效力.在订购包车服务前，请仔细阅读协议内容。
      </p>
      <article>
        <h2>一、甲乙双方责任</h2>
        <p>
          1. 甲方责任：
          <span>A. 甲方保证提供证件齐全的车辆，并对所包车辆的司机进行统一管理，提供优质服务;司机应保证有公安部门颁发的驾驶执照，符合准驾型号。</span>
          <span>B. 甲方应在出车前进行检查保证车辆处于良好的状态，保持车容整洁。</span>
          <span>C. 包车期间发生的车辆维修费用由甲方承担，且甲方不得无故中途撤回所出包车辆，如撤回应当承担弃置期间甲方支出的食宿和其他必要费用，退还全部包车费用作为违约金。</span>
          <span>D. 甲方车辆应具备第三者保险，若甲方司机驾驶车辆途中发生交通事故或车辆故障，此与乙方无关，甲方须自行解决，并调配相同车型继续为乙方提供服务，对乙方车上的人和物所造成的经济损失，由甲方承担。</span>
          <span>E. 甲方车辆司机要积极配合乙方旅游行程安排，遵守旅游各项制度，相互团结，不得酗酒打闹，保证做好服务接待工作，对客人要热情服务，保证安全行驶。</span>
          <span>F. 行车途中司机要遵守交通规则，否则引起的乘客和财物的损失由甲方负责。</span>
          <span>G. 如车辆不能通过的路段甲方应予早通知乙方(如遇到自然灾害、政府修路及其他特殊原因等另议)。</span>
        </p>
        <p>
          2. 乙方责任：
          <span>A. 在出发后乙方应合理调配车辆，确保车辆在安全及可能行驶的路段行驶，避免司机疲劳驾驶。</span>
          <span>B. 甲方不允许乙方任何人员擅自驾驶甲方车辆，如因此造成责任事故及经济损失乙方承担一切责任及后果。</span>
        </p>
      </article>
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
        title: this.$route.meta.title
      }
    }
  }
</script>
