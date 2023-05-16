import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  Typography,
} from "antd";
import Head from "next/head";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { BillingAddress, LineItem, Order } from "@/interfaces/order";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { PageProps } from "@/interfaces";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import useInitiateShipment from "@/hooks/useInitiateShipment";
import useCreateShipment from "@/hooks/useCreateShipment";
import useGetOrders from "@/hooks/useGetOrders";
import isEUCountry from "@/utils/isEUCountry";

interface FormData {
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

const { useForm } = Form;
const { Title, Text } = Typography;

export default withPageAuthRequired(function Orders(props: PageProps) {
  const { notificationApi } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToSend, setOrderToSend] = useState<Order>();
  const [form] = useForm<FormData>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50],
  });

  const { data: orders, isLoading: isOrdersLoading } = useGetOrders();

  const { mutate: initiateShipment, isLoading: isInitiateShipmentLoading } =
    useInitiateShipment(notificationApi, () => setIsModalOpen(false));

  const { mutate: createOrder, isLoading: isCreateOrderLoading } =
    useCreateShipment(notificationApi, (data) =>
      initiateShipment([data.id ?? ""])
    );

  const handleSendOrderClick = (record: Order) => {
    setIsModalOpen(true);
    setOrderToSend(record);
  };

  const handlePagination = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Nr.",
      dataIndex: "order_number",
    },
    {
      title: "Data",
      dataIndex: "created_at",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:MM"),
    },
    {
      title: "Užsakovas",
      dataIndex: "billing_address",
      render: (billingAddress: BillingAddress) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Text>{`Vardas: ${billingAddress.name}`}</Text>
            <Text>{`Šalis: ${billingAddress.country}`}</Text>
          </div>
        );
      },
    },
    {
      title: "Prekės",
      dataIndex: "line_items",
      render: (lineItems: LineItem[]) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {lineItems.map((lineItem) => {
              return <Text key={lineItem.id}>{lineItem.title}</Text>;
            })}
          </div>
        );
      },
    },
    {
      title: "Suma",
      dataIndex: "total_price",
      render: (value, record) => {
        return `${value} ${record.currency}`;
      },
    },
    {
      title: "Veiksmai",
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

  const onFinish = (values: FormData) => {
    if (orderToSend) {
      const cn22Form = {
        cn22Form: {
          parcelType: "Sell",
          cnParts: orderToSend.line_items.map((item) => ({
            amount: item.price,
            countryCode: "LT",
            currencyCode: "EUR",
            weight: item.grams / 1000,
            quantity: item.quantity,
            summary: item.title,
          })),
        },
      };

      createOrder({
        template: 74,
        partCount: 1,
        receiver: {
          address: {
            country: values.country,
            postalCode: values.postalCode,
            locality: values.locality,
            address1: values.address1,
          },
          name: values.name,
          phone: values.phone,
        },
        sender: {
          address: {
            address1: "Adresas",
            country: "LT",
            postalCode: "49345",
            locality: "Kaunas",
          },
          email: "martynas.survila@stud.vdu.lt",
          name: "Mart Surv",
          phone: "+37060000000",
        },
        documents: isEUCountry(orderToSend.shipping_address.country_code)
          ? {}
          : cn22Form,
        weight: 50,
      });
    }
  };

  useEffect(() => {
    if (orderToSend) {
      form.setFieldsValue({
        name: orderToSend.shipping_address.name,
        email: orderToSend.email,
        phone: orderToSend.shipping_address.phone,
        address1: orderToSend.shipping_address.address1,
        address2: orderToSend.shipping_address.address2,
        postalCode: orderToSend.shipping_address.zip,
        locality: orderToSend.shipping_address.city,
        country: orderToSend.shipping_address.country_code,
        weight: orderToSend.total_weight,
      });
    }
  }, [form, orderToSend]);

  return (
    <>
      <Head>
        <title>Užsakymai</title>
      </Head>
      <Title>Užsakymai</Title>
      <Table
        columns={columns}
        dataSource={orders ?? []}
        loading={isOrdersLoading}
        rowKey="id"
        pagination={pagination}
        onChange={(pagination) => handlePagination(pagination)}
      />
      <Modal
        title="Sukurti Siuntą"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
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
            rules={[{ required: true, message: "El. paštas privalomas" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tel. numeris"
            name="phone"
            rules={[{ required: true, message: "Tel. numeris privalomas" }]}
          >
            <Input />
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
          <div style={{ display: "flex", gap: 8 }}>
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
              rules={[{ required: true, message: "Pašto kodas privalomas" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Šalies kodas"
              name="country"
              rules={[{ required: true, message: "Šalies kodas privalomas" }]}
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item label="Siuntos svoris, g" name="weight">
            <InputNumber className="w-100" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreateOrderLoading || isInitiateShipmentLoading}
            >
              Sukurti
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});
