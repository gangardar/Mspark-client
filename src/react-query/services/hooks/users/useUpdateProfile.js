import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient"

const useUpdateProfile = () => {
    const updateProfile = async({id, data}) => {
        try{
            const response = await axiosInstance.put(`/users/${id}`, data,{
            headers : {
                "Content-Type" : "multipart/form-data"
              }
        })
        return response.data;
        }catch (error) {
            // Enhance error information before throwing
            throw {
              response: {
                data: {
                  message: error.response?.data?.message || "Failed to update profile"
                }
              }
            };
          }
        
    }

    return useMutation({
        mutationFn: updateProfile
    })
}

export default useUpdateProfile