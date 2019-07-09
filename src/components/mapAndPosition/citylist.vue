<template>
    <div class="citylist">
        <div class="split"></div>
        <div class="list-wrapper">
            <citylistview
                    v-show="!showMatch"
                    :is-from="isFrom"
                    :data="cityData"
                    @select="selectItem">
            </citylistview>
            <div class="matchlist" v-show="showMatch" ref="match">
                <ul v-show="matchList.length">
                    <li class="list-item"
                        v-for="item in matchList"
                        @touchstart="addActiveCls"
                        @touchend="removeActiveCls"
                        @click="selectItem(item)">
                      {{item.name}}<span class="pc" v-if="item.value.province">{{item.value.province + ' - ' + item.value.city}}</span>
                    </li>
                </ul>
                <div class="noresult" v-show="!matchList.length">
                    <div class="warning">
                        <div class="warning-icon"><span class="mfic-important"></span></div>
                    </div>
                    <div class="desc">暂无结果</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import Citylistview from 'components/mapAndPosition/citylistview'
  import BScroll from 'better-scroll'

  export default {
    components:{
      Citylistview
    },
    props:{
      isFrom:true,
      cityList: {
        type: Array,
        default () {
          return []
        }
      },
    },
    data () {
      return {
        showMatch: false,
        matchList: [],
        noResultDesc: "暂无结果"
      }
    },
    computed: {
      cityData () {
        let t = [];
        this.cityList.forEach(function (e) {
          let i = {};
          i.name = e.name
          i.items = []
          e.cities.forEach(function (t) {
            let e = {};
            e.name = t.name
            e.value = t
            i.items.push(e)
          })
          t.push(i)
        })
        return t
      }
    },
    methods: {
      selectItem (city) {
        this.$emit('citySelect', city)
      },

      async match (keyword, pageName, isFrom) {
        this.showMatch = '' !== keyword
        if ('' !== keyword) {
          this.matchList = [];
          if(pageName === 'building' && isFrom){
            let fetchData = await this.citiesTemplateByKeyword(keyword)
            console.log(fetchData)
            if(fetchData.resultCode === '0'){
              let fetchList = fetchData.resultData
              for (let i in fetchList){
                let cityValue = {
                  name: fetchList[i].name,
                  value: fetchList[i]
                }
                this.matchList.push(cityValue)
              }
            }
          }else{
            this.staticData(keyword)
          }
          this.$nextTick(() => {
            if(this.matchScroll){
              this.matchScroll.refresh()
            }else{
              this.matchScroll = new BScroll(this.$refs.match, {
                click: true
              })
              this.matchScroll.on('beforeScrollStart', () => {
                this.$emit('beforeScrollStart')
              })
            }
            this.matchScroll.scrollTo(0, 0)
          })
        }
      },
      
      staticData (keyword) {
        let i = '^' + TOOL.pregQuote(keyword),
            n = new RegExp(i, 'i');
        this.cityList.forEach( (value, key) => {
          if(value.name !== '★热门城市'){
            value.cities.forEach( (val) => {
              if(val.tags){
                let tag = val.tags.split(',');
                if(n.test(tag[0]) || n.test(tag[1])){
                  let city = {};
                  city.name = val.name
                  city.value = val
                  this.matchList.push(city)
                }
              }else{
                if(n.test(val.name) || n.test(val.pinYin) || n.test(val.firstLetter)){
                  let city = {};
                  city.name = val.name
                  city.value = val
                  this.matchList.push(city)
                }
              }
            })
          }
        })
      },
      
      citiesTemplateByKeyword (keyword) {
        return api.citiesTemplateByKeyword('CITY_BUS', 'CITY_CAR_POOL_BUS', keyword).then(res=>{
          return Promise.resolve(res.data);
        })
      },
      
      addActiveCls (t) {
        $(t.target).addClass('active')
      },
      
      removeActiveCls (t) {
        $(t.target).removeClass('active')
      }
      
    }
  }
</script>
<style>
    .suggestlist {
        width: 100%;
        height: 100%
    }

    .suggestlist .split {
        position: relative;
        z-index: 10;
        width: 100%;
        height: 10PX;
        background: #f3f4f5
    }

    .suggestlist .list-wrapper {
        width: 95%;
        height: 100%;
        margin: 0 auto;
        border-radius: 2PX;
        background: #fff;
        box-shadow: 0 1PX 3PX rgba(0,0,0,.1)
    }

    .suggestlist .list-wrapper .sugerror {
        text-align: center;
        height: 50PX;
    }

    .suggestlist .list-wrapper .sugerror .title {
        padding: 10PX 0 4PX;
        font-size: 14PX;
        color: #333
    }

    .suggestlist .list-wrapper .sugerror .desc {
        font-size: 12PX;
        color: #999
    }

    .suggestlist .list-wrapper .list-item {
        padding: 0 16PX;
    }

    .suggestlist .list-wrapper .list-item:last-child:after,.suggestlist .list-wrapper .list-item:last-child:before {
        display: none
    }

    .suggestlist .list-wrapper .list-item.active {
        background: rgba(0,0,0,.04)
    }

    .suggestlist .list-wrapper .list-item.special .item-wrapper .icon {
        color: #fc9153
    }

    .suggestlist .list-wrapper .list-item.special .item-wrapper .icon .mfic-click {
        font-size: 16PX;
        color: #999
    }

    .suggestlist .list-wrapper .list-item.special .item-wrapper .address-wrapper {
        height: 50PX;
    }

    .suggestlist .list-wrapper .list-item.special .item-wrapper .address-wrapper .address-info .displayname {
        color: #fc9153
    }

    .suggestlist .list-wrapper .list-item .item-wrapper {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        font-size: 0
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .icon {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 22PX;
        flex: 0 0 22PX;
        width: 22PX;
        color: #999;
        font-size: 12PX;
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .address-wrapper {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        overflow: hidden;
        height: 60PX;
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .address-wrapper .address-info {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 20PX;
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .address-wrapper .address-info.noaddress {
        margin-top: 6PX;
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .address-wrapper .address-info .displayname {
        display: inline-block;
        vertical-align: top;
        font-size: 14PX;
        color: #333
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .address-wrapper .address-info .recommend {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -3PX;
        margin-left: 6PX;
        padding: 4PX 6PX;
        border-radius: 2PX;
        font-size: 12PX;
        color: #fff;
        -webkit-transform: scale(.8);
        transform: scale(.8);
        -webkit-transform-origin: left center;
        transform-origin: left center
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .address-wrapper .address-info .recommend.recommend {
        background-color: #3cbca3
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .address-wrapper .address-info .recommend.current {
        background-color: #3ca0e6
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .address-wrapper .address {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12PX;
        color: #999
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .distance-info {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 48PX;
        flex: 0 0 48PX;
        width: 48PX;
        margin-top: -14PX;
        text-align: right
    }

    .suggestlist .list-wrapper .list-item .item-wrapper .distance-info .distance {
        font-size: 12PX;
        color: #999
    }

    .suggestlist .list-wrapper .list-item .subpoi-wrapper {
        padding-bottom: 16PX;
    }

    .noresult .warning {
        padding: 120PX 0 16PX;
    }

    .noresult .warning .warning-icon {
        width: 50PX;
        height: 50PX;
        margin: 0 auto;
        border-radius: 50%;
        background: #4a4c5b
    }

    .noresult .warning .warning-icon .mfic-important {
        display: inline-block;
        margin: -7PX 0 0 -7PX;
        font-size: 64PX;
        color: #f3f4f5
    }

    .noresult .desc {
        text-align: center;
        font-size: 14PX;
        color: #666
    }

    .subpoilist .group {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        margin-bottom: 10PX;
    }

    .subpoilist .group:last-child {
        margin-bottom: 0
    }

    .subpoilist .group .item {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        margin-right: 6PX;
        height: 30PX;
        line-height: 30PX;
        text-align: center;
        color: #666;
        font-size: 12PX;
    }

    .subpoilist .group .item:last-child {
        margin: 0
    }

    .subpoilist .group .item.border {
        position: relative;
        background: #fff
    }

    .subpoilist .group .item.border:after {
        content: "";
        pointer-events: none;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        border: 1PX solid #ccc;
        border-radius: 2PX;
        box-sizing: border-box;
        width: 100%;
        height: 100%
    }

    @media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio:2) {
        .subpoilist .group .item.border:after {
            width:200%;
            height: 200%;
            border-radius: 4PX;
            -webkit-transform: scale(.5) translateZ(0);
            transform: scale(.5) translateZ(0)
        }
    }

    @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) {
        .subpoilist .group .item.border:after {
            width:300%;
            height: 300%;
            border-radius: 6PX;
            -webkit-transform: scale(.33) translateZ(0);
            transform: scale(.33) translateZ(0)
        }
    }

    .subpoilist .group .item.border.active {
        background: rgba(0,0,0,.04)
    }

    .citylist {
        width: 100%;
        height: 100%
    }

    .citylist .split {
        position: relative;
        z-index: 10;
        width: 100%;
        height: 10PX;
        background: #f3f4f5
    }

    .citylist .list-wrapper {
        width: 95%;
        height: 100%;
        margin: 0 auto;
        border-radius: 2PX;
        background: #fff;
        box-shadow: 0 1PX 3PX rgba(0,0,0,.1)
    }

    .citylist .list-wrapper .matchlist {
        width: 100%;
        height: 100%
    }

    .citylist .list-wrapper .matchlist .list-item {
        position: relative;
        height: 50PX;
        line-height: 50PX;
        padding: 0 16PX;
        font-size: 14PX;
        color: #333
    }

    .citylist .list-wrapper .matchlist .list-item .pc{
      margin-left:20PX;
      color:#888;
    }

    .citylist .list-wrapper .matchlist .list-item.active {
        background: rgba(0,0,0,.04)
    }

    .citylist .list-wrapper .matchlist .list-item:after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        -webkit-transform-origin: 0 bottom;
        transform-origin: 0 bottom;
        border-bottom: 1PX solid #eee
    }

    @media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio:2) {
        .citylist .list-wrapper .matchlist .list-item:after {
            -webkit-transform:scaleY(.5);
            transform: scaleY(.5)
        }
    }

    @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) {
        .citylist .list-wrapper .matchlist .list-item:after {
            -webkit-transform:scaleY(.33);
            transform: scaleY(.33)
        }
    }

    .mf-listview {
        position: relative;
        width: 100%;
        height: 100%;
      
    }

    .mf-listview .mf-list-content {
        background: #fff;
        box-shadow: 0 1PX 0 #eee;
        border-radius: 2PX
    }

    .mf-listview .mf-list-content .list-title {
        height: 50PX;
        line-height: 50PX;
        padding: 0 16PX;
        font-size: 14PX;
        color: #333;
        text-align:left;
    }

    .mf-listview .mf-list-content .list-group .list-group-title {
        padding: 16PX 16PX 10PX;
        line-height: 1;
        font-size: 14PX;
        color: #999;
        background: #f7f7f7
    }

    .mf-listview .mf-list-content .list-group .list-group-item {
        position: relative;
        height: 50PX;
        line-height: 50PX;
        padding: 0 16PX;
        font-size: 14PX;
        color: #333
    }

    .mf-listview .mf-list-content .list-group .list-group-item .pc{
      margin-left:20PX;
      color:#888;
    }

    .mf-listview .mf-list-content .list-group .list-group-item.active {
        background: rgba(0,0,0,.04)
    }

    .mf-listview .mf-list-content .list-group .list-group-item:after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        -webkit-transform-origin: 0 bottom;
        transform-origin: 0 bottom;
        border-bottom: 1PX solid #eee
    }

    @media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio:2) {
        .mf-listview .mf-list-content .list-group .list-group-item:after {
            -webkit-transform:scaleY(.5);
            transform: scaleY(.5)
        }
    }

    @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) {
        .mf-listview .mf-list-content .list-group .list-group-item:after {
            -webkit-transform:scaleY(.33);
            transform: scaleY(.33)
        }
    }

    .mf-listview .mf-list-content .list-group .list-group-item:last-child:after,.mf-listview .mf-list-content .list-group .list-group-item:last-child:before {
        display: none
    }

    .mf-listview .mf-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%
    }

    .mf-listview .mf-fixed .fixed-title {
        line-height: 1;
        padding: 16PX 16PX 10PX;
        font-size: 14PX;
        color: #999;
        background: #f7f7f7
    }

    .mf-listview .mf-shortcut {
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        font-family: Helvetica
    }

    .mf-listview .mf-shortcut ul {
        padding: 0;
        margin: 0
    }

    .mf-listview .mf-shortcut .item {
        padding: 6PX 16PX 0;
        line-height: 1;
        text-align: center;
        font-size: 12PX;
        color: #666
    }

    @media only screen and (max-height: 480PX) {
        .mf-listview .mf-shortcut .item {
            padding-top:3PX
        }
    }
</style>