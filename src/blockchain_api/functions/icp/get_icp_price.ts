import axios from "axios";
import { Response } from "@/blockchain_api/types/response";
interface IcpPriceResponse {
  icp_usd_rate: [number, string][];
}

interface ErrorResponse {
  message: string;
  errors: Record<string, unknown>;
  code: number;
  status: string;
}

export async function get_icp_price(): Promise<Response<string>> {
  const url = "https://ic-api.internetcomputer.org/api/v3/icp-usd-rate";

  try {
    const response = await axios.get<IcpPriceResponse>(url);
    const icp_price = response.data.icp_usd_rate[0][1];
    return {
      result: icp_price,
      message: "",
      success: true,
    };
  } catch (error) {
    return {
      result: "0",
      message: `Failed to get icp USD price ${error}`,
      success: true,
    };
  }
}
