import { Collapse, Form, FormInstance, Input, Table } from "antd";

import { Order } from "@/interfaces/order";
import isEUCountry from "@/utils/isEUCountry";

export interface CreateShipmentFormData {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string | null;
  locality: string;
  postalCode: string;
  country: string;
  weight: number;
}

interface CreateShipmentFormProps {
  orderToSend: Order | undefined;
  form: FormInstance<CreateShipmentFormData>;
  onFinish: (values: CreateShipmentFormData) => Promise<void>;
}

export default function CreateShipmentForm(props: CreateShipmentFormProps) {
  const { orderToSend, form, onFinish } = props;
  return (
    <Form
      form={form}
      name="shipment-form"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Gavėjas"
        name="name"
        rules={[{ required: true, message: "Gavėjas privalomas" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="El. paštas"
        name="email"
        rules={[
          { required: true, message: "El. paštas privalomas" },
          {
            pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Netinkamas el. pašto formatas",
          },
          { max: 254, message: "Netinkamas el. pašto formatas" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Tel. numeris"
        name="phone"
        rules={[
          { required: true, message: "Tel. numeris privalomas" },
          {
            pattern: /^\+(?:[0-9] ?){6,14}[0-9]$/,
            message: "Netinkamas tel. numerio formatas",
          },
        ]}
      >
        <Input placeholder="+37060000000" />
      </Form.Item>
      <Form.Item
        label="Adresas"
        name="address1"
        rules={[{ required: true, message: "Adresas privalomas" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Papildomas adresas" name="address2">
        <Input />
      </Form.Item>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <Form.Item
          label="Miestas"
          name="locality"
          rules={[{ required: true, message: "Miestas privalomas" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Pašto kodas"
          name="postalCode"
          rules={[
            { required: true, message: "Pašto kodas privalomas" },
            {
              pattern: /^\d{5}(?:[-\s]\d{4})?$/,
              message: "Netinkamas pašto kodo formatas",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Šalies kodas"
          name="country"
          rules={[
            { required: true, message: "Šalies kodas privalomas" },
            {
              pattern: /^[A-Z]{2}$/,
              message: "Netinkamas šalies kodo formatas",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </div>
      {!isEUCountry(orderToSend?.shipping_address.country_code) && (
        <Form.Item>
          <Collapse>
            <Collapse.Panel header="CN22" key="1">
              <Table
                size="small"
                columns={[
                  { title: "Prekė", dataIndex: "title" },
                  { title: "Kiekis", dataIndex: "quantity" },
                  {
                    title: "Kaina",
                    dataIndex: "price",
                    render: (value) => `${value} EUR`,
                  },
                  {
                    title: "Svoris, kg",
                    dataIndex: "grams",
                    render: (value) => value / 1000,
                  },
                ]}
                dataSource={orderToSend?.line_items}
                rowKey="id"
                pagination={false}
              />
            </Collapse.Panel>
          </Collapse>
        </Form.Item>
      )}
    </Form>
  );
}
