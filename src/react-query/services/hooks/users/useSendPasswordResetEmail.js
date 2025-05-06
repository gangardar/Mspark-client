
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../apiClient';

const sendPasswordResetEmail = async (email) => {
  const response = await axiosInstance.post('/auth/forgotPassword', { email });
  return response.data;
};

export const useSendPasswordResetEmail = () => {
  return useMutation({
    mutationFn : sendPasswordResetEmail
  })
};