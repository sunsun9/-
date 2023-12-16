const App = getApp()
Page({
  data: {
    // 自定义顶部导航
    // navHeight: App.globalData.navHeight,
    // navTop: App.globalData.navTop,
    color1: "color: black;",
    color2: "color: black;",
    filterflag: true,
    searchIcon: "/images/search.png",
    upperLeftArrow: "../../../img/icon/icon-upper-left-arrow.png",
    historyStorage: [],        //历史搜索
    historyStorageShow: false,
    inputValue: "",        //输入框输入的值
    replaceValue: "",     //替换输入框的值
    searchresult: false,
    searchResult: [],
    longitude: null,
    latitude: null,
    flag:null,
    shop_name: null,
  },

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
   * 3.清除
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
    this.setData({
      searchResult: [],
    })
  },
 
  /**
   * 点击搜索提交跳转并存储历史记录
   */
  searchbegin: function () {
    let _this = this
    if (this.data.flag == 0){
      _this.data.replaceValue = _this.data.inputValue
      var newarray = {
        context:  _this.data.inputValue
      };   
      wx: wx.setStorage({
        key: 'historyStorage',
        data: _this.data.historyStorage.concat(newarray),
      })
    }
    else if(this.data.flag == 1){
      _this.data.replaceValue = this.data.shop_name + '%' + _this.data.inputValue
    }
    
    wx.request({
      url: 'http://192.168.43.248:8080/query/getFoodByName',
      data: {
        name: this.data.replaceValue,
        longitude: this.data.longitude,
        latitude: this.data.latitude
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
  onLoad: function(e) {
    //获取页面跳转的参数
    this.setData({
      flag: e.flag,
      shop_name: e.shop_name
    })

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

  //1.点击列表跳转导航
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

  //2.点击历史搜索可实现搜索
  routeToSearchResPage: function(e){
    var context = this.data.historyStorage[e.currentTarget.dataset.index].context
    this.setData({
      inputValue: context
    })
    this.setData({
      searchresult: true,
    })
    this.searchbegin()
  },

  //比较函数_从大到小
  compare1: function(obj1, obj2){
    var val1 = obj1.hits;
    var val2 = obj2.hits;
    if (val1 < val2) {
        return 1;
    } else if (val1 > val2) {
        return -1;
    } else {
        return 0;
    }
  },
  //比较函数_从小到大
  compare2: function(obj1, obj2){
    var val1 = obj1.distance;
    var val2 = obj2.distance;
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
  },


  //4.点击收藏优先响应
  collection_first: function(){
    this.data.searchResult = this.data.searchResult.sort(this.compare1)
    this.setData({
      searchResult: this.data.searchResult
    })
    this.setData({
      color1: "color: #86b8ea;"
    })
    this.setData({
      color2: "color: black;"
    })
    console.log(this.data.searchResult)
  },

  //5.点击距离优先响应
  distance_first: function(){
    this.data.searchResult = this.data.searchResult.sort(this.compare2)
    this.setData({
      searchResult: this.data.searchResult
    })
    this.setData({
      color2: "color: #86b8ea;"
    })
    this.setData({
      color1: "color: black;"
    })
    console.log(this.data.searchResult)
  },

})