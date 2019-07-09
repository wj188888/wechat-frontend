import baseAndTheme from './baseAndTheme'
import network from './network'
import trip from './trip'

import bus from './product/bus'
import city from './product/city'
import airport from './product/airport'
import trainstation from './product/trainstation'
import scenic from './product/scenic'
import school from './product/school'

import work from './product/work'

import lineBus from './product/lineBus'
import charter from './product/charter'
import tour from './product/tour'
import carhailingAndTaxi from './product/carhailingAndTaxi'

import rent from './product/rent'
import inspection from './product/inspection'
import shop from './product/shop'
import express from './product/express'

import my from './my/my'
import accountSecurity from './my/accountSecurity'
import coupon from './my/coupon'
import score from './my/score'
import invoice from './my/invoice'
import vipCard from './my/vipCard'

import feeder from './feeder'
import order from './order'
import ticket from './ticket'
import driverAndCar from './driverAndCar'
import commonPages from './commonPages'
import agreement from './agreement'

import market from './market'


let routers = []
let routerArr = [
  baseAndTheme,
  network,
  trip,
  
  my,
  accountSecurity,
  coupon,
  score,
  invoice,
  vipCard,
  
  bus,
  city,
  airport,
  trainstation,
  scenic,
  school,
  work,
  lineBus,
  charter,
  tour,
  carhailingAndTaxi,
  rent,
  inspection,
  shop,
  express,
  
  feeder,
  order,
  ticket,
  driverAndCar,
  commonPages,
  agreement,
  market,
]
for (let i = 0; i < routerArr.length; i++){
  routers = routers.concat(routerArr[i])
}
export default routers