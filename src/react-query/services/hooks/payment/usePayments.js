import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../apiClient';

const fetchPaymentsByUserRole = async ({page = 1, limit = 10, status }) => {
  const response = await axiosInstance.get(`/payments`, {
    params: { page, limit, status }
  });
  return response.data;
};

export const usePayments = ({userData, page, limit, status }) => {
  return useQuery({
    queryKey: ['payments', userData?._id, userData?.role, { page, limit, status }],
    queryFn: () => fetchPaymentsByUserRole({ userData, page, limit, status }),
    keepPreviousData: true, // Smooth pagination transitions
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2, // Retry failed requests twice
  });
};