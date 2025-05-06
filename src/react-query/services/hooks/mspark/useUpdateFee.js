import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

const updateMsparkFees = async ({id, fees}) => {
  const { data } = await axiosInstance.put(`/mspark/${id}/fees`, fees);
  return data;
};

export const useUpdateFee = () => {
  return useMutation({
    mutationFn: updateMsparkFees
  })
};