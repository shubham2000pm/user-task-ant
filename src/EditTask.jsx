import React, { useEffect, useState } from "react";
import { Form, Input, Checkbox, Button, message } from "antd";

const EditTask = ({ taskData, onEdit, onCancel, form }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.success(`Task ID ${taskData.id} Updated Successfully`);
  };
  useEffect(() => {
    form.setFieldsValue(taskData);
  }, [form, taskData]);

  const handleEdit = () => {
    form
      .validateFields()
      .then((values) => {
        onEdit(values);
        success();
      })
      .catch((errorInfo) => {
        console.log("Error:", errorInfo);
      });
  };

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical">
        <Form.Item label="User ID" name="userId">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Task ID" name="id">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Task Title"
          name="title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Task Status" name="completed" valuePropName="checked">
          <Checkbox>
            <span style={{ marginLeft: 3 }}>Completed</span>
          </Checkbox>
        </Form.Item>
        <Button type="primary" onClick={handleEdit}>
          Save Changes
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form>
    </>
  );
};

export default EditTask;
