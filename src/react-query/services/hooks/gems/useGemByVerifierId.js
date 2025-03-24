import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const gemApiClient = new ApiClient('/gems/assigned');

const useGemByVerifierId = (adminId, page, limit) => {
  return useQuery({
    queryKey: ['assigned-gems', adminId, page, limit], // Unique key for the query
    queryFn: () => gemApiClient.getById(adminId), // Correct API call
    onError: (error) => {
      console.error("Error fetching gems:", error); // Log errors for debugging
    },
  });
};

export default useGemByVerifierId;