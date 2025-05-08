import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

const useGem = ({ page = 1, limit = 10, status = "all" }= {}) => {
  return useQuery({
    queryKey: ["gems", page, limit, status], // Unique key for the query
    queryFn: async () => {
      const response = await axiosInstance.get("/gems/", {
        params: { page, limit, status },
      });
      return response.data;
    },
  });
};

export default useGem;
