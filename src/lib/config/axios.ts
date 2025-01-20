import axios from "axios";
import { isMainnet, MAINNET_API_URL, TESTNET_API_URL } from "@/lib/config";

export const BASE_URL = isMainnet ? MAINNET_API_URL : TESTNET_API_URL;

// Create base axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  //   timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default api;
