import React, { useEffect, useState } from "react";
import MainLayout from "../../containers/MainLayout";
import {
  Button,
  Modal,
  Space,
  Table,
  Form,
  Input,
  Pagination,
  Popconfirm,
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmCoupon,
  createCoupon,
  deleteCoupon,
  detailCoupon,
  listCoupon,
  updateCoupon,
} from "../../redux/actions/coupon.action";
import {
  DeleteOutlined,
  EditOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { formatTime } from "../../common/common";
import { CouponStatusEnum } from "./coupon-status.constant";
import Search from "antd/lib/input/Search";

export default function Coupon() {
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [filters, setFilters] = useState({ page: 1 });
  const [mode, setMode] = useState();
  const [id, setId] = useState();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.coupon);

  useEffect(() => {
    dispatch(listCoupon(filters));
  }, [dispatch, filters]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Mã giảm giá",
      dataIndex: "code",
    },
    {
      title: "Số lượng",
      dataIndex: "planQuantity",
    },
    {
      title: "Số lượng đã sử dụng",
      dataIndex: "actualQuantity",
    },
    {
      title: "Giảm (%)",
      dataIndex: "value",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",

      render: (record) => formatTime(record),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",

      render: (record) => formatTime(record),
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "id",
      render: (item) => {
        return item.status === CouponStatusEnum.WaitingConfirm ? (
          <>
            <DeleteOutlined
              style={{
                cursor: "pointer",
                paddingRight: 10,
              }}
              onClick={() => onClickDelete(id)}
            />

            <Popconfirm
              title="Bạn có muốn thay đổi trạng thái?"
              onConfirm={() => handleConfirmCoupon(item)}
              okText="Có"
              cancelText="Không"
            >
              <CheckSquareOutlined
                style={{
                  cursor: "pointer",
                  paddingRight: 10,
                }}
              />
            </Popconfirm>
            <EditOutlined
              style={{
                cursor: "pointer",
              }}
              onClick={() => showModalUpdate(item.id)}
            />
          </>
        ) : (
          <>Đã xác nhận</>
        );
      },
    },
  ];
  const handleConfirmCoupon = (item) => {
    dispatch(confirmCoupon(item.id, () => dispatch(listCoupon(filters))));
  };
  const onChange = (page) => {
    setFilters({
      ...filters,
      page: page,
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      code: state.item.code,
      planQuantity: state.item.planQuantity,
      value: state.item.value,
    });
  }, [form, state.item]);

  const showModal = () => {
    form.resetFields();
    setMode("CREATE");
    setVisible(true);
  };

  const showModalUpdate = (id) => {
    setId(id);
    setMode("UPDATE");
    setVisible(true);
    dispatch(detailCoupon(id));
  };

  const showTitle = (mode) => {
    switch (mode) {
      case "CREATE":
        return "Tạo mới coupon";
      case "UPDATE":
        return "Cập nhật coupon";
      default:
        break;
    }
  };

  const showLableButton = (mode) => {
    switch (mode) {
      case "CREATE":
        return "Tạo mới";
      case "UPDATE":
        return "Cập nhật";
      default:
        break;
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setVisibleDelete(false);
    form.resetFields();
  };
  const onClickDelete = (id) => {
    setVisibleDelete(true);
    setId(id);
  };
  const confirmDelete = () => {
    dispatch(
      dispatch(
        deleteCoupon(id, () => {
          dispatch(listCoupon(filters));
          setVisibleDelete(false);
        })
      )
    );
  };
  const onFinish = (values) => {
    switch (mode) {
      case "CREATE":
        dispatch(createCoupon(values, () => dispatch(listCoupon(filters))));
        break;
      case "UPDATE":
        dispatch(updateCoupon(id, values, () => dispatch(listCoupon(filters))));
        break;
      default:
        break;
    }

    setVisible(false);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleSearch = (value) => setFilters({ ...filters, keyword: value });

  return (
    <MainLayout>
      <h2>Danh sách mã giảm giá</h2>
      <Space style={{ marginBottom: 20 }}>
        <Search
          placeholder="Tìm kiếm...."
          onSearch={handleSearch}
          style={{ width: 300, height: "40px" }}
        />
      </Space>
      <Space style={{ marginBottom: 20, float: "right" }}>
        <Button value="default" onClick={showModal}>
          Tạo mới
        </Button>
      </Space>
      <Modal
        title={showTitle(mode)}
        visible={visible}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã giảm giá" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="planQuantity"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lượng",
                type: "number",
                min: 1,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Giá trị"
            name="value"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá trị",
                type: "number",
                min: 0,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {showLableButton(mode)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* modal delete*/}
      <Modal
        // title="Bạn có chắc chắn muốn xoá bản ghi này không?"
        visible={visibleDelete}
        okText="Có"
        cancelText="Không"
        onOk={confirmDelete}
        onCancel={handleCancel}
      >
        <h2 style={{ marginTop: "20px" }}>
          Bạn có chắc chắn muốn xoá bản ghi này không?
        </h2>
      </Modal>
      <Table columns={columns} dataSource={state.items} pagination={false} />
      <Pagination
        style={{ marginTop: 10, float: "right" }}
        current={filters?.page}
        total={state.meta.total}
        onChange={onChange}
      />
    </MainLayout>
  );
}
