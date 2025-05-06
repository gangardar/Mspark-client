import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../apiClient"

// Updated useUpdateAddress hook
const useUpdateAddress = () => {
    const updateAddress = async ({ id, data }) => {
      try {
        const response = await axiosInstance.put(`/users/address/${id}`, data);
        return response.data;
      } catch (error) {
        // Enhance error information before throwing
        throw {
          response: {
            data: {
              message: error.response?.data?.message || "Failed to update address"
            }
          }
        };
      }
    };
  
    return useMutation({
      mutationFn: updateAddress
    });
  };

export default useUpdateAddress;