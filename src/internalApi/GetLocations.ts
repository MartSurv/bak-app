import axios from "axios";

import { Location } from "@/interfaces/location";

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
