import { QueryKeys } from "@/interfaces";
import GetOrders from "@/internalApi/GetOrders";
import { useQuery } from "@tanstack/react-query";

const useGetOrders = () =>
  useQuery({
    queryKey: [QueryKeys.ORDERS],
    queryFn: () => GetOrders(),
  });

export default useGetOrders;
