import { Shipment } from "@/interfaces/lpexpress";
import axios from "axios";

const GetShipments = () =>
  axios
    .get<Shipment[]>(`${window.location.protocol}//${window.location.host}/api/lpexpress/shipments`)
    .then(({ data }) => data);

export default GetShipments;
