// packageA/pages/add/add.js
Page({

  data: {
    name: null,
    tag: null,
    imageUrl: null,
    openid: null,
  },

  onLoad:function(e){
    this.setData({
      openid: e.openid,
    })
  },

  //1.店名信息
  getName: function(e){
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  //2.标签信息
  getTag: function(e){
    this.setData({
      tag: e.detail.value
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
      url: 'http://192.168.43.248:8080/uploadImg_food',
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

  //4.添加食物
  addfood: function(){
    wx.request({ 
      url: 'http://192.168.43.248:8080/manage/addfood', 
      data: { 
        name: this.data.name, 
        tag: this.data.tag, 
        account: this.data.openid, 
        img: this.data.imageUrl,      
      }, 
      method: 'POST', 
      header: { 
        'content-type': 'application/json' // 默认值 
      }, 
      success: res => { 
        console.log(res.data) 
        if(res.data.msg == "添加成功"){
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 500//持续的时间
          })
          wx.redirectTo({
            url: '/packageA/pages/shop/shop'
          })
        }          
      } 
    }) 
  }
  
})