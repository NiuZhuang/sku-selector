export const mockSkuData = {
    specs: [
      {
        label: "套餐",
        specId: 2,
        options: [
          { optionId: 3, label: "套餐一" },
          { optionId: 4, label: "套餐二" }
        ]
      },
      {
        label: "颜色",
        specId: 1,
        options: [
          { optionId: 1, label: "红色" },
          { optionId: 2, label: "紫色" }
        ]
      },
  
      {
        label: "内存",
        specId: 3,
        options: [
          { optionId: 5, label: "64G" },
          { optionId: 6, label: "128G" },
          { optionId: 7, label: "256G" }
        ]
      }
    ],
    skus: [
      {
        skuId: 1,
        specOptionDesc: ["紫色", "套餐一", "64G"],
        specOptionIds: [2, 3, 5],
        price: 10,
        priceLabel: "价格",
        subPrice: 0,
        subPriceLabel: "会员价",
        stock: 10,
        imageUrl: ""
      },
      {
        skuId: 2,
        specOptionDesc: ["紫色", "套餐一", "128G"],
        specOptionIds: [2, 3, 6],
        price: 10,
        priceLabel: "价格",
        subPrice: 0,
        subPriceLabel: "会员价",
        stock: 10,
        imageUrl: ""
      },
      {
        skuId: 3,
        specOptionDesc: ["紫色", "套餐二", "128G"],
        specOptionIds: [2, 4, 6],
        price: 10,
        priceLabel: "价格",
        subPrice: 0,
        subPriceLabel: "会员价",
        stock: 10,
        imageUrl: ""
      },
      {
        skuId: 4,
        specOptionDesc: ["红色", "套餐二", "256G"],
        specOptionIds: [1, 4, 7],
        price: 10,
        priceLabel: "价格",
        subPrice: 0,
        subPriceLabel: "会员价",
        stock: 10,
        imageUrl: ""
      },
      {
        skuId: 5,
        specOptionDesc: ["红色", "套餐二", "128G"],
        specOptionIds: [1, 4, 6],
        price: 10,
        priceLabel: "价格",
        subPrice: 0,
        subPriceLabel: "会员价",
        stock: 10,
        imageUrl: ""
      }
    ],
    value: 3
  };
  