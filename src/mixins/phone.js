export default {
  methods: {
    callService (phoneNumber, type) {
      let phoneNum = phoneNumber || appStorage.get('serviceTel') || TOOL.phoneNumber
      if(!phoneNum) {
        return
      }
      if(TOOL.browser().undunion_app){
        JsWebviewInterface.callPhone(phoneNum)
        return
      }
      let content = '客服电话：<br/>' + phoneNum
      if(type === 'driver'){
        content = '确定拨打电话：<br/>'+ phoneNum + '吗？'
      }
      if(TOOL.browser().ios){
        window.location.href = 'tel:' + phoneNum
      }else{
        this.$store.dispatch('showConfirm', {
          title: ' ',
          confirmText: '拨打',
          content: '<p style="text-align:center;font-weight:400;font-size: 17px;color:#000">' + content + '</p>',
          onConfirm: () => {
            window.location.href = 'tel:' + phoneNum
          }
        });
      }
    }
  }
}
