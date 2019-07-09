export default class Page {
  /**
   * 分页构造函数
   * @param {Object} options - 配置
   * @param {Object} options.search - 搜索条件
   * @param {Function} options.refScroll - refScroll
   * @param {String} options.pageApi - 分页接口
   */
  constructor(options) {
    this.search = Object.assign({
      pageNo: 0,
      pageSize: TOOL.pageSize
    }, options.search);
    this.refScroll = options.refScroll;
    this.pageApi = options.pageApi;
    this.totalPage = 0;
  }
  onPullingUp() {
    return new Promise((resolve, reject) => {
      if(this.search.pageNo === 0){
        this.loadPageList(resolve, reject);
        this.refScroll.scrollTo(0, 0)
      }else{
        setTimeout(()=>{
          this.loadPageList(resolve, reject)
        }, 1000)
      }
    })
  }
  loadPageList(resolve, reject) {
    if(this.search.pageNo && this.search.pageNo >= this.totalPage){
      this.refScroll.forceUpdate();
      return
    }
    api[this.pageApi](this.search).then(res => {
      const data = TOOL.toJson(res.data);
      if(data.resultCode === '0') {
        if(data.resultData.content) {
          this.totalPage = data.resultData.totalPages;
          setTimeout(() => {
            if(this.refScroll){
              this.refScroll.forceUpdate(true)
            }
          }, 20);
          if(this.search.pageNo === 0 || this.search.pageNo < this.totalPage){
            this.search.pageNo++
          }
          resolve(data.resultData.content);
        } else {
          resolve([]);
        }
      } else {
        reject(data.resultMsg);
      }
    })
  }
}