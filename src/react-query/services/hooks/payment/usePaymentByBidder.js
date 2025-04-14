import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../apiClient'

const fetchPaymentsByBidder = async ({ bidderId, page = 1, limit = 10, status }) => {
  const response = await axiosInstance.get(`payments/bidder/${bidderId}`, {
    params: { page, limit, status }
  });
  return response.data;
};

export const usePaymentsByUserData = ({ bidderId, page, limit, status }) => {
  return useQuery({
    queryKey: ['payments', 'bidder', bidderId, { page, limit, status }],
    queryFn: () => fetchPaymentsByBidder({ bidderId, page, limit, status }),
    enabled: !!bidderId, // Only run when bidderId exists
    keepPreviousData: true, // Smooth pagination transitions
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2, // Retry failed requests twice
  });
};