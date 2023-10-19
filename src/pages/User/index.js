import React, { useEffect, useState } from "react";
import MainLayout from "../../containers/MainLayout";
import { Table, Pagination, Switch, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { formatTime } from "../../common/common";
import { UserStatus } from "./user-status.const";
import { listUser, updateUser } from "../../redux/actions/user.action";
import Search from "antd/lib/input/Search";

export default function User() {
  const [filters, setFilters] = useState({ page: 1 });
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(listUser(filters));
  }, [dispatch, filters]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Họ tên",
      dataIndex: "fullname",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",

      render: (record) => UserStatus[record],
    },
    {
      title: "Quyền",
      dataIndex: "role",

      render: (record, row) => (
        <Switch
          checkedChildren="Admin"
          unCheckedChildren="User"
          checked={+record === 1 ? true : false}
          onChange={(checked) => {
            dispatch(
              updateUser(row.id, { role: checked ? 1 : 0 }, () =>
                dispatch(listUser(filters))
              )
            );
          }}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
      render: (record, row) => (
        <Switch
          checkedChildren="Hoạt động"
          unCheckedChildren="Bị khoá"
          checked={+record === 1 ? true : false}
          onChange={(checked) => {
            dispatch(
              updateUser(row.id, { isActive: checked ? 1 : 0 }, () =>
                dispatch(listUser(filters))
              )
            );
          }}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
      render: (record) => formatTime(record),
    },
  ];

  const onChange = (page) => {
    setFilters({
      ...filters,
      page: page,
    });
  };
  const handleSearch = (value) => setFilters({ ...filters, keyword: value });

  return (
    <MainLayout>
      <h2>Danh sách người dùng</h2>
      <Space style={{ marginBottom: 20 }}>
        <Search
          placeholder="Tìm kiếm...."
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={state.user.items}
        pagination={false}
      />
      <Pagination
        style={{ marginTop: 10, float: "right" }}
        current={filters?.page}
        total={state.user.meta.total}
        onChange={onChange}
      />
    </MainLayout>
  );
}
