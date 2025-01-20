import { config } from "@/lib/config";
import axios from "@/lib/config/axios";

export async function fetchBuilderInfo(user: string): Promise<number> {
  try {
    const response = await axios.post(`/info`, {
      type: "maxBuilderFee",
      user,
      builder: config.builderAddress,
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
