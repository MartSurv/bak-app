import {
  Button,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Table,
  Typography,
} from "antd";
import Head from "next/head";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { BillingAddress, LineItem, Order } from "@/interfaces/order";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import useInitiateShipment from "@/hooks/useInitiateShipment";
import useCreateShipment from "@/hooks/useCreateShipment";
import useGetOrders from "@/hooks/useGetOrders";
import isEUCountry from "@/utils/isEUCountry";
import useGetLocations from "@/hooks/useGetLocations";
import { PagePropsWithAuth } from "@/interfaces";
import { RangeValue } from "rc-picker/lib/interface";
import CreateShipmentForm, {
  CreateShipmentFormData,
} from "@/components/CreateShipmentForm/CreateShipmentForm";

const { useForm } = Form;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const determineEndDate = (dateRange: RangeValue<dayjs.Dayjs>) => {
  if (
    dateRange &&
    dateRange?.[0]?.format("YYYY-MM-DD") ===
      dateRange?.[1]?.format("YYYY-MM-DD")
  ) {
    return "";
  }
  return dateRange?.[1]?.format("YYYY-MM-DD");
};

export default withPageAuthRequired(function Orders(props: PagePropsWithAuth) {
  const { notificationApi, user } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToSend, setOrderToSend] = useState<Order>();
  const [form] = useForm<CreateShipmentFormData>();
  const [selectedOrdersIds, setSelectedOrdersIds] = useState<string[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50],
  });
  const [dateRange, setDateRange] = useState<RangeValue<dayjs.Dayjs>>([
    dayjs(),
    dayjs(),
  ]);

  const { data: orders, isLoading: isOrdersLoading } = useGetOrders(
    dateRange ? dateRange[0]?.format("YYYY-MM-DD") : "",
    determineEndDate(dateRange)
  );

  const {
    mutate: initiateShipment,
    mutateAsync: initiateShipmentAsync,
    isLoading: isInitiateShipmentLoading,
  } = useInitiateShipment(notificationApi, () => setIsModalOpen(false));

  const { mutateAsync: createOrderAsync, isLoading: isCreateOrderLoading } =
    useCreateShipment(notificationApi);

  const { data: locations } = useGetLocations();

  const handleSendOrderClick = (record: Order) => {
    setIsModalOpen(true);
    setOrderToSend(record);
  };

  const handlePagination = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleDateChange = (values: RangeValue<dayjs.Dayjs>) => {
    if (values?.[0] && values?.[1]) {
      setDateRange([values[0], values[1]]);
    } else {
      setDateRange([dayjs(), dayjs()]);
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Nr.",
      dataIndex: "order_number",
    },
    {
      title: "Užsakymo data",
      dataIndex: "created_at",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:MM"),
    },
    {
      title: "Užsakovas",
      dataIndex: "billing_address",
      render: (billingAddress: BillingAddress, record) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Text>{`${billingAddress.name}`}</Text>
            <Text>{`${record.email}`}</Text>
            <Text>{`${billingAddress.phone}`}</Text>
            <Text>{`${billingAddress.address1}`}</Text>
            <Text>{`${billingAddress.city}, ${billingAddress.zip}, ${billingAddress.country_code}`}</Text>
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
      title: "Statusas",
      dataIndex: "financial_status",
      render: (value: string) => (
        <Text style={{ textTransform: "capitalize" }}>{value}</Text>
      ),
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

  const onFinish = async (values: CreateShipmentFormData) => {
    const bussinessLocation = locations?.find(
      (location) => location.name === "Default"
    );

    if (orderToSend && bussinessLocation && user.email && user.name) {
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

      await createOrderAsync({
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
          email: values.email,
        },
        sender: {
          address: {
            street: bussinessLocation.address1.split(".")[0],
            building: bussinessLocation.address1.split(".")[1],
            country: bussinessLocation.country_code,
            postalCode: bussinessLocation.zip,
            locality: bussinessLocation.city,
          },
          email: user.email,
          name: user.name,
          phone: bussinessLocation.phone,
        },
        documents: isEUCountry(orderToSend.shipping_address.country_code)
          ? {}
          : cn22Form,
        weight: 50,
      }).then((data) => initiateShipment([data.id ?? ""]));
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
      });
    }
  }, [form, orderToSend]);

  return (
    <>
      <Head>
        <title>Užsakymai</title>
      </Head>
      <Title>Užsakymai</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <RangePicker
            style={{ alignSelf: "flex-start" }}
            format={"YYYY-MM-DD"}
            value={dateRange}
            onCalendarChange={handleDateChange}
          />
          <Button
            disabled={selectedOrdersIds.length === 0}
            type="primary"
            // loading={isStickerLoading}
            // onClick={() => handleDownloadSticker(selectedShipmentIds)}
          >
            {`Siųsti siuntas (${selectedOrdersIds.length})`}
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={orders ?? []}
          loading={isOrdersLoading}
          rowKey="id"
          pagination={pagination}
          rowSelection={{
            type: "checkbox",
            onChange: (ids, selectedRows) => {
              setSelectedOrdersIds(ids as string[]);
              setSelectedOrders(selectedRows);
            },
            selectedRowKeys: selectedOrdersIds,
          }}
          onChange={(pagination) => handlePagination(pagination)}
        />
      </div>
      <Modal
        title="Sukurti Siuntą"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        footer={
          <div style={{ display: "flex", gap: 5 }}>
            <Button
              type="primary"
              loading={isCreateOrderLoading || isInitiateShipmentLoading}
              onClick={() => form.submit()}
            >
              Sukurti
            </Button>
            <Button type="primary" danger onClick={() => setIsModalOpen(false)}>
              Atšaukti
            </Button>
          </div>
        }
      >
        <CreateShipmentForm
          form={form}
          orderToSend={orderToSend}
          onFinish={onFinish}
        />
      </Modal>
    </>
  );
});
