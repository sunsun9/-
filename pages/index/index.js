// 腾讯地图SDK
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
// 注册后获得的key值
var key = 'LOLBZ-IN7KZ-FR2XF-TZWBE-2DEJT-YJB4D'
const qqmapsdk = new QQMapWX({
  key: key
})

Page({
  data: {
    mapw: '100%', // 地图宽度
    maph: '0', // 地图高度
    scale: '18', // 缩放
    longitude: null, // 地图中心点经度
    latitude: null, // 地图中心点纬度
    markers: []// 标记点
  },
  markIndex: 0,
  mapCtx: null,
  onLoad: function() {
    this.mapCtx = wx.createMapContext('map')
    // 获取窗口的宽度和高度
    wx.getSystemInfo({
      success: res => {
        var mapw = res.windowWidth // 宽度
        var maph = res.windowHeight // 高度
        this.setData({
          maph: maph + 'px',
          // 设置控件显示
          controls: [{
            id: 1,
            iconPath: '/images/gps.png',
            position: {
              left: 10,
              top: maph - 50,
              width: 40,
              height: 40
            },
            clickable: true
          }]
        })
      }
    })
  },
  // 获取当前位置(经纬度)
  onReady: function() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  },
  getFood: function(longitude, latitude) {
        var mark = []
            mark.push({
          iconPath: '/images/food1.jpg',
          id: 1,
          latitude: 30.515656,
          longitude: 114.365403,
          width: '30', // 标记点图标宽度
          height: '30', // 标记点图标高度
          clickable:"true"
        })

        // 将搜索结果显示在地图上
        this.setData({
          markers: mark
        })
      },
  //   })
  // },
  // 地图移动时，更新地图上的标记点
  bindRegionChange: function(e) {
    if (e.type === 'end') {
      this.mapCtx.getCenterLocation({
        success: res => {
          this.getFood(res.longitude, res.latitude)
        }
      })
    }
  },
  

  //点击marker响应事件
  markerclick: function(e){
    var markerId = e.detail.markerId
    
    if (markerId == 1){
      
      wx.navigateTo({
        url: '/packageB/pages/food1/food1',
      })
    }
  },

  tosearch: function(){
    wx.navigateTo({
      url: '/packageA/pages/search/search',
    })
  }
})