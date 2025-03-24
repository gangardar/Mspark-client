import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const gemApiClient = new ApiClient('/gems/assignToMe');

const useGemAssignToMe = () => {
  const assignGemToMe = async (formData) => {
    try {
      const res = await gemApiClient.update(formData._id, formData);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to assign gem");
    }
  };

  return useMutation({
    mutationFn: assignGemToMe,
    onError: (error) => {
      console.error("Error assigning gem:", error.message);
    },
  });
};

export default useGemAssignToMe;