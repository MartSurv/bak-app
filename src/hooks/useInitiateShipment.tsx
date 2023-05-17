import { useMutation } from "@tanstack/react-query";
import { NotificationInstance } from "antd/es/notification/interface";
import { AxiosError } from "axios";

import InitiateShipment from "@/internalApi/InitiateShipment";

const useInitiateShipment = (
  notificationApi: NotificationInstance,
  onSuccess?: () => void
) =>
  useMutation({
    mutationKey: ["initiateShipment"],
    mutationFn: (data: string[]) => InitiateShipment(data),
    onSuccess: () => {
      notificationApi.success({
        message: "Success",
        description: "Siunta inicijuota sėkmigai",
      });
      onSuccess?.();
    },
    onError: (e) => {
      const error = e as AxiosError;
      notificationApi.error({
        message: `Error ${error.response?.status ?? ""}`,
        description: "Siuntos inicijuoti nepavyko",
      });
    },
  });

export default useInitiateShipment;
