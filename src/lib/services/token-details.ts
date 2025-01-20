import axios from "@/lib/config/axios";

export async function fetchTokenDetails(tokenId: string) {
  try {
    const response = await axios.post("/info", {
      type: "tokenDetails",
      tokenId: tokenId,
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
