import React, { useEffect, useState, useRef } from "react";
import MainLayout from "../../containers/MainLayout";
import {
  Modal,
  Table,
  Form,
  Pagination,
  Popconfirm,
  Row,
  Col,
  Button,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckSquareOutlined,
  EyeOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { formatTime, formatMoney } from "../../common/common";
import {
  changeStatusOrder,
  detailOrder,
  listOrder,
} from "../../redux/actions/order.action";
import { OrderStatus, OrderStatusEnum } from "./order-status.const";
import { ROOT_URL } from "../../constants/config";
import { useReactToPrint } from "react-to-print";
import Search from "antd/lib/input/Search";
export default function Order() {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState({ page: 1 });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(listOrder(filters));
  }, [dispatch, filters]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Người mua",
      dataIndex: "user",

      render: (record) => record.fullname,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",

      render: (record) => OrderStatus[record],
    },
    {
      title: "Tổng giá trị",

      render: (record) => {
        const totalMoney = record.orderDetails.reduce((total, item) => {
          return (
            total +
            (item?.orderPrice || item?.salePrice || item?.price) * item.quantity
          );
        }, 0);
        return formatMoney(
          (totalMoney * (100 - record.coupon.value || 0)) / 100
        );
      },
    },
    {
      title: "Tổng số lượng",
      dataIndex: "orderDetails",
      render: (record) => `${record.length} sản phẩm`,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (record) => formatTime(record),
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "id",
      render: (item) => {
        return (
          <>
            <EyeOutlined
              style={{
                cursor: "pointer",
                paddingRight: 10,
              }}
              onClick={() => showModalDetail(item?.id)}
            />
            {item.status !== OrderStatusEnum.SUCCESS &&
            item.status !== OrderStatusEnum.REJECT ? (
              <Popconfirm
                title="Bạn có muốn thay đổi trạng thái?"
                onConfirm={() => handleChangeStatus(item, false)}
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
            ) : (
              <></>
            )}
            {item.status === OrderStatusEnum.WAITING_CONFIRM ? (
              <Popconfirm
                title="Bạn có muốn huỷ đơn hàng?"
                onConfirm={() => handleChangeStatus(item, true)}
                okText="Có"
                cancelText="Không"
              >
                <MinusCircleOutlined
                  style={{
                    cursor: "pointer",
                    paddingRight: 10,
                  }}
                />
              </Popconfirm>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];

  const columnsDetail = [
    {
      title: "Mã sản phẩm",
      dataIndex: "itemId",
    },
    {
      title: "Ảnh",
      render: (record) => (
        <img
          src={`${ROOT_URL}/${record?.images[0]?.url}`}
          alt="ảnh sản phẩm"
          style={{ width: "100px" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "itemName",
    },
    {
      title: "Giá",
      render: (record) =>
        formatMoney(record.orderPrice || record.salePrice || record.price),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Thành tiền",

      render: (record) =>
        formatMoney(
          (record.orderPrice || record.salePrice || record.price) *
            record.quantity
        ),
    },
  ];

  const onChange = (page) => {
    setFilters({
      ...filters,
      page: page,
    });
  };
  const showModalDetail = (id) => {
    setVisible(true);
    dispatch(detailOrder(id));
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleChangeStatus = (item, isReject) => {
    let status;
    if (!isReject) {
      switch (item.status) {
        case OrderStatusEnum.WAITING_CONFIRM:
          status = OrderStatusEnum.CONFIRMED;
          break;
        case OrderStatusEnum.CONFIRMED:
          status = OrderStatusEnum.SHIPPING;
          break;
        case OrderStatusEnum.SHIPPING:
          status = OrderStatusEnum.RECEIVED;
          break;
        case OrderStatusEnum.RECEIVED:
          status = OrderStatusEnum.SUCCESS;
          break;
        default:
          break;
      }
    } else {
      status = OrderStatusEnum.REJECT;
    }

    dispatch(
      changeStatusOrder(item.id, { status }, () =>
        dispatch(listOrder(filters?.page))
      )
    );
  };
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
  });
  const handleSearch = (value) => setFilters({ ...filters, keyword: value });

  return (
    <MainLayout>
      <h2>Danh sách đơn hàng</h2>
      <Space style={{ marginBottom: 20 }}>
        <Search
          placeholder="Tìm kiếm...."
          onSearch={handleSearch}
          style={{ width: 300, height: "40px" }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={state.order.items}
        pagination={false}
      />
      <Pagination
        style={{ marginTop: 10, float: "right" }}
        current={filters?.page}
        total={state.order.meta.total}
        onChange={onChange}
      />

      <Modal
        title="Chi tiết đơn hàng"
        visible={visible}
        onCancel={handleCancel}
        footer={false}
        width={1000}
      >
        <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <div
            ref={componentRef}
            style={{
              padding: 20,
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Cửa hàng:"
                  name="categoryId"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  <b>Shop Xwatch</b>
                </Form.Item>
                <Form.Item
                  label="Mã đơn hàng:"
                  name="categoryId"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  #{state.order.item?.id}
                </Form.Item>
                <Form.Item
                  label="Trạng thái đơn hàng:"
                  name="categoryId"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {OrderStatus[state.order.item?.status]}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Người mua:"
                  name="name"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {state.order.item?.user?.fullname}
                </Form.Item>
                <Form.Item
                  label="Số điện thoại:"
                  name="name"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {state.order.item?.phone}
                </Form.Item>
                <Form.Item
                  label="Địa chỉ:"
                  name="name"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {state.order.item?.address}
                </Form.Item>
              </Col>
              <Col span={24}>
                <h3>Danh sách sản phẩm</h3>
                <Table
                  columns={columnsDetail}
                  dataSource={state.order.item.orderDetails}
                  pagination={false}
                />
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  label="Tổng số tiền:"
                  name="name"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {formatMoney(
                    state.order.item?.orderDetails?.reduce((total, item) => {
                      return (
                        total +
                        (item?.orderPrice || item?.salePrice || item?.price) *
                          item.quantity
                      );
                    }, 0)
                  )}
                </Form.Item>
                <Form.Item
                  label="Mã giảm giá:"
                  name="name"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {state.order.item?.coupon?.id
                    ? `${state.order.item?.coupon?.code} - Giảm ${state.order.item?.coupon?.value}%`
                    : "Không"}
                </Form.Item>
                <Form.Item
                  label="Thanh toán:"
                  name="name"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {formatMoney(
                    (state.order.item?.orderDetails?.reduce((total, item) => {
                      return (
                        total +
                        (item?.orderPrice || item?.salePrice || item?.price) *
                          item.quantity
                      );
                    }, 0) *
                      (100 - state.order.item?.coupon?.value || 0)) /
                      100
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ float: "right" }}>
              <Form.Item
                wrapperCol={{ offset: 20, span: 16, marginTop: "20px" }}
              >
                <Button type="primary" onClick={handlePrint}>
                  In hoá đơn
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </MainLayout>
  );
}
