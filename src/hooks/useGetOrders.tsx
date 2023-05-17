import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/interfaces";
import { FinancialStatus } from "@/interfaces/order";
import GetOrders from "@/internalApi/GetOrders";

const useGetOrders = (
  startDate: string | undefined,
  endDate: string | undefined,
  financialStatus: FinancialStatus | undefined
) =>
  useQuery({
    queryKey: [QueryKeys.ORDERS, startDate, endDate, financialStatus],
    queryFn: () => GetOrders(startDate ?? "", endDate ?? "", financialStatus),
  });

export default useGetOrders;
