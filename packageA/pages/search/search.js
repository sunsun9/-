const App = getApp()
Page({
  data: {
    // 自定义顶部导航
    // navHeight: App.globalData.navHeight,
    // navTop: App.globalData.navTop,
    // 图标
    searchIcon: "/images/search.png",
    upperLeftArrow: "../../../img/icon/icon-upper-left-arrow.png",
    historyStorage: [],        //历史搜索
    historyStorageShow: false,
    // searchresult: false,
    inputValue: "",        //输入框输入的值
    replaceValue: "",     //替换输入框的值
    searchresult: false,
    searchResult: [],
    longitude: null,
    latitude: null
  },

  /**
   * 获取顶部固定高度
   */
  attached: function() {
    this.setData({
      navHeight: App.globalData.navHeight,
      navTop: App.globalData.navTop,
    })
  },
 
  /**
   * 清除
   */
  remove: function () {
    var _this = this
    wx: wx.showModal({
      content: '确认清除所有历史记录?',
      success: function (res) {
        if (res.confirm) {
          wx: wx.removeStorage({
            key: 'historyStorage',
            success: function (res) {
              _this.setData({
                historyStorage: []
              })
              wx.setStorageSync("historyStorage", [])
            },
          })
        } else {
          console.log("点击取消")
        }
      },
    })
  },
 
 
  /**
   * 获取input的值
   */
  getInputValue(e) {
    // console.log("获取value值",e.detail)   // {value: "ff", cursor: 2}
    this.setData({
      inputValue: e.detail.value
    })
    this.setData({
      searchresult: true,
    })
  },
 
  /**
   * 点击搜索提交跳转并存储历史记录
   */
  searchbegin: function () {
    let _this = this
    _this.data.replaceValue = _this.data.inputValue
    var newarray = {
      context:  _this.data.inputValue
    };   
    wx: wx.setStorage({
      key: 'historyStorage',
      data: _this.data.historyStorage.concat(newarray),
    })
    wx.request({
      url: 'http://192.168.43.248:8080/query/getFoodByName',
      data: {
        name: this.data.inputValue
      },
      method: 'POST',
      header: {
    		'content-type': 'application/json' // 默认值
  	  },
      success: res => {
        console.log(res.data.data)
        if (res.statusCode == 200) { 
          var array = res.data.data
          var that = this
          that.setData({
            searchResult: array
          })
        }
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 历史搜索
    let that = this
    wx.getStorage({
      key: 'historyStorage',
      success: function (res) {
        console.log(res.data)
        that.setData({
          historyStorageShow: true,
          historyStorage: res.data
        })
      }
    })
  },
  goUpdate: function () {
    this.onLoad()
  },

  daohang: function(e){
    var id = e.target.id
    console.log(id)
    wx.request({
      // 注意，如果小程序开启校验合法域名时必须使用https协议
      //在测试的情况下可以不开启域名校验
      url: 'http://192.168.43.248:8080/query/getAddressByFoodId',
      data: {
        // 接口设置的固定参数值
        id: id
      },
      // 请求的方法
      method: 'POST',
      header: {
    		'content-type': 'application/json' // 默认值
  	  },
  	  // 请求成功时的处理
      success: res => {
        console.log(res.data.data)
        //得到目的地位置坐标
        var longitude = parseFloat(res.data.data.longitude)
        var latitude = parseFloat(res.data.data.latitude) 
        var name = res.data.data.name
        //获取当前位置坐标
        wx.getLocation({
          type: 'wgs84',
          success: res => {
            this.setData({
              longitude: res.longitude,
              latitude: res.latitude
            })
          }
        })
        //路线规划
        
        wx.openLocation({
          type: 'gcj02',
          latitude: latitude,
          longitude: longitude,
          name: name,
          scale: 28
      })
      }
    })
  },

  routeToSearchResPage: function(e){
    var context = this.data.historyStorage[e.currentTarget.dataset.index].context
    this.setData({
      inputValue: context
    })
    this.setData({
      searchresult: true,
    })

    this.searchbegin()
  }
})