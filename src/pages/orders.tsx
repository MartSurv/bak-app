import GetOrders from "@/internalApi/GetOrders";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, Table } from "antd";
import Head from "next/head";
import type { ColumnsType } from "antd/es/table";
import { BillingAddress, LineItem, Order } from "@/interfaces/order";
import { useState } from "react";

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToSend, setOrderToSend] = useState<Order>();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => GetOrders(),
  });

  if (!orders) {
    return null;
  }

  const handleSendOrderClick = (record: Order) => {
    setIsModalOpen(true);
    setOrderToSend(record);
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Užsakymo Nr.",
      dataIndex: "order_number",
    },
    { title: "Data", dataIndex: "created_at" },
    {
      title: "UŽSAKOVAS",
      dataIndex: "billing_address",
      render: (billingAddress: BillingAddress) => {
        return (
          <div className="d-flex flex-column">
            <span>{`Vardas: ${billingAddress.name}`}</span>
            <span>{`Šalis: ${billingAddress.country}`}</span>
          </div>
        );
      },
    },
    {
      title: "PREKĖ - KAINA",
      dataIndex: "line_items",
      render: (lineItems: LineItem[]) => {
        return (
          <div className="d-flex flex-column">
            {lineItems.map((lineItem) => {
              return (
                <span
                  key={lineItem.id}
                >{`${lineItem.name} - ${lineItem.price} ${lineItem.price_set.shop_money.currency_code}`}</span>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Button type="primary" onClick={() => handleSendOrderClick(record)}>
            Sukurti Siuntą
          </Button>
        );
      },
    },
  ];

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  return (
    <>
      <Head>
        <title>Užsakymai</title>
      </Head>
      <h1>Užsakymai</h1>
      <Table columns={columns} dataSource={orders ?? []} loading={isLoading} rowKey="id" />
      <Modal
        title="Sukurti Siuntą"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          name="shipment-form"
          initialValues={{ name: orderToSend?.shipping_address.name }}
          layout="vertical"
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Gavėjas" name="name" rules={[{ required: true, message: "" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="El. paštas" name="email" rules={[{ required: true, message: "" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Adresas" name="address1" rules={[{ required: true, message: "" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Papildomas adresas" name="address2">
            <Input />
          </Form.Item>
          <div className="d-flex gap-2">
            <Form.Item label="Miestas" name="city" rules={[{ required: true, message: "" }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Pašto kodas"
              name="postalCode"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Šalies kodas"
              name="country"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Valstija" name="state">
              <Input />
            </Form.Item>
          </div>
          <Form.Item label="Siuntos svoris, g" name="weight">
            <InputNumber className="w-100" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Sukurti
            </Button>
          </Form.Item>
        </Form>
        {/* <div className="d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <div>
              <label>Valstija</label>
              <Input />
            </div>
          </div>
          <div className="d-flex gap-2">
            <div>
              <label>
                <span className="text-danger">*</span> Siuntos svoris, g
              </label>
              <Input />
            </div>
            <div>
              <label>
                <span className="text-danger">*</span> Siuntos dydis
              </label>
              <Input />
            </div>
          </div>
        </div> */}
      </Modal>
    </>
  );
}
