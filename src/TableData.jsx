import React, { useEffect, useState } from "react";
import { Form, Table, Button, Modal, message } from "antd";
import axios from "axios";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import EditTask from "./EditTask";
import Search from "./Search";

const TableData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editTaskVisible, setEditTaskVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const success = (taskId) => {
    messageApi.success(`Task ID ${taskId} Deleted Successfully`);
  };

  const [currentPage, setCurrentPage] = useState({
    page: 1,
    pageSize: 10,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/todos`
      );

      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (pagination) => {
    setCurrentPage({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleEdit = async (editedData) => {
    setData((prevData) =>
      prevData.map((task) =>
        task.id === selectedTask.id ? { ...task, ...editedData } : task
      )
    );

    setFilteredData((prevData) =>
      prevData.map((task) =>
        task.id === selectedTask.id ? { ...task, ...editedData } : task
      )
    );

    setEditTaskVisible(false);
  };

  const handleDelete = async (taskId) => {
    setData((prevData) => prevData.filter((task) => task.id !== taskId));
    setFilteredData((prevData) =>
      prevData.filter((task) => task.id !== taskId)
    );
    success(taskId);
  };

  const info = (selectedTask) => {
    Modal.info({
      title: "User Details",
      content: (
        <div>
          {selectedTask && (
            <>
              <p>
                <b>User ID:{"  "}</b> {selectedTask.userId}
              </p>
              <p>
                <b>Task ID:{"  "}</b> {selectedTask.id}
              </p>
              <p>
                <b>Task Title:{"  "}</b> {selectedTask.title}
              </p>
              <p>
                <b>Task Status:</b>
                {selectedTask.completed ? " Completed" : " Not Completed"}
              </p>
            </>
          )}
        </div>
      ),
      onOk() {},
    });
  };

  const getConfirmDelete = (taskId) => {
    Modal.confirm({
      title: "Confirmation!",
      content: (
        <>
          <div style={{ textTransform: "capitalize" }}>
            Do you want to delete the task ID {taskId} ?
          </div>
        </>
      ),
      onOk: () => handleDelete(taskId),
    });
  };

  const columns = [
    {
      title: <b>S.NO</b>,
      render: (text, record, index) =>
        (currentPage.page - 1) * currentPage.pageSize + index + 1,
    },

    {
      title: <b>Task ID</b>,
      dataIndex: "id",
      key: "id",
    },
    {
      title: <b>Task Title</b>,
      dataIndex: "title",
      key: "title",
    },
    {
      title: <b>Task Status</b>,
      dataIndex: "completed",
      key: "completed",
      render: (text) => (text === true ? "Completed" : "Not completed"),
    },
    {
      title: <b>Actions</b>,
      render: (_, record) => (
        <div className="container">
          <Button
            type="primary"
            shape="circle"
            style={{ marginInlineEnd: "2em" }}
            onClick={() => {
              info(record);
            }}
          >
            <EyeOutlined />
          </Button>
          <Button
            type="primary"
            style={{ marginInlineEnd: "2em" }}
            onClick={() => {
              setSelectedTask(record);
              setEditTaskVisible(true);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              getConfirmDelete(record.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <div className="container">
        <div
          className="heading"
          style={{ textAlign: "center", fontFamily: "serif" }}
        >
          <h1> User Task Data</h1>
          <Search data={data} setFilteredData={setFilteredData} />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          onChange={handlePageChange}
          rowKey={"id"}
          pagination={{
            showQuickJumper: true,
            total: filteredData.length,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: true }}
        />

        <Modal
          title="Edit Task"
          open={editTaskVisible}
          onCancel={() => {
            setEditTaskVisible(false);
            form.setFieldsValue(selectedTask);
          }}
          footer={null}
        >
          <EditTask
            onCancel={() => {
              setEditTaskVisible(false);
              form.setFieldsValue(selectedTask);
            }}
            taskData={selectedTask}
            onEdit={handleEdit}
            form={form}
          />
        </Modal>
      </div>
    </>
  );
};

export default TableData;
