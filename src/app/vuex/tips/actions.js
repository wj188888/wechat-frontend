import Vue from 'vue'
import { ToastPlugin, AlertPlugin, ConfirmPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)

export default {
  showError ({ commit, state }, msg) {
    if (!msg) return
    Vue.$vux.toast.show({
      type: 'text',
      width: 'auto',
      text: msg
    });
  },

  showSuccess ({ commit, state }, msg) {
    Vue.$vux.toast.show({
      type: 'success',
      width: '7.6em',
      text: msg
    });
  },

  /**
   * title: 标题；content：内容；onShow：显示回调；onHide：隐藏回调；
   * @param commit
   * @param state
   * @param obj
   */
  showAlert ({ commit, state }, obj) {
    obj.title = obj.title || '提示'
    obj.buttonText = obj.buttonText || '确定'
    Vue.$vux.alert.show(obj)
  },

  /**
   * obj:{title: 标题；content：内容；onShow：显示回调；onHide：隐藏回调；confirmText：确定文字；cancelText：取消文字；onConfirm：确定回调}；
   * @param commit
   * @param state
   * @param obj
   */
  showConfirm ({ commit, state }, obj) {
    obj.title = obj.title || '提示'
    obj.confirmText = obj.confirmText || '确定'
    obj.cancelText = obj.cancelText || '取消'
    Vue.$vux.confirm.show(obj)
  }
}
