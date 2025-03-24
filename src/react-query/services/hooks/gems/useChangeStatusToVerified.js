import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const gemApiClient = new ApiClient('/gems/verify');

const useChangeStatusToVerified = () => {
  const changeStatusToVerified = async (id) => {
    try {
      const res = await gemApiClient.update(id);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to set verified gem status.");
    }
  };

  return useMutation({
    mutationFn: changeStatusToVerified,
    onError: (error) => {
      console.error("Error changing gem status:", error.message);
    },
  });
};

export default useChangeStatusToVerified;