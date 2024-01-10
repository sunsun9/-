const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    flag: null,   //记录是否有账号.false表示没有，true表示有
    openid: null,
    name: null,
    address: null,
    longitude: null,
    latitude: null,
    foodList: [],
    imageUrl: null

  },
  
  onLoad: function(){
    //判断账号是否注册店家
    wx.request({
      url: 'http://192.168.43.248:3000/session',
      data: { token: app.globalData.token },
      success: res => {
        this.data.openid = res.data.openid.openid
        wx.request({
          url: 'http://192.168.43.248:8080/query/getShopByShopAccount',
          data: {
            account: this.data.openid,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {
            console.log(res.data);
            if(res.data.data == null){              
              this.setData({
                flag: false,                
              })
            }
            else{
              this.setData({
                flag: res.data.data.flag,
                imageUrl: res.data.data.img,
                name: res.data.data.name
              })
              this.getFood();
            }  
          }
        })
      }
    })
  },

/*  获取前端input信息  */
  //1.店名信息
  getName: function(e){
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  //2.地址信息
  getAddress: function(e){
    this.setData({
      address: e.detail.value
    })
  },
  //3.经度信息
  getLongitude: function(e){
    this.setData({
      longitude: e.detail.value
    })
  },
  //4.纬度信息
  getLatitude: function(e){
    this.setData({
      latitude: e.detail.value
    })
  },

  //1.注册商家 
  zhuce: function(){ 
    wx.request({ 
      url: 'http://192.168.43.248:8080/manage/addshop', 
      data: { 
        account: this.data.openid, 
        password: this.data.openid, 
        name: this.data.name, 
        address: this.data.address, 
        longitude: this.data.longitude, 
        latitude: this.data.latitude 
      }, 
      method: 'POST', 
      header: { 
        'content-type': 'application/json' // 默认值 
      }, 
      success: res => { 
        console.log(res.data) 
      } 
    }) 
  }, 

  //2.删除食物
  remove: function(e){
    var id = parseInt(e.currentTarget.id)
    wx.request({
      url: 'http://192.168.43.248:8080/manage/deleteFood',
      data: {
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data);
        this.setData({
          foodList: [],
        })
        this.onLoad();
        
      }
    })
    
  },

  //3.上传图片
  chooseImage: function(){
    wx.chooseImage({
      count: 1, // 可选择的图片数量
      sizeType: ['compressed'], // 压缩图片
      sourceType: ['album', 'camera'], // 来源：相册或相机
      success:  (res)=> {
        // 将选择的图片上传到服务器
        this.uploadImage(res.tempFilePaths[0]);
      }
    })
  },
  uploadImage(imagePath) {
    wx.uploadFile({
      url: 'http://192.168.43.248:8080/uploadImg',
      filePath: imagePath,
      name: 'file',
      success: (res) => {
        // 上传成功后，将服务器返回的图片地址更新到image标签中
        var da = JSON.parse(res.data)
        console.log(da.data.img); 
        this.setData({
          imageUrl: da.data.img,
        });  
      },
      fail:  (res) => {
        console.log(res);
      }
    })
  },

  //4.用户已注册成为商家 获取食物信息
  getFood: function(){
    if(this.data.flag == true){
      wx.request({
        url: 'http://192.168.43.248:8080/query/getFoodByAccount',
        data: {
          account: this.data.openid,
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          console.log(res.data.data);
          if(res.data.data == null){            
            wx.showToast({
              title: '还未添加食物！',
              icon: 'none',
              duration: 1000//持续的时间
            })
            this.setData({
              foodList: null,
            })
          }
          else{
            for(var i=0;i<res.data.data.length;i++)
            {
              var newarray = {
                id:res.data.data[i].id,
                name:res.data.data[i].name,
                shop_id:res.data.data[i].shop_id,
                img: "https://gitee.com/sun1123/images1/raw/master/" + res.data.data[i].id +".jpg",
                hits: res.data.data[i].hits
              };        
              this.data.foodList = this.data.foodList.concat(newarray);                         
            }  
            this.setData({                      
              foodList: this.data.foodList
            });  
          }                  
        }
      })
    }
  },

  //5.添加食物
  addFood: function(){
    wx.redirectTo({
      url: '/packageA/pages/add/add?openid=' + this.data.openid
    })
  }
})