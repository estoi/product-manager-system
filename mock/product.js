import Mock from "mockjs";

const data = Mock.mock({
  "items|20": [
    {
      productId: "@id()",
      productName: "@ctitle(2, 3)",
      productPrice: "@character(number)",
      productImg: "@image(100)",
    },
  ],
});
export default [
  {
    url: "/apis/product/list",
    method: "get",
    response: (config) => {
      const items = data.items;
      const { productName = null } = config.query;
      let list = [];
      if (productName) {
        list = items.filter((item) => item.productName.includes(productName));
      } else {
        list = [...items];
      }
      return {
        code: 200,
        message: "成功",
        data: [...list],
      };
    },
  },
  {
    url: "/apis/product/add",
    method: "post",
    response: (config) => {
      const { productName, productPrice } = config.body;
      data.items.unshift({
        productId: Mock.Random.id(),
        productName,
        productPrice,
        productImg: Mock.Random.image("100"),
      });
      return {
        code: 200,
        message: "成功",
      };
    },
  },
  {
    url: "/apis/product/modify",
    method: "post",
    response: (config) => {
      const { productName, productPrice, productId } = config.body;
      const currentProduct = data.items.filter(
        (item) => item.productId === productId
      )[0];
      const index = data.items.findIndex(
        (item) => item.productId === productId
      );
      if (productId === currentProduct.productId) {
        data.items[index] = {
          ...currentProduct,
          productName,
          productPrice,
        };
        return {
          code: 200,
          message: "成功",
        };
      } else {
        return {
          code: 999,
          message: "系统错误",
        };
      }
    },
  },
  {
    url: "/apis/product/delete",
    method: "post",
    response: (config) => {
      const { productId } = config.body;
      const list = data.items.filter((item) => item.productId !== productId);
      data.items = [...list];
      return {
        code: 200,
        message: "成功",
      };
    },
  },
];
