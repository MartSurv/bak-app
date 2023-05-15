import { Shipment } from "@/interfaces/lpexpress";
import axios from "axios";

const CreateShipment = (shipmentData: Shipment) =>
  axios
    .post<Shipment>(
      `${window.location.protocol}//${window.location.host}/api/lpexpress/create`,
      shipmentData
    )
    .then(({ data }) => data);

export default CreateShipment;
