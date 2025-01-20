import axios from "@/lib/config/axios";

interface Balance {
  coin: string;
  token: number;
  total: string;
  hold: string;
  entryNtl: string;
}

interface BalanceResponse {
  balances: Balance[];
}

export async function fetchBalances(user: string): Promise<BalanceResponse> {
  try {
    const response = await axios.post(`/info`, {
      type: "spotClearinghouseState",
      user,
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
