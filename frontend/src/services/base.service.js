import { httpClient } from './http-client';

// Base API Service trong OOP
export class BaseApiService {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.http = httpClient;
  }

  async getAll(params = {}) {
    const res = await this.http.get(this.endpoint, { params });
    return res.data;
  }

  async getById(id) {
    const res = await this.http.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async create(data) {
    const res = await this.http.post(this.endpoint, data);
    return res.data;
  }

  async update(id, data) {
    const res = await this.http.put(`${this.endpoint}/${id}`, data);
    return res.data;
  }

  async delete(id) {
    const res = await this.http.delete(`${this.endpoint}/${id}`);
    return res.data;
  }
}
