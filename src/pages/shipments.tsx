import { Receiver, Shipment, ShipmentStatus } from "@/interfaces/lpexpress";
import GetShipments from "@/internalApi/GetShipments";
import GetSticker from "@/internalApi/GetSticker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Table, Typography } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue } from "antd/es/table/interface";
import Head from "next/head";
import { useState } from "react";

const { Title } = Typography;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export default function Shipments() {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 15, 20, 50],
    },
  });

  const { data: shipments, isLoading } = useQuery({
    queryKey: ["shipments", tableParams.pagination?.pageSize],
    queryFn: () => GetShipments(tableParams.pagination?.pageSize ?? 10),
  });

  const { mutateAsync: getSticker, isLoading: stickerIsLoading } = useMutation({
    mutationKey: ["sticker"],
    mutationFn: (id: string) => GetSticker(id),
  });

  const handleDownloadSticker = async (shipment: Shipment) => {
    if (shipment.id) {
      const sticker = await getSticker(shipment.id);

      const linkSource = `data:application/pdf;base64,${sticker[0].label}`;
      const downloadLink = document.createElement("a");
      const fileName = `${sticker[0].itemId}.pdf`;

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({ pagination });
  };

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
    {
      title: "Veiksmai",
      key: "action",
      render: (_, record) => {
        if (record.status !== ShipmentStatus.LABEL_CREATED) {
          return null;
        }

        return (
          <Button
            type="primary"
            loading={stickerIsLoading}
            onClick={() => handleDownloadSticker(record)}
          >
            Atsisiųsti lipduką
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>Siuntos</title>
      </Head>
      <Title>Siuntos</Title>
      <Table
        columns={columns}
        dataSource={shipments ?? []}
        loading={isLoading}
        pagination={tableParams.pagination}
        rowKey="id"
        onChange={(pagination) => handleTableChange(pagination)}
      />
    </>
  );
}
