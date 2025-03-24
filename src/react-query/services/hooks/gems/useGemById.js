import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const gemApiClient = new ApiClient('/gems');

const useGemById = (gemId) => {
  return useQuery({
    queryKey: ['gem', gemId], // Unique key for the query
    queryFn: () => gemApiClient.getById(gemId), // Correct API call
    onError: (error) => {
      console.error("Error fetching gems:", error); // Log errors for debugging
    },
  });
};

export default useGemById;