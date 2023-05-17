import { Button, TableColumnsType, Typography } from "antd";
import dayjs from "dayjs";

import { BillingAddress, LineItem, Order } from "@/interfaces/order";

const ordersColumns = (
  handleSendOrderClick: (record: Order) => void
): TableColumnsType<Order> => [
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
          <Typography.Text>{`${billingAddress.name}`}</Typography.Text>
          <Typography.Text>{`${record.email}`}</Typography.Text>
          <Typography.Text>{`${billingAddress.phone}`}</Typography.Text>
          <Typography.Text>{`${billingAddress.address1}`}</Typography.Text>
          <Typography.Text>{`${billingAddress.city}, ${billingAddress.zip}, ${billingAddress.country_code}`}</Typography.Text>
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
            return (
              <Typography.Text key={lineItem.id}>
                {lineItem.title}
              </Typography.Text>
            );
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
      <Typography.Text style={{ textTransform: "capitalize" }}>
        {value}
      </Typography.Text>
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

export default ordersColumns;
