import axios from "@/lib/config/axios";

export async function fetchMidPrice(token: string): Promise<number> {
  try {
    const response = await axios.post("/info", {
      type: "allMids",
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return parseFloat(response.data[token]);
  } catch (error) {
    return Promise.reject(error);
  }
}
