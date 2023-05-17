import axios from "axios";
import queryString from "query-string";

import { FinancialStatus, Order } from "@/interfaces/order";

interface GetOrdersResponse {
  orders: Order[];
}

const GetOrders = (
  startDate: string,
  endDate: string,
  financialStatus?: FinancialStatus
) =>
  axios
    .get<GetOrdersResponse>(
      `${window.location.protocol}//${
        window.location.host
      }/api/shopify/orders?${queryString.stringify(
        {
          start: startDate,
          end: endDate,
          financialStatus,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      )}`
    )
    .then(({ data }) => data.orders);

export default GetOrders;
