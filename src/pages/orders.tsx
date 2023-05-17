import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  Table,
  Typography,
  message,
} from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import Head from "next/head";
import { RangeValue } from "rc-picker/lib/interface";
import { useEffect, useState } from "react";

import CreateShipmentForm, {
  CreateShipmentFormData,
} from "@/components/CreateShipmentForm/CreateShipmentForm";
import useCreateShipment from "@/hooks/useCreateShipment";
import useGetLocations from "@/hooks/useGetLocations";
import useGetOrders from "@/hooks/useGetOrders";
import useInitiateShipment from "@/hooks/useInitiateShipment";
import { PagePropsWithAuth } from "@/interfaces";
import { FinancialStatus } from "@/interfaces/order";
import { Order } from "@/interfaces/order";
import isEUCountry from "@/utils/isEUCountry";
import ordersColumns from "@/utils/ordersColumns";

export default withPageAuthRequired(function Orders(props: PagePropsWithAuth) {
  let successfullyCreatedShipmentsCount = 0;
  const { notificationApi, user } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToSend, setOrderToSend] = useState<Order>();
  const [form] = Form.useForm<CreateShipmentFormData>();
  const [selectedOrdersIds, setSelectedOrdersIds] = useState<string[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<FinancialStatus>();
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

  const { data: orders, isFetching: isOrdersLoading } = useGetOrders(
    dateRange?.[0]?.format("YYYY-MM-DD"),
    dateRange?.[1]?.add(1, "day").format("YYYY-MM-DD"),
    selectedStatus
  );
  const {
    mutateAsync: initiateShipmentAsync,
    isLoading: isInitiateShipmentLoading,
  } = useInitiateShipment(notificationApi, () => setIsModalOpen(false));
  const { mutateAsync: createShipmentAsync, isLoading: isCreateOrderLoading } =
    useCreateShipment(notificationApi);
  const { data: locations } = useGetLocations();

  const bussinessLocation = locations?.find(
    (location) => location.name === "Default"
  );

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

  const createMultipleShipments = async () => {
    messageApi.open({
      key: 1,
      type: "loading",
      content: <div>Vykdomas siuntų formavimas ir inicijavimas</div>,
      duration: 0,
    });

    for (const order of selectedOrders) {
      await createShipment(undefined, order);
    }

    messageApi.destroy(1);
    message.open({
      key: 2,
      type: "info",
      content: (
        <div>
          <Typography.Text>
            Siuntų formavimas ir inicijavimas baigtas
          </Typography.Text>
          <br />
          <br />
          <Typography.Text>Sėkmingai suformuota siuntų: </Typography.Text>
          <Typography.Text strong>
            {successfullyCreatedShipmentsCount}
          </Typography.Text>
          <br />
          Nesėkmingai suformuota siuntų:
          <Typography.Text strong>
            {selectedOrders.length - successfullyCreatedShipmentsCount}
          </Typography.Text>
        </div>
      ),
      duration: 0,
      onClose: () => messageApi.destroy(2),
    });
  };

  const createShipment = async (
    values: CreateShipmentFormData | undefined,
    orderToSend?: Order
  ) => {
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

      try {
        const shipmentData = await createShipmentAsync({
          template: 74,
          partCount: 1,
          receiver: {
            address: {
              country:
                values?.country || orderToSend.shipping_address.country_code,
              postalCode:
                values?.postalCode || orderToSend.shipping_address.zip,
              locality: values?.locality || orderToSend.shipping_address.city,
              address1:
                values?.address1 || orderToSend.shipping_address.address1,
            },
            name: values?.name || orderToSend.shipping_address.name,
            phone: values?.phone || orderToSend.shipping_address.phone,
            email: values?.email || orderToSend.email,
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
        });
        await initiateShipmentAsync([shipmentData.id ?? ""]);
        successfullyCreatedShipmentsCount += 1;
      } catch (e) {
        console.log(e);
      }
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
      {contextHolder}
      <Head>
        <title>Užsakymai</title>
      </Head>
      <Typography.Title>Užsakymai</Typography.Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <DatePicker.RangePicker
            style={{ alignSelf: "flex-start" }}
            format={"YYYY-MM-DD"}
            value={dateRange}
            onCalendarChange={handleDateChange}
          />
          <Select
            allowClear
            placeholder="Statusas"
            style={{ width: 150 }}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            options={[
              { value: FinancialStatus.AUTHORIZED, label: "Authorized" },
              { value: FinancialStatus.EXPIRED, label: "Expired" },
              { value: FinancialStatus.PAID, label: "Paid" },
              {
                value: FinancialStatus.PARTIALLY_PAID,
                label: "Partially Paid",
              },
              {
                value: FinancialStatus.PARTIALLY_REFUNDED,
                label: "Partially Refunded",
              },
              { value: FinancialStatus.PENDING, label: "Pending" },
              { value: FinancialStatus.REFUNDED, label: "Refunded" },
              { value: FinancialStatus.UNPAID, label: "Unpaid" },
              { value: FinancialStatus.VOIDED, label: "Voided" },
            ]}
          />
          <Button
            disabled={selectedOrdersIds.length === 0}
            type="primary"
            // loading={isStickerLoading}
            onClick={() => createMultipleShipments()}
          >
            {`Siųsti siuntas (${selectedOrdersIds.length})`}
          </Button>
        </div>
        <Table
          columns={ordersColumns(handleSendOrderClick)}
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
          onFinish={(values) => createShipment(values, orderToSend)}
        />
      </Modal>
    </>
  );
});
