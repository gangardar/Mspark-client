import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const gemApiClient = new ApiClient('/gems');

const useDeleteGemImage = () => {
    const assignGemToMe = async ({gemId, url}) => {
        try {
          const res = await gemApiClient.deleteImg(gemId, url);
          return res.data;
        } catch (error) {
          throw new Error(error.response?.data?.message || "Failed to delete gem image");
        }
      };
    
      return useMutation({
        mutationFn: assignGemToMe,
        onError: (error) => {
          console.error("Error deleting img:", error.message);
        },
      });
};

export default useDeleteGemImage;