<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <ul class="top-flex-nav line line-x-b">
      <li :class="{'router-link-exact-active active': serveType == '0'}"
          @click="switchType('0')"
      ><a>上门服务</a></li>
      <li :class="{'router-link-exact-active active': serveType == '1'}"
          @click="switchType('1')"
      ><a>预约服务</a></li>
    </ul>

    <div v-show="orderList&&orderList.length>0">
      <div class="insp-list" v-for="(order, index) in orderList" :key="order.id"
           @click="jumpToPage(order.id, order.status)"
      >
        <div class="insp-list-l">
          <p class="p1">{{order.carSubTypeDto.name}}</p>
          <p class="p2">{{order.createdTime.substring(5,7)}}月{{order.createdTime.substring(8,10)}}日&nbsp;{{order.createdTime.substring(11,16)}}</p>
        </div>
        <div class="insp-list-r">
          {{order.statusString}}
        </div>
      </div>
    </div>
    <div class="no-order" v-show="!(orderList&&orderList.length>0)">
      暂无订单信息
    </div>

  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox
    },
    data() {
      return {
        title:this.$route.meta.title,
        pageRouter: this.$route.name,
        orderList: [],
        serveType: '0', // visit appoint
      }
    },
    created() {
      this.orderFind();
    },
    computed: {

    },
    watch: {

    },
    methods: {
      orderFind() {
        let searchData = {
          serveType: this.serveType,
          pageNo: 0,
          pageSize: 1000,
        };
        this.$store.commit('UPDATE_LOADING', true);
        api.inspectionOrderFind(searchData).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.orderList = data.resultData.content;
            console.log(this.orderList);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      /**
       * 跳转到相应的页面
       * @param id：订单id
       * @param status：订单状态
       */
      jumpToPage(id, status) {
        // 上门服务的跳转路径
        if(this.serveType == 0) {
            if(status == '1'||status == '0') {
              this.$router.push({
                name: 'waitAppoint',
                query: {
                  orderId: id,
                  status: status,
                }
              })
            } else {
              this.$router.push({
                name: 'timeAxis',
                query: {
                  orderId: id,
                  status: status,
                }
              })
            }
        } else {
          this.$router.push({
            name: 'appointSuccess',
            query: {
              orderId: id,
              status: status,
            }
          })
        }
      },
      switchType(type) {
        this.serveType = type;
        this.orderFind();
      }
    }
  }
</script>
<style lang="less" scoped>
  .no-order {
    padding-top: 100px;

    font-size: 28px;
    color: #888;
    text-align: center;
  }
  .insp-list {
    display: flex;

    width: 100%;
    height: 130px;
    padding: 0 20px;
    margin: 20px 0;

    background: #fff;
  }
  .insp-list-l {
    width: 0;
    flex: 2;
  }
  .p1 {
    padding: 20px 0 40px 0;

    font-size: 28px;
    color: #121212;
  }
  .p2 {
    font-size: 24px;
    color: #4c4c4c;
  }
  .insp-list-r {
    width: 0;
    flex: 3;

    height: 130px;
    line-height: 130px;

    text-align: right;
    font-size: 28px;
    color: #888;
  }
</style>
