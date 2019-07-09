export default {
  methods: {
    getRow (item, col) {
      let total = item.length

      //空格子数量
      let emptyNum
      if(total % col){
        emptyNum = col - total % col
      }
      if(emptyNum){
        for(let i = 0; i < emptyNum; i++){
          item.push('')
        }
      }

      //显示几行
      let row = total / col
      let menuResult = []
      for (let i = 0; i < row; i++){
        menuResult.push(item.slice(i * col, i * col + col))
      }
      return menuResult
    },

    goPage (menu) {
      if(this.type === 'header'){
        this.$emit('setShowNav')
      }
      if(typeof menu.target ==='string' && (menu.target.indexOf('http') > -1 || menu.target.indexOf('https') > -1)){
        window.location.href = menu.target
        return
      }
      if(!menu.cos){
        this.$router.push(menu.target)
      }else{
        if(menu.targetProductId){
          let type = menu.targetProductType
          if (type === 'TOUR_BUS') {
            this.$router.push({
              name: 'productDetail',
              query: {
                id: menu.targetProductId
              }
            })
          } else if (type === 'LINE_BUS') {
            this.$router.push({
              name: 'carpoolingList',
              query: {
                productId: menu.targetProductId
              }
            })
          }else{
            let routers = {
              'CITY_BUS': 'city',
              'STATION_BUS': 'city',
              'AIRPORT_BUS': 'airportPickSearch',
              'TRAIN_STATION_BUS': 'trainPickSearch',
              'SCHOOL_BUS': 'schoolSearch',
              'SCENIC_BUS': 'scenicSearch',
              'TOUR_BUS': 'sights',
              'WORK_BUS': 'work',
              'LINE_BUS': 'lineCar',
              'CUSTOM_BUS': 'charterList',
              'CAR_HAILING': 'carHailingSearch',
              'TAXI': 'taxiSearch',
              'CAR_INSPECTION': 'createInsp'
            }
            this.$router.push({
              name: routers[type]
            })
          }
        }else{
          window.location.href = menu.target
        }
      }
    },
  }
}
