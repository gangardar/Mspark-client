import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient"

const useExtendAuction = () => {
    const activateAuction = async ({id,endTime}) => {
            console.log(endTime);
          const response = await axiosInstance.put(`/auctions/${id}/extend`,{endTime : endTime});
          return response.data;
      };

    return useMutation({
        mutationFn : activateAuction
    })
}

export default useExtendAuction