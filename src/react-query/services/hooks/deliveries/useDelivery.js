import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../apiClient"

export const useDelivery = ({ page = 1, limit = 10, status, type } = {}) => {
    return useQuery({
      queryKey: ['deliveries', page, limit, status, type],
      queryFn: async () => {
        const response = await axiosInstance.get('/deliveries', {
          params: { page, limit, status, type }
        });
        return response.data;
      }
    });
  };