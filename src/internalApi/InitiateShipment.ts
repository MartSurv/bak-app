import axios from "axios";

const InitiateShipment = (shipmentIds: string[]) =>
  axios
    .post(
      `${window.location.protocol}//${window.location.host}/api/lpexpress/initiate`,
      shipmentIds
    )
    .then(({ data }) => data);

export default InitiateShipment;
