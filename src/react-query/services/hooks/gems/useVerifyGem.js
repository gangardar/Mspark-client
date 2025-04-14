import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

const useVerifyGem = () => {
  const verifyGem = async({id, formData}) => {
    const res = await axiosInstance.put(`/gems/${id.id}`, formData,{
      headers : {
        "Content-Type" : "multipart/form-data"
      }
    });
    return res.data;
  }
  return useMutation({
    mutationFn : verifyGem
  });
};

export default useVerifyGem;