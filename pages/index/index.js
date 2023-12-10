const app = getApp()
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
    markers: [],// 标记点
    foodList:[],
    openid: null
  },
  markIndex: 0,
  mapCtx: null,

  onLoad: function() {
    //首页推荐部分
    var that = this
    wx.request({
      url: 'http://192.168.43.248:3000/session',
      data: { token: app.globalData.token },
      success: res => {
        // console.log(res.data)
        this.setData({
          openid:res.data.openid.openid
        })
        wx.request({
          // 注意，如果小程序开启校验合法域名时必须使用https协议
          //在测试的情况下可以不开启域名校验
          url: 'http://192.168.43.248:8080/query/getRecommendByUserId',
          data: {
            // 接口设置的固定参数值
            user_id: this.data.openid
          },
          // 请求的方法
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          // 请求成功时的处理
          success: res => {
            // console.log(res.data.data)
            for(var i=0;i<res.data.data.length && i < 3;i++)
            {
              var newarray = {
                id:res.data.data[i].id,
                name:res.data.data[i].name,
                shop_id:res.data.data[i].shop_id,
                img: "https://gitee.com/sun1123/images1/raw/master/" + res.data.data[i].id +".jpg",
                flag: res.data.data[i].flag
              };        
              that.data.foodList = that.data.foodList.concat(newarray);
              that.setData({
                foodList: that.data.foodList
              });             
            }
            console.log(that.data.foodList)
          }
        })
      }
    })
    
    this.mapCtx = wx.createMapContext('map')
    // 获取窗口的宽度和高度
    wx.getSystemInfo({
      success: res => {
        var mapw = res.windowWidth // 宽度
        var maph = res.windowHeight // 高度
        this.setData({
          maph: maph + 'px',
          // 设置控件显示
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

        mark.push({
          iconPath: '/pages/image/shop8.jpg',
          id: 8,
          latitude: 30.513461,
          longitude: 114.353895,
          width: '30', // 标记点图标宽度
          height: '30', // 标记点图标高度
          clickable:"true"
        })

        mark.push({
          iconPath: '/pages/image/shop9.jpg',
          id: 9,
          latitude: 30.521331,
          longitude: 114.356745,
          width: '30', // 标记点图标宽度
          height: '30', // 标记点图标高度
          clickable:"true"
        })

        mark.push({
          iconPath: '/pages/image/shop10.jpg',
          id: 10,
          latitude: 30.507606,
          longitude: 114.357283,
          width: '30', // 标记点图标宽度
          height: '30', // 标记点图标高度
          clickable:"true"
        })

        mark.push({
          iconPath: '/pages/image/shop11.jpg',
          id: 11,
          latitude: 30.514928,
          longitude: 114.357005,
          width: '30', // 标记点图标宽度
          height: '30', // 标记点图标高度
          clickable:"true"
        })
        mark.push({
          iconPath: '/pages/image/shop12.jpg',
          id: 12,
          latitude: 30.513451,
          longitude: 114.35417,
          width: '30', // 标记点图标宽度
          height: '30', // 标记点图标高度
          clickable:"true"
        })
        mark.push({
          iconPath: '/pages/image/shop14.jpg',
          id: 14,
          latitude: 30.513533,
          longitude: 114.353838,
          width: '30', // 标记点图标宽度
          height: '30', // 标记点图标高度
          clickable:"true"
        })
        mark.push({
          iconPath: '/pages/image/shop16.png',
          id: 16,
          latitude: 30.513081,
          longitude: 114.35806,
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
    else {
      wx.navigateTo({
        url: '/packageB/pages/food/food?name= ' + '&id=' + markerId,
      })
    }
  },

  tosearch: function(){
    wx.navigateTo({
      url: '/packageA/pages/search/search',
    })
  }
})