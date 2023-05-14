import { Order } from "@/interfaces/order";
import axios from "axios";

interface GetOrdersResponse {
  orders: Order[];
}

const GetOrders = () =>
  axios
    .get<GetOrdersResponse>(
      `${window.location.protocol}//${window.location.host}/api/shopify/orders`
    )
    .then(({ data }) => data.orders);

export default GetOrders;
