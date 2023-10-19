import React from "react";
import { Form, Input, Button, Checkbox, Card } from "antd";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/auth.action";
import { Navigate } from "react-router";

export default function Login() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth);

  const onFinish = (values) => {
    console.log("Success:", values);
    dispatch(
      login({
        phone: values.username,
        password: values.password,
      })
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (state.token) return <Navigate to="/dashboard" />;

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url('https://png.pngtree.com/background/20210710/original/pngtree-quartz-watch-promotion-season-atmospheric-black-banner-picture-image_1047997.jpg')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Card className="login-form">
        <div className="header">
          <img
            src="https://xwatch.vn/images/config/logo-xwatch-216-62_1616143160.png"
            height="48px"
            alt="Đăng nhập"
            style={{
              backgroundColor: "black",
              width: "300px",
              height: "60px",
            }}
          />
          <h1>ĐĂNG NHẬP</h1>
        </div>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tài khoản"
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tài khoản.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Nhớ tài khoản</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
