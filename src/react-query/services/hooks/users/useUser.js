import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

export const useUser = ({ page, limit, role }) => {
  return useQuery({
    queryKey: ["users", page, limit, role],
    queryFn: async () => {
      const params = { page, limit };
      if (role) params.role = role;
      
      const response = await axiosInstance.get("/users/all", { params });
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};
