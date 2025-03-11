import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

const useRegisterGem = () => {
  const registerGem = async(formData) => {
    const res = await axiosInstance.post('/gems', formData,{
      headers : {
        "Content-Type" : "multipart/form-data"
      }
    });
    return res.data;
  }
  return useMutation({
    mutationFn : registerGem
  });
};

export default useRegisterGem;