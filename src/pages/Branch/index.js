import React, { useEffect, useState } from "react";
import MainLayout from "../../containers/MainLayout";
import {
  Button,
  Modal,
  Table,
  Form,
  Input,
  Upload,
  Pagination,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createBranch,
  deleteBranch,
  detailBranch,
  listBranch,
  updateBranch,
} from "../../redux/actions/branch.action";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formatTime } from "../../common/common";
import { BASE_URL } from "../../constants/config";
import Search from "antd/lib/input/Search";

export default function Branch() {
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [filters, setFilters] = useState({ page: 1 });
  const [mode, setMode] = useState();
  const [images, setImages] = useState([]);
  const [id, setId] = useState();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.branch);

  useEffect(() => {
    dispatch(listBranch(filters));
  }, [dispatch, filters]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
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
        return (
          <>
            <DeleteOutlined
              style={{
                cursor: "pointer",
                paddingRight: 10,
              }}
              onClick={() => onClickDelete(item?.id)}
            />
            <EditOutlined
              style={{
                cursor: "pointer",
              }}
              onClick={() => showModalUpdate(item.id)}
            />
          </>
        );
      },
    },
  ];

  const onChange = (page) => {
    setFilters({
      ...filters,
      page: page,
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      name: state.item.name,
      description: state.item.description,
      images: state.item.logo,
    });

    setImages([
      {
        uid: "-1",
        name: state.item.logo,
        status: "done",
        url: `${BASE_URL}/${state.item.logo}`,
        thumbUrl: `${BASE_URL}/${state.item.logo}`,
      },
    ]);
  }, [form, state.item]);

  const showModal = () => {
    form.resetFields();
    setMode("CREATE");
    setImages([]);
    setVisible(true);
  };

  const showModalUpdate = (id) => {
    setId(id);
    setMode("UPDATE");
    setVisible(true);
    dispatch(detailBranch(id));
  };

  const showTitle = (mode) => {
    switch (mode) {
      case "CREATE":
        return "Tạo mới thương hiệu";
      case "UPDATE":
        return "Cập nhật thương hiệu";
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
  const onClickDelete = (id) => {
    setVisibleDelete(true);
    setId(id);
  };
  const handleCancel = () => {
    setVisible(false);
    setVisibleDelete(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    switch (mode) {
      case "CREATE":
        dispatch(createBranch(values, () => dispatch(listBranch(filters))));
        break;
      case "UPDATE":
        dispatch(updateBranch(id, values, () => dispatch(listBranch(filters))));
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

  const onChangeFileList = ({ fileList: newFileList }) => {
    setImages(newFileList);
  };
  const confirmDelete = () => {
    dispatch(
      deleteBranch(id, () => {
        dispatch(listBranch(filters));
        setVisibleDelete(false);
      })
    );
  };
  const props = {
    action: `${BASE_URL}/api`,
    listType: "picture",
    beforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = document.createElement("img");
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(resolve);
          };
        };
      });
    },
  };
  const handleSearch = (value) => setFilters({ ...filters, keyword: value });

  return (
    <MainLayout>
      <h2>Danh sách thương hiệu</h2>
      <Space style={{ marginBottom: 20 }}>
        <Search
          placeholder="Tìm kiếm...."
          onSearch={handleSearch}
          style={{ width: 300 }}
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
          <Form.Item label="Ảnh đại điện" name="images">
            <Upload
              {...props}
              fileList={images}
              onChange={onChangeFileList}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Tên thương hiệu"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: false }]}
          >
            <Input />
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
