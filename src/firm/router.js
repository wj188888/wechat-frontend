export default [
  {
    path: '/LineCarPreview',
    name: 'LineCarPreview',
    component: resolve => require(['./views/LineCarPreview.vue'], resolve),
    meta:{
      title: '线路包车预览',
    }
  },
  {
    path: '/tourScenicPreview',
    name: 'tourScenicPreview',
    component: resolve => require(['./views/TourScenicPreview.vue'], resolve),
    meta:{
      title: '景点专线预览',
    }
  },
  {
    path: '/tourLinePreview',
    name: 'tourLinePreview',
    component: resolve => require(['./views/TourLinePreview.vue'], resolve),
    meta:{
      title: '景点车票预览',
    }
  },
  {
    path: '/appVersion',
    name: 'appVersion',
    component: resolve => require(['./views/AppVersion.vue'], resolve),
    meta:{
      title: '连接',
    }
  },
  {
    path: '/iosVersion',
    name: 'iosVersion',
    component: resolve => require(['./views/IosVersion.vue'], resolve),
    meta: {
      title: '连接',
    }
  },
  {
    path: '/downloadApp',
    name: 'downloadApp',
    component: resolve => require(['./views/DownloadApp.vue'], resolve),
    meta: {
      title: 'App下载',
    }
  },
  {
    path: '/driverAppDownload',
    name: 'driverAppDownload',
    component: resolve => require(['./views/DriverAppDownload.vue'], resolve),
    meta: {
      title: 'App下载',
    }
  },
]
