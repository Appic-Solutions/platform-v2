import axios from "axios";

interface IcpPriceResponse {
  icp_usd_rate: [number, string][];
}

interface ErrorResponse {
  message: string;
  errors: Record<string, unknown>;
  code: number;
  status: string;
}

export async function get_icp_price(): Promise<number | null> {
  const url = "https://ic-api.internetcomputer.org/api/v3/icp-usd-rate";

  try {
    const response = await axios.get<IcpPriceResponse>(url);
    const icpPriceString = response.data.icp_usd_rate[0][1];
    const icpPrice = parseFloat(icpPriceString);
    return icpPrice;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errData = error.response.data as ErrorResponse;
      console.error(`Error: ${errData.message}, Status: ${errData.status}`);
    } else {
      console.error("An unknown error occurred");
    }
    return null;
  }
}
