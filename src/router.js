import NotFound from "./components/NotFound";
import { Endpoint } from "./constants/endpoint";
import PrivateRouter from "./containers/PrivateRouter";
import Branch from "./pages/Branch";
import Category from "./pages/Category";
import Coupon from "./pages/Coupon";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Order from "./pages/Order";
import Product from "./pages/Product";
import Specification from "./pages/Specification";
import User from "./pages/User";

const routes = [
  {
    path: Endpoint.HOME,
    element: <Login />,
  },
  {
    path: Endpoint.DASHBOARD,
    element: <PrivateRouter component={Dashboard} />,
  },
  {
    path: Endpoint.BRANCH,
    element: <PrivateRouter component={Branch} />,
  },
  {
    path: Endpoint.CATEGORY,
    element: <PrivateRouter component={Category} />,
  },
  {
    path: Endpoint.COUPON,
    element: <PrivateRouter component={Coupon} />,
  },
  {
    path: Endpoint.SPECIFICATION,
    element: <PrivateRouter component={Specification} />,
  },
  {
    path: Endpoint.PRODUCT,
    element: <PrivateRouter component={Product} />,
  },
  {
    path: Endpoint.USER,
    element: <PrivateRouter component={User} />,
  },
  {
    path: Endpoint.ORDER,
    element: <PrivateRouter component={Order} />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
