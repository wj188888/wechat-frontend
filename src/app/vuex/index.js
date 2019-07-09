import Vue from 'vue'
import Vuex from 'vuex'
import LoadingMutations from './loading/mutations'
import CarpoolPriceDialogMutations from './carpoolPriceDialog/mutations'
import CouponDialogMutations from './couponDialog/mutations'
import city from './city/index'
import tipsActions from './tips/actions'
import showFollowUs from './showFollowUs/mutations'
import marketSettingMut from './marketSetting/mutations'

Vue.use(Vuex);

const loading = {
	state: {
    showLoading: false,
    text: '',
	},
	mutations: LoadingMutations
}

const couponDialog = {
  state: {
    showCouponDialog: false,
    couponDatas: {},
  },
  mutations: CouponDialogMutations
}

const carpoolPriceDialog = {
  state: {
    showCarpoolPriceDialog: false,
    carpoolPriceDatas: {},
  },
  mutations: CarpoolPriceDialogMutations
}

const tips = {
  actions: tipsActions
}

const followUs = {
  state: {
    showFollowUs: false,
  },
  mutations: showFollowUs
}

const marketSetting = {
  state: {
    showFixMarket: false,
    showShareUrl: false,
    marketSettingData: {},
  },
  mutations: marketSettingMut
}

export default new Vuex.Store({
 	modules: {
 		loading,
    couponDialog,
    carpoolPriceDialog,
 		city,
    tips,
    followUs,
    marketSetting,
 	}
})

