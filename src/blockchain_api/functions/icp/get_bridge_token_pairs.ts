// import { Actor, HttpAgent } from "@dfinity/agent";
// import { idlFactory as appicTransactionLoggerIDLfactory } from "@/did/sonic/sonic.did";

// import BigNumber from "bignumber.js";
// import { EvmToken, IcpToken, Operator } from "../../types/tokens";
// import { Principal } from "@dfinity/principal";
// import { get_icp_price } from "./get_icp_price";
// import { TokenPair } from "@/did/appic/transaction-logger-types.did";
// import { MetadataValue } from "@dfinity/ledger-icrc/dist/candid/icrc_ledger";
// import { idlFactory as icrcIDLFactory } from "@dfinity/ledger-icrc/dist/candid/icrc_ledger.idl";

// interface Fetched_Metadata {
//   logo?: string;
//   decimals?: number;
//   name?: string;
//   symbol?: string;
//   fee?: string;
//   maxMemoLength?: number;
// }

// // Get all bridge pairs from appictranasction logger dex
// export const get_all_bridge_token_pairs = async (agent: HttpAgent): Promise<TokenPair[]> => {
//   const transaction_logger_actro = Actor.createActor(appicTransactionLoggerIDLfactory, {
//     agent,
//     canisterId: Principal.fromText("zjydy-zyaaa-aaaaj-qnfka-cai"),
//   });

//   try {
//     // Type assertion to let TypeScript know the return type is PairInfoExt[]
//     const bridge_token_pairs = (await transaction_logger_actro.get_supported_token_pairs()) as TokenPair[];
//     // You can now use allIcpTokens here
//     return bridge_token_pairs;
//   } catch (error) {
//     console.error("Error fetching appic bridge token pairs list:", error);
//     return [];
//   }
// };

// export const populate_bridge_pairs_with_data = async (agent: HttpAgent, all_pairs: TokenPair[]): Promise<(EvmToken | IcpToken)[]> => {
//   all_pairs.map(async (pair) => {
//     let fetched_Metadata: Fetched_Metadata = await fetch_metadata(agent, pair.ledger_id);
//     let operator: Operator;
//     if ("AppicMinter" in pair.operator) {
//       operator = "Appic";
//     } else {
//       operator = "Dfinity";
//     }

//     let icp_token: IcpToken = {
//       canisterId: pair.ledger_id.toString(),
//       chainId: 0,
//       chainType: "ICP",
//       decimals: fetched_Metadata.decimals,
//       fee: fetched_Metadata.fee,
//       logo: fetched_Metadata.logo,
//       tokenType: "ICRC-3",
//       usdPrice: "0",
//       balance: "0",
//       balanceRawInteger: "0",
//       bridgePairs: [{ chain_id: BigNumber(pair.chain_id.toString()).toNumber(), contract_or_cansiter_id: pair.erc20_address }],
//       contractAddress: undefined,
//       disabled: false,
//       name: fetched_Metadata.name,
//       symbol: fetched_Metadata.symbol,
//       usdBalance: "0",
//       operator: operator,
//     };

//     let evm_token: EvmToken = {
//       chainId:BigNumber(pair.chain_id.toString()).toNumber(),
//       chainType:"EVM",
//       contractAddress:pair.erc20_address,
//       bridgePairs:[
//         {chain_id:0,contract_or_cansiter_id:pair.ledger_id.toString()}
//       ],
//       usdPrice:"0",
//       decimals:fetched_Metadata.decimals,

//     };
//     // let : number = (await icrc_actor.icrc1_decimals()) as number;

//     // let evm_token:EvmToken={

//     // };
//   });
// };

// const fetch_metadata = async (agent: HttpAgent, cansiter_id: Principal): Promise<Fetched_Metadata> => {
//   let icrc_actor = Actor.createActor(icrcIDLFactory, {
//     agent,
//     canisterId: cansiter_id,
//   });
//   let metadata: Array<[string, MetadataValue]> = (await icrc_actor.icrc1_metadata()) as Array<[string, MetadataValue]>;

//   // Initialize variables to hold extracted metadata
//   let fetch_metadata: Fetched_Metadata = {
//     logo: "", // Initialize with default values (empty string or other default values)
//     decimals: 0,
//     name: "",
//     symbol: "",
//     fee: "",
//   };

//   // Iterate over the metadata array and extract values
//   metadata.forEach(([key, value]) => {
//     switch (key) {
//       case "icrc1:logo":
//         if ("Text" in value) {
//           fetch_metadata.logo = value.Text; // Safely extract the string from the `Text` field
//         }
//       case "icrc1:decimals":
//         if ("Nat" in value) {
//           fetch_metadata.decimals = new BigNumber(value.Nat.toString()).toNumber(); // Safely extract the string from the `Text` field
//         }

//       case "icrc1:name":
//         if ("Text" in value) {
//           fetch_metadata.name = value.Text; // Safely extract the string from the `Text` field
//         }
//       case "icrc1:symbol":
//         if ("Text" in value) {
//           fetch_metadata.symbol = value.Text; // Safely extract the string from the `Text` field
//         }
//       case "icrc1:fee":
//         if ("Nat" in value) {
//           fetch_metadata.fee = new BigNumber(value.Nat.toString()).toString(); // Safely extract the string from the `Text` field
//         }
//     }
//   });

//   return fetch_metadata;
// };
