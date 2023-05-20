import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Table, Typography } from "antd";
import { TablePaginationConfig } from "antd/es/table";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Head from "next/head";
import { RangeValue } from "rc-picker/lib/interface";
import { useState } from "react";

import useGetSticker from "@/hooks/useGetSticker";
import useInitiateShipment from "@/hooks/useInitiateShipment";
import { PagePropsWithAuth, QueryKeys } from "@/interfaces";
import GetShipments from "@/internalApi/GetShipments";
import createPDF from "@/utils/createPDF";
import shipmentsColumns from "@/utils/shipmentsColumns";

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
    queryFn: () => GetShipments(dateRange),
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

  return (
    <>
      <Head>
        <title>Siuntos</title>
      </Head>
      <Typography.Title>Siuntos</Typography.Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <DatePicker.RangePicker
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
          columns={shipmentsColumns(
            isInitiateShipmentLoading,
            isStickerLoading,
            initiateShipment,
            handleDownloadSticker
          )}
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
