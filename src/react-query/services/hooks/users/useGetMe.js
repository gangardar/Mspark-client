import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const userApiClient = new ApiClient('/auth/me');

const useGetMe = () => {
    return useQuery({
      queryKey: ['me'],
      queryFn: () => userApiClient.getData()
    });
  }

export default useGetMe;