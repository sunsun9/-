// pages/collection/collection.js
const app = getApp()
Page({
  data: {
    id: '',
    foodList: [],
    openid: null
  },

  onLoad:function(e){
    this.setData({
      id: e.id
    })
    console.log(this.data.id)
    var that = this
    wx.request({
      url: 'http://192.168.43.248:3000/session',
      data: { token: app.globalData.token },
      success: res => {
        this.setData({
          openid:res.data.openid.openid
        })

        //id为1 表示美食收藏界面
        if (this.data.id == 1){
          //根据id查找商店
          wx.request({
            url: 'http://192.168.43.248:8080/query/getFavoriteByUserId',
            data: {
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
                  img: "https://gitee.com/sun1123/images/raw/master/" + res.data.data[i].id +".jpg",
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

        //id为2 表示店铺收藏
        else if (this.data.id == 2){
          //根据id查找商店
          wx.request({
            url: 'http://192.168.43.248:8080/query/getShop_UserByUserId',
            data: {
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
                  img: "https://gitee.com/sun1123/shop_img/raw/master/shop" + res.data.data[i].id +".jpg",
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
      }
    })  
  },

  collection: function(e){
    var that = this
    var id = parseInt(e.currentTarget.id)
    console.log(e.currentTarget)
    //根据id得到元素所在位置
    let index = this.data.foodList.findIndex( item => item.id == id);
    console.log(index)//打印元素所在位置
    
    that.data.foodList.splice(index, 1)
    //从列表中删除 从而从屏幕显示上删除
    this.setData({
      foodList: that.data.foodList
    })
    if (this.data.id == 1){
      //删除数据库食物收藏记录
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

    //删除数据库店铺收藏记录
    else{
      wx.request({
        url: 'http://192.168.43.248:8080/manage/deleteShop_User',
        data: {
          shop_id: id,
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
  }
})