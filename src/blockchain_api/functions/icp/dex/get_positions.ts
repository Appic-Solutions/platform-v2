import { Actor, Agent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { CandidPositionKey, CandidPositionInfo} from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Response } from "@/blockchain_api/types/response";

export interface Position{
	key:CandidPositionKey,
  fees_token0_owed :	string,
  fee_growth_inside_1_last_x128 : string,
  liquidity : string,
  fees_token1_owed :string,
  fee_growth_inside_0_last_x128 : string,
	token0_reserves:string,
	token1_reserves:string,
}


