import axios from "axios";

export const api = axios.create({
  baseURL: 'http://10.13.213.52:3001'
});