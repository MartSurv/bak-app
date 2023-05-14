import { Receiver, Shipment } from "@/interfaces/lpexpress";
import GetShipments from "@/internalApi/GetShipments";
import { useQuery } from "@tanstack/react-query";
import { Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Head from "next/head";

const { Title } = Typography;

export default function Shipments() {
  const { data: shipments, isLoading } = useQuery({
    queryKey: ["shipments"],
    queryFn: () => GetShipments(),
  });

  const columns: ColumnsType<Shipment> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Gavėjas",
      dataIndex: "receiver",
      render: (value: Receiver) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span>{value.name}</span>
          <span>{value.email}</span>
          <span>{value.phone}</span>
        </div>
      ),
    },
    {
      title: "Adresas",
      dataIndex: "receiver",
      render: (value: Receiver) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span>{value.address.address1}</span>
          <span>{`${value.address.locality}, ${value.address.postalCode}, ${value.address.country}`}</span>
        </div>
      ),
    },
    {
      title: "Sukūrimo data",
      dataIndex: "createdOn",
    },
    {
      title: "Statusas",
      dataIndex: "status",
    },
  ];

  return (
    <>
      <Head>
        <title>Siuntos</title>
      </Head>
      <Title>Siuntos</Title>
      <Table columns={columns} dataSource={shipments ?? []} loading={isLoading} rowKey="id" />
    </>
  );
}
