import cityMutations from './mutations'
import cityActions from './actions'

export  default {
  state: {
    appCity: '定位中...',
    appAddress: '',
  },
  mutations: cityMutations,
  actions: cityActions
}