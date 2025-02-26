import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const gemApiClient = new ApiClient('/gems');

const useGem = (page, limit) => {
  return useQuery({
    queryKey: ['gems', page, limit], // Unique key for the query
    queryFn: () => gemApiClient.getActiveData({ queryKey: [{ page, limit }] }), // Pass an array of objects
  });
};

export default useGem;