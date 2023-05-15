import { Shipment } from "@/interfaces/lpexpress";
import CreateShipment from "@/internalApi/CreateShipment";
import { useMutation } from "@tanstack/react-query";
import { NotificationInstance } from "antd/es/notification/interface";
import { AxiosError } from "axios";

const useCreateShipment = (
  notificationApi: NotificationInstance,
  onSuccess?: (data: Shipment) => void
) =>
  useMutation({
    mutationKey: ["createShipment"],
    mutationFn: (data: Shipment) => CreateShipment(data),
    onSuccess: (data) => {
      notificationApi.success({
        message: "Success",
        description: "Siunta sukurta sėkmigai",
      });
      onSuccess?.(data);
    },
    onError: (e) => {
      const error = e as AxiosError;
      notificationApi.error({
        message: `Error ${error.response?.status ?? ""}`,
        description: "Siuntos sukurti nepavyko",
      });
    },
  });

export default useCreateShipment;
