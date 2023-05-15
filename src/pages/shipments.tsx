import useInitiateShipment from "@/hooks/useInitiateShipment";
import { PageProps, QueryKeys } from "@/interfaces";
import { Receiver, Shipment, ShipmentStatus } from "@/interfaces/lpexpress";
import GetShipments from "@/internalApi/GetShipments";
import GetSticker from "@/internalApi/GetSticker";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Table, Typography } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue } from "antd/es/table/interface";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Head from "next/head";
import { RangeValue } from "rc-picker/lib/interface";
import { useState } from "react";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export default withPageAuthRequired(function Shipments(props: PageProps) {
  const { notificationApi } = props;
  const [dateRange, setDateRange] = useState<RangeValue<dayjs.Dayjs>>([
    dayjs(),
    dayjs(),
  ]);
  const offset = 0;
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 15, 20, 50],
    },
  });

  const { data: shipmentData, isLoading } = useQuery({
    queryKey: [
      QueryKeys.SHIPMENTS,
      tableParams.pagination?.pageSize,
      offset,
      dateRange,
    ],
    queryFn: () =>
      GetShipments(tableParams.pagination?.pageSize ?? 5, offset, dateRange),
    onError: (e) => {
      const error = e as AxiosError;
      notificationApi.error({
        message: `Error ${error.response?.status ?? ""}`,
        description: "Nepavyko gauti duomenų apie siuntas",
      });
    },
  });

  const { mutateAsync: getSticker, isLoading: isStickerLoading } = useMutation({
    mutationKey: ["sticker"],
    mutationFn: (id: string) => GetSticker(id),
    onError: (e) => {
      const error = e as AxiosError;
      notificationApi.error({
        message: `Error ${error.response?.status ?? ""}`,
        description: "Nepavyko gauti siuntos lipduko",
      });
    },
  });

  const { mutate: initiateShipment, isLoading: isInitiateShipmentLoading } =
    useInitiateShipment(notificationApi);

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

  const handleDateChange = (values: RangeValue<dayjs.Dayjs>) => {
    if (values?.[0] && values?.[1]) {
      setDateRange([values[0], values[1]]);
    }
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
              onClick={() => handleDownloadSticker(record)}
            >
              Atsisiųsti lipduką
            </Button>
          </div>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <RangePicker
          style={{ alignSelf: "flex-start" }}
          format={"YYYY-MM-DD"}
          value={dateRange}
          onCalendarChange={handleDateChange}
        />
        <Table
          columns={columns}
          dataSource={shipmentData ?? []}
          loading={isLoading}
          pagination={tableParams.pagination}
          rowKey="id"
          onChange={(pagination) => handleTableChange(pagination)}
        />
      </div>
    </>
  );
});
