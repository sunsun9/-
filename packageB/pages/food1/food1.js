// pages/food1/food1.js
//沁园春列表页
Page({
  
  data: {
    // 数据源
    shoplist: [
      {
        id: 1,
        url: "/images/shop1.jpg",
        url2: "/images/shop1.jpg",
        flag: false,
        name: "卤汁肴",
        address: "地址：沁园春食堂",
        introduction: "介绍：有美食经典猪脚饭、蟹肉虾仁滑蛋饭、番茄牛腩滑蛋饭、港式猪扒滑蛋饭、烤肉饭、手枪大鸭腿饭、黑金叉烧饭、鸡腿饭、现烤鸡扒饭、香肠饭等，外卖可配送本部及南湖校区。"
      },
      {
        id: 2,
        url: "/images/shop2.jpg",
        url2: "/images/shop1.jpg",
        flag: false,
        name: "原味村中华拌饭·三汁焖锅",
        address: "地址：沁园春食堂",
        introduction: "介绍：有美食招牌三汁香辣鸡焖锅、鸡腿肉焖面、三汁小酥肉焖面、三汁小酥肉焖锅、三汁鸡翅鸡爪焖锅、三汁瘦肉焖锅、金汤鱼片、金汤肉片、三汁小麻香肠焖锅、三汁黄金烤鸭焖粉等，外卖可配送本部及南湖校区。"
      },
      {
        id: 3,
        url: "/images/shop1.jpg",
        url2: "/images/shop1.jpg",
        flag: false,
        name: "石板高丽拌饭馆",
        address: "地址：沁园春食堂",
        introduction: "介绍：有美食经典石锅拌饭、朝鲜大冷面、烤猪肉拌饭、澳洲肥牛拌饭、牛肉拌饭、香菇培根拌饭、肉松咸蛋黄拌饭、金枪鱼拌饭、水晶虾仁拌饭、鱼子酱拌饭等，外卖可配送本部及南湖校区。"
      },
      {
        id: 4,
        url: "/images/shop4.jpg",
        url2: "/images/shop1.jpg",
        flag: false,
        name: "派乐汉堡",
        address: "地址：沁园春食堂",
        introduction: "介绍：有美食薯条、香脆鸡腿汉堡、香辣鸡翅、卤辣王炸烤鸡、琥珀炸鸡、黄金脆皮鸡、蜜汁烤全鸡、鸡肉卷、卤辣鸡架、芝士牛肉汉堡等，外卖可配送本部及南湖校区。"
      },
      {
        id: 5,
        url: "/images/shop1.jpg",
        url2: "/images/shop1.jpg",
        flag: false,
        name: "沙县小吃",
        address: "地址：沁园春食堂",
        introduction: "介绍：有美食馄饨、蒸饺、蛋炒河粉、飘香拌面、蛋炒细粉、葱油拌面、黄焖鸡、鸭腿饭、香拌馄饨、宫保鸡丁饭、热干面、小笼包、咖喱鸡肉饭、香菇滑鸡饭、隆江猪肘饭、炒饭、炒面、乌鸡汤、莲子猪肚汤、党参土鸡汤、海带排骨汤、汤饭、汤面等，外卖可配送本部及南湖校区。"
      },
      {
        id: 6,
        url: "/images/shop7.jpg",
        url2: "/images/shop1.jpg",
        flag: false,
        name: "氢简厨房",
        address: "地址：沁园春食堂",
        introduction: "介绍：有轻食三明治、减脂沙拉、牛排等，外卖可配送本部及南湖校区。"
      },
      {
        id: 7,
        url: "/images/shop1.jpg",
        url2: "/images/shop1.jpg",
        flag: false,
        name: "长青巷桥头排骨",
        address: "地址：沁园春食堂",
        introduction: "介绍：有美食排骨、掌中宝、肉条、烤鸡腿、薯条、杏鲍菇、鸡翅尖、锅巴土豆、藕夹、鸡翅包饭、鸡排、鸡柳等，外卖可配送本部及南湖校区。"
      }
    ]
  },
  
  onLoad: function () {

  },

  goFood: function(e){
    var id = parseInt(e.currentTarget.id)
    var name = this.data.shoplist[id-1].name
    wx.navigateTo({
      url: '/packageB/pages/food/food?name=' + name + '&id=' + id,
    })
    
    

  }
})
