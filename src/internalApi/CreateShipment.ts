import { Shipment } from "@/interfaces/lpexpress";
import axios from "axios";

interface CreateShipmentRes extends Shipment {
  id: string;
}

const CreateShipment = (shipmentData: Shipment) =>
  axios
    .post<CreateShipmentRes>(
      `${window.location.protocol}//${window.location.host}/api/lpexpress/create`,
      shipmentData
    )
    .then(({ data }) => data);

export default CreateShipment;
