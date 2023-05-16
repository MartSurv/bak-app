import { Order } from "@/interfaces/order";
import axios from "axios";
import queryString from "query-string";

interface GetOrdersResponse {
  orders: Order[];
}

const GetOrders = (startDate: string, endDate: string) =>
  axios
    .get<GetOrdersResponse>(
      `${window.location.protocol}//${
        window.location.host
      }/api/shopify/orders?${queryString.stringify(
        {
          start: startDate,
          end: endDate,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      )}`
    )
    .then(({ data }) => data.orders);

export default GetOrders;
