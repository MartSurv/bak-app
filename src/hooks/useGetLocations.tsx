import { QueryKeys } from "@/interfaces";
import GetLocations from "@/internalApi/GetLocations";
import { useQuery } from "@tanstack/react-query";

const useGetLocations = () =>
  useQuery({
    queryKey: [QueryKeys.SHOP],
    queryFn: () => GetLocations(),
  });

export default useGetLocations;
