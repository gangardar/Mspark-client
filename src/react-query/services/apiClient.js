import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const apiToken = localStorage.getItem("token");

    if (apiToken) {
      config.headers["x-auth-token"] = apiToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class ApiClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getActiveData({ queryKey }) {
    const [{ page, limit }] = queryKey;
    const res = await axiosInstance.get(this.endpoint, {
      params: { page, limit },
    });
    return res.data;
  }

  async getData() {
    const res = await axiosInstance.get(this.endpoint);
    return res.data;
  }

  async getByRole({ queryKey }) {
    const [{ page, limit, role }] = queryKey;
    const res = await axiosInstance.get(`${this.endpoint}/${role}`, {
      params: { page, limit },
    });
    return res.data;
  }

  async getById(id) {
    const res = await axiosInstance.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async add(data) {
    const res = await axiosInstance.post(this.endpoint, data);
    return res.data;
  }

  async update(id, data) {
    const res = await axiosInstance.put(`${this.endpoint}/${id}`, data);
    return res.data;
  }

  async softDelete(id) {
    const res = await axiosInstance.delete(`${this.endpoint}/${id}`);
    return res.data;
  }

  async restoreDelete(id){
    const res = await axiosInstance.put(`${this.endpoint}/${id}/restore`);
    return res.data;
  }

  async deleteImg(id, url) {
    const res = await axiosInstance.delete(`${this.endpoint}/image/${id}`, {
      data: { url }, // Send the URL in the request body
    });
    return res.data;
  }

  async bid(id, auction) {
    const res = await axiosInstance.post(`${this.endpoint}/${id}/bid`, auction);
    return res.data;
  }
}

export default ApiClient;
