export const Endpoint = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  BRANCH: "/branch",
  SETTING: "/setting",
  CATEGORY: "/category",
  COLOR: "/color",
  COUPON: "/coupon",
  STORAGE: "/storage",
  SPECIFICATION: "/specification",
  PRODUCT: "/product",
  USER: "/user",
  ORDER: "/order",
};

export const routers = [
  {
    endpoint: Endpoint.DASHBOARD,
    text: "Thống kê",
  },
  {
    endpoint: Endpoint.BRANCH,
    text: "Quản lý thương hiệu",
  },
  {
    endpoint: Endpoint.CATEGORY,
    text: "Quản lý danh mục",
  },
  {
    endpoint: Endpoint.PRODUCT,
    text: "Quản lý sản phẩm",
  },
  {
    endpoint: Endpoint.SPECIFICATION,
    text: "Quản lý thông số",
  },
  {
    endpoint: Endpoint.COUPON,
    text: "Quản lý mã giảm giá",
  },
  {
    endpoint: Endpoint.USER,
    text: "Quản lý người dùng",
  },
  {
    endpoint: Endpoint.ORDER,
    text: "Quản lý đơn hàng",
  },
];
