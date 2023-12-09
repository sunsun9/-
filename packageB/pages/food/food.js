// pages/food/food.js
const app = getApp()
Page({
  data: {
    name: '',
    id: '',
    foodList: [],
    shop: {},
    openid: null
  },

  onLoad:function(e){
    this.setData({
      name: e.name,
      id: e.id
    })

    var that = this
    wx.request({
      url: 'http://192.168.43.248:3000/session',
      data: { token: app.globalData.token },
      success: res => {
        this.setData({
          openid:res.data.openid.openid
        })

        //根据shop_id查询店家信息
        wx.request({
          url: 'http://192.168.43.248:8080/query/getShopByShopId',
          data: {
            id: this.data.id,     //店家id
            user_id: this.data.openid
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {
            console.log(res.data.data)
            that.setData({
              shop: res.data.data
            });   
            console.log(that.data.shop)
          }
        })

        //根据id查找食物
        wx.request({
          url: 'http://192.168.43.248:8080/query/getFoodByShopId',
          data: {
            id: this.data.id,
            user_id: this.data.openid
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {                               
            for(var i=0;i<res.data.data.length;i++)
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
          }
        })
      }
    })  
  },

  collection: function(e){
    var id = parseInt(e.currentTarget.id)
    console.log(e.currentTarget)
    //根据id得到元素所在位置
    let index = this.data.foodList.findIndex( item => item.id == id);
    console.log(index)//打印元素所在位置
    if(this.data.foodList[index].flag == false){
      this.setData({
        ['foodList[' + index +'].flag'] : true
      }) 

      //在数据库中添加记录          
      //添加收藏数据
      wx.request({
        url: 'http://192.168.43.248:8080/manage/addfavorite',
        data: {
          food_id: id,
          user_id: this.data.openid
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          console.log(res.data)
        }
      })
    }
    else{
      this.setData({
        ['foodList[' + index +'].flag'] : false
      })
      //删除数据库记录 
      wx.request({
        url: 'http://192.168.43.248:8080/manage/deleteFavorite',
        data: {
          food_id: id,
          user_id: this.data.openid
        },
        method: 'POST',
        header: {
           'content-type': 'application/json' // 默认值
        },
        success: res => {
          console.log(res.data)
        }
      })
    }
  },

  //店家收藏关系
  shop_collection: function(){
    if(this.data.shop.flag == false){
      this.setData({
        ['shop.flag'] : true
      })
      //在数据库中添加记录          
      //添加收藏数据
      wx.request({
        url: 'http://192.168.43.248:8080/manage/addShop_User',
        data: {
          shop_id: this.data.shop.id,
          user_id: this.data.openid
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          console.log(res.data)
        }
      })
    }
    else{
      this.setData({
        ['shop.flag'] : false
      })
      //删除数据库记录
      wx.request({
        url: 'http://192.168.43.248:8080/manage/deleteShop_User',
        data: {
          shop_id: this.data.shop.id,
          user_id: this.data.openid
        },
        method: 'POST',
        header: {
           'content-type': 'application/json' // 默认值
        },
        success: res => {
          console.log(res.data)
        }
      })
    }
  },

  //前往搜索页面
  go_search: function(){
    wx.navigateTo({
      url: '/packageA/pages/search/search'
    })
  },

  //前往导航界面
  go_graph: function(){
    var longitude = parseFloat(this.data.shop.longitude)
    var latitude = parseFloat(this.data.shop.latitude) 
    var name = this.data.shop.name
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