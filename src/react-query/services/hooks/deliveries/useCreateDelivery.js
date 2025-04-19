import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

export const useCreateDelivery = () => {
  const createDelivery = async ({
    gems,
    type,
    to,
    trackingNumber,
    deliveryService,
    trackingUrl,
  }) => {
    const response = await axiosInstance.post("/deliveries", {
        gems, type, to, trackingNumber, deliveryService, trackingUrl
    });
    return response.data
  };

  return useMutation({
    mutationFn: createDelivery
  })
};
