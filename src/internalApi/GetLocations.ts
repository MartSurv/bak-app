import { Location } from "@/interfaces/location";
import axios from "axios";

interface GetLocationsResponse {
  locations: Location[];
}

const GetLocations = () =>
  axios
    .get<GetLocationsResponse>(
      `${window.location.protocol}//${window.location.host}/api/shopify/locations`
    )
    .then(({ data }) => data.locations);

export default GetLocations;
