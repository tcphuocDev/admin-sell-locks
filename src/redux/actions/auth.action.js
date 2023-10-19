import { notification } from "antd";
import { getProfileService, loginService } from "../../service/auth.service";
import * as types from "../constants";

export const login = (user) => {
  return async (dispatch) => {
    try {
      const response = await loginService(user);

      if (response.statusCode !== 200) {
        notification.open({
          message: "Đăng nhập thất bại.",
          description: response.message,
        });
      } else {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        dispatch({
          type: types.LOGIN,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        });
      }
    } catch (error) {
      console.log(error?.message || error);
      notification.open({
        message: "Đăng nhập thất bại.",
        description: error?.message || error,
      });
    }
  };
};
export const logout = (onSuccess) => {
  return async (dispatch) => {
    dispatch({
      type: types.LOGOUT,
      onSuccess,
    });
  };
};
export const getProfile = () => {
  return async (dispatch) => {
    try {
      const response = await getProfileService();

      dispatch({
        type: types.GET_PROFILE,
        user: response.data,
      });
    } catch (error) {
      dispatch({
        type: types.LOGOUT,
      });
    }
  };
};
