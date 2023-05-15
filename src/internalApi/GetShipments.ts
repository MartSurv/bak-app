import { Shipment } from "@/interfaces/lpexpress";
import axios from "axios";
import dayjs from "dayjs";
import { RangeValue } from "rc-picker/lib/interface";

const GetShipments = (count: number, dateRange: RangeValue<dayjs.Dayjs>) =>
  axios
    .get<Shipment[]>(
      `${window.location.protocol}//${
        window.location.host
      }/api/shipments?start=${dateRange[0].format(
        "YYYY-MM-DD"
      )}&end=${dateRange[1].format("YYYY-MM-DD")}`
    )
    .then(({ data }) => {
      return data;
    });

export default GetShipments;
