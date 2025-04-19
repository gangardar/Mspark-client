import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

export const useUser = ({ page, limit }) => {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get("/users",{
        params : {
            page, limit
        }
      });
      return response.data;
    },
  });
};
