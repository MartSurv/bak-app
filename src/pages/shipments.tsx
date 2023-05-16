import useGetSticker from "@/hooks/useGetSticker";
import useInitiateShipment from "@/hooks/useInitiateShipment";
import { PagePropsWithAuth, QueryKeys } from "@/interfaces";
import {
  Documents,
  Receiver,
  Shipment,
  ShipmentStatus,
} from "@/interfaces/lpexpress";
import GetShipments from "@/internalApi/GetShipments";
import createPDF from "@/utils/createPDF";
import isEUCountry from "@/utils/isEUCountry";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useQuery } from "@tanstack/react-query";
import { Button, Collapse, DatePicker, Table, Typography } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Head from "next/head";
import { RangeValue } from "rc-picker/lib/interface";
import { useState } from "react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

export default withPageAuthRequired(function Shipments(
  props: PagePropsWithAuth
) {
  const { notificationApi } = props;
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<RangeValue<dayjs.Dayjs>>([
    dayjs(),
    dayjs(),
  ]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50],
  });

  const { data: shipmentData, isLoading } = useQuery({
    queryKey: [QueryKeys.SHIPMENTS, pagination?.pageSize, dateRange],
    queryFn: () => GetShipments(pagination?.pageSize ?? 5, dateRange),
    onError: (e) => {
      const error = e as AxiosError;
      notificationApi.error({
        message: `Error ${error.response?.status ?? ""}`,
        description: "Nepavyko gauti duomenų apie siuntas",
      });
    },
  });

  const { mutateAsync: getSticker, isLoading: isStickerLoading } =
    useGetSticker(notificationApi);

  const { mutate: initiateShipment, isLoading: isInitiateShipmentLoading } =
    useInitiateShipment(notificationApi);

  const handleDownloadSticker = async (ids: string[]) => {
    const stickers = await getSticker(ids);

    const pdfDoc = await createPDF(stickers);

    const pdfBytes = await pdfDoc.save({ addDefaultPage: false });
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    if (stickers.length > 1) {
      downloadLink.download = `lipdukai-${stickers.length}.pdf`;
    } else {
      downloadLink.download = `${stickers[0].itemId}.pdf`;
    }
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlePagination = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleDateChange = (values: RangeValue<dayjs.Dayjs>) => {
    if (values?.[0] && values?.[1]) {
      setDateRange([values[0], values[1]]);
      setSelectedShipmentIds([]);
    } else {
      setDateRange([dayjs(), dayjs()]);
      setSelectedShipmentIds([]);
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
          <Text>{value.name}</Text>
          {value.email && <Text>{value.email}</Text>}
          {value.phone && <Text>{value.phone}</Text>}
          <Text>{value.address.address1}</Text>
          <Text>{`${value.address.locality}, ${value.address.postalCode}, ${value.address.country}`}</Text>
        </div>
      ),
    },
    {
      title: "Siuntėjas",
      dataIndex: "sender",
      render: (value: Receiver) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {value.email && <Text>{value.email}</Text>}
          {value.phone && <Text>{value.phone}</Text>}
          {value.address.street && value.address.building && (
            <Text>{`${value.address.street} ${value.address.building}`}</Text>
          )}
          <Text>{`${value.address.locality}, ${value.address.postalCode}, ${value.address.country}`}</Text>
        </div>
      ),
    },
    {
      title: "Sukūrimo data",
      dataIndex: "createdOn",
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
            <Panel header="CN22" key={record.id}>
              <Table
                size="small"
                columns={[
                  { title: "Prekė", dataIndex: "summary" },
                  { title: "Kiekis", dataIndex: "quantity" },
                  {
                    title: "Kaina",
                    dataIndex: "amount",
                    render: (value) => `€${value}`,
                  },
                  { title: "Svoris", dataIndex: "weight" },
                ]}
                dataSource={value.cn22Form?.cnParts ?? []}
                rowKey="id"
                pagination={false}
              />
            </Panel>
          </Collapse>
        );
      },
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
              onClick={() => handleDownloadSticker([record.id ?? ""])}
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
        <div style={{ display: "flex", gap: 10 }}>
          <RangePicker
            style={{ alignSelf: "flex-start" }}
            format={"YYYY-MM-DD"}
            value={dateRange}
            onCalendarChange={handleDateChange}
          />
          <Button
            disabled={selectedShipmentIds.length === 0}
            type="primary"
            loading={isStickerLoading}
            onClick={() => handleDownloadSticker(selectedShipmentIds)}
          >
            {`Atsisiųsti lipdukus (${selectedShipmentIds.length})`}
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={shipmentData ?? []}
          loading={isLoading}
          pagination={pagination}
          rowKey="id"
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys) => {
              setSelectedShipmentIds(selectedRowKeys as string[]);
            },
            selectedRowKeys: selectedShipmentIds,
          }}
          onChange={(pagination) => handlePagination(pagination)}
        />
      </div>
    </>
  );
});
