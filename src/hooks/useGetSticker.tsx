import { QueryKeys } from "@/interfaces";
import GetSticker from "@/internalApi/GetSticker";
import { useMutation } from "@tanstack/react-query";
import { NotificationInstance } from "antd/es/notification/interface";
import { AxiosError } from "axios";

const useGetSticker = (notificationApi: NotificationInstance) =>
  useMutation({
    mutationKey: [QueryKeys.STICKER],
    mutationFn: (id: string) => GetSticker(id),
    onError: (e) => {
      const error = e as AxiosError;
      notificationApi.error({
        message: `Error ${error.response?.status ?? ""}`,
        description: "Nepavyko gauti siuntos lipduko",
      });
    },
  });

export default useGetSticker;
