import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient"

const useCancelAuction = () => {
    const cancelAuction = async (id) => {
          const response = await axiosInstance.put(`/auctions/${id}/cancel`);
          return response.data;
      };

    return useMutation({
        mutationFn : cancelAuction
    })
}

export default useCancelAuction