<template>
  <main-box :title="title">
    <div class="normal-list vux-1px-tb">
      <ul>
        <li v-for="(rule, index) in ruleInfos"
            @click="jumpToInfo(index)"
            class="line line-x-b">
          {{rule.name}}<i class="icon-r-jt"></i>
        </li>
      </ul>
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
        title: this.$route.meta.title,
        productList: '',
        posiData: {},
        rules: [],
        ruleInfos: []
      }
    },
    created() {
        if(appStorage.get('cityMsg')) {
          this.posiData = JSON.parse(appStorage.get('cityMsg'));
        }
        this.carRentalFindByCity();
    },
    methods: {
      carRentalFindByCity() {
        let findData = {
          city: this.posiData.city.replace('市', ''),
          pageNo: 0,
          pageSize: 100
        };
        this.$store.commit('UPDATE_LOADING', true);
        api.carRentalFindByCity(findData).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          let data = TOOL.toJson(res.data);
          if(data.resultCode == 0) {
            this.productList = data.resultData.content[0];
            this.rules = this.productList.rules;
            for(let [key, val] of Object.entries(this.rules)) {
                this.ruleInfos.push({name:key,html:val})
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      jumpToInfo(index) {
        appStorage.set('rentNotice', JSON.stringify(this.ruleInfos[index]))
          this.$router.push({
            name: 'rentInfo',
            query: {
                pageRouter: 'rentNotice'
            }
          })
      }
    }
  }
</script>
