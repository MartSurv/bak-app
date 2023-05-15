import { Shipment } from "@/interfaces/lpexpress";
import axios from "axios";

const GetShipments = (pageSize: number) =>
  axios
    .get<Shipment[]>(
      `${window.location.protocol}//${window.location.host}/api/lpexpress/shipments?pageSize=${pageSize}`
    )
    .then(({ data }) => data);

export default GetShipments;
