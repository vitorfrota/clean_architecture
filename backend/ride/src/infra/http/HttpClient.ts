import axios from "axios";

export default interface HttpClient {
  get(url: string, params?: any): Promise<any>;
  post(url: string, body?: any): Promise<any>;
}

export class AxiosAdapter implements HttpClient {

  async post(url: string, body?: any): Promise<any> {
    return axios.post(url, body);
  }
  
  async get(url: string, params?: any): Promise<any> {
    return axios.get(url, params);
  }
  
}