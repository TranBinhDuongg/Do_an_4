import axios from 'axios';

// HTTP Client đóng gói Axios Instance
class HttpClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const message = error.response?.data?.message || error.message || 'Lỗi kết nối';
        return Promise.reject(new Error(message));
      }
    );
  }

  getInstance() {
    return this.client;
  }
}

export const httpClient = new HttpClient().getInstance();
