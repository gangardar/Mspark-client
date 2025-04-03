import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient"

const useActivateAuction = () => {
    const activateAuction = async (id) => {
          const response = await axiosInstance.put(`/auctions/${id}/active`);
          return response.data;
      };

    return useMutation({
        mutationFn : activateAuction
    })
}

export default useActivateAuction