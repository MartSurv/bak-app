import { UseMutateFunction } from "@tanstack/react-query";
import { Button, Collapse, Typography, Table } from "antd";
import { ColumnsType } from "antd/es/table";

import {
  Documents,
  Receiver,
  Shipment,
  ShipmentStatus,
} from "@/interfaces/lpexpress";

import isEUCountry from "./isEUCountry";

const shipmentsColumns = (
  isInitiateShipmentLoading: boolean,
  isStickerLoading: boolean,
  initiateShipment: UseMutateFunction<any, unknown, string[], unknown>,
  handleDownloadSticker: (ids: string[]) => Promise<void>
): ColumnsType<Shipment> => [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Sukūrimo data",
    dataIndex: "createdOn",
  },
  {
    title: "Gavėjas",
    dataIndex: "receiver",
    render: (value: Receiver) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <Typography.Text>{value.name}</Typography.Text>
        {value.email && <Typography.Text>{value.email}</Typography.Text>}
        {value.phone && <Typography.Text>{value.phone}</Typography.Text>}
        <Typography.Text>{value.address.address1}</Typography.Text>
        <Typography.Text>{`${value.address.locality}, ${value.address.postalCode}, ${value.address.country}`}</Typography.Text>
      </div>
    ),
  },
  {
    title: "Siuntėjas",
    dataIndex: "sender",
    render: (value: Receiver) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {value.email && <Typography.Text>{value.email}</Typography.Text>}
        {value.phone && <Typography.Text>{value.phone}</Typography.Text>}
        {value.address.street && value.address.building && (
          <Typography.Text>{`${value.address.street} ${value.address.building}`}</Typography.Text>
        )}
        <Typography.Text>{`${value.address.locality}, ${value.address.postalCode}, ${value.address.country}`}</Typography.Text>
      </div>
    ),
  },
  {
    title: "Siuntimo kaina",
    dataIndex: "price",
    render: (value) => {
      return (
        <Typography.Text>
          {value.amount} {value.currency}
        </Typography.Text>
      );
    },
  },
  {
    title: "Dokumentai",
    dataIndex: "documents",
    render: (value: Documents, record) => {
      if (!record.id || isEUCountry(record.receiver.address.country)) {
        return null;
      }
      return (
        <Collapse>
          <Collapse.Panel header="CN22" key={record.id}>
            <Table
              size="small"
              columns={[
                { title: "Prekė", dataIndex: "summary" },
                { title: "Kiekis", dataIndex: "quantity" },
                {
                  title: "Kaina",
                  dataIndex: "amount",
                  render: (value) => `${value} EUR`,
                },
                { title: "Svoris", dataIndex: "weight" },
              ]}
              dataSource={value.cn22Form?.cnParts ?? []}
              rowKey="id"
              pagination={false}
            />
          </Collapse.Panel>
        </Collapse>
      );
    },
  },
  {
    title: "Veiksmai",
    key: "action",
    render: (_, record) => {
      if (record.status !== ShipmentStatus.LABEL_CREATED) {
        return (
          <Button
            type="primary"
            loading={isInitiateShipmentLoading}
            onClick={() => initiateShipment([record.id ?? ""])}
          >
            Generuoti lipduką
          </Button>
        );
      }

      return (
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            type="primary"
            loading={isStickerLoading}
            onClick={() => handleDownloadSticker([record.id ?? ""])}
          >
            Atsisiųsti lipduką
          </Button>
        </div>
      );
    },
  },
];

export default shipmentsColumns;
