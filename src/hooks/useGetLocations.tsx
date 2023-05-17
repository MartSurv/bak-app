import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/interfaces";
import GetLocations from "@/internalApi/GetLocations";

const useGetLocations = () =>
  useQuery({
    queryKey: [QueryKeys.SHOP],
    queryFn: () => GetLocations(),
  });

export default useGetLocations;
