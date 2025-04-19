import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

export const useMspark = () => {
  return useQuery({
    queryKey: ["mspark"],
    queryFn: async () => {
        const response = await axiosInstance.get("/mspark");
        return response.data;
    },
  });
};


