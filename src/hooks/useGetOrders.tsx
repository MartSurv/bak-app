import { QueryKeys } from "@/interfaces";
import GetOrders from "@/internalApi/GetOrders";
import { useQuery } from "@tanstack/react-query";

const useGetOrders = (
  startDate?: string | undefined,
  endDate?: string | undefined
) =>
  useQuery({
    queryKey: [QueryKeys.ORDERS, startDate, endDate],
    queryFn: () => GetOrders(startDate ?? "", endDate ?? ""),
  });

export default useGetOrders;
