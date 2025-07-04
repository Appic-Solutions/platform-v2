import { Principal } from "@dfinity/principal";
import BigNumber from 'bignumber.js';
import { IcpToken } from "@/blockchain_api/types/tokens";


export interface MarketPrice {
	price: string,
	text: string,
	sqrt_price_x96: string;
}


function get_market_price(token0: IcpToken, token1: IcpToken, is_token0_selected: boolean, all_icp_tokens: IcpToken[]): MarketPrice {
	const tokenMap = new Map<string, IcpToken>();
	all_icp_tokens.forEach(token => {
		tokenMap.set(token.canisterId, token);
	});



	const token0_decimals = token0.decimals;
	const token1_decimals = token1.decimals;
	const token0_symbol = token0.symbol;
	const token1_symbol = token1.symbol;
	const token0_usd_price = token0.usdPrice;
	const token1_usd_price = token1.usdPrice;


	// Calculate prices: price_token0_in_token1 = (USD price of token0) / (USD price of token1) * 10^(d1 - d0)
	const price_token0_in_token1 = new BigNumber(token0_usd_price)
		.dividedBy(new BigNumber(token1_usd_price))
		.multipliedBy(new BigNumber(10).pow(token1_decimals - token0_decimals))
		.toString();

	// price_token1_in_token0 = 1 / price_token0_in_token1
	const price_token1_in_token0 = new BigNumber(1)
		.dividedBy(new BigNumber(price_token0_in_token1))
		.toString();

	// Since we don't have pool data, sqrt_price_x96 is approximated from prices
	// P = price_token1_in_token0 * 10^(d0 - d1), sqrt_price_x96 = sqrt(P) * 2^96
	const P = new BigNumber(price_token1_in_token0).multipliedBy(new BigNumber(10).pow(token0_decimals - token1_decimals));
	const sqrtPriceX96 = P.sqrt().multipliedBy(new BigNumber(2).pow(96)).toString();

	// Format price to 6 decimal places for display
	const formatted_price_token0_in_token1 = new BigNumber(price_token0_in_token1).toFixed(6);
	const formatted_price_token1_in_token0 = new BigNumber(price_token1_in_token0).toFixed(6);

	let text = is_token0_selected ? `1 ${token0_symbol} = ${formatted_price_token0_in_token1} ${token1_symbol} (-)` : `1 ${token1_symbol} = ${formatted_price_token1_in_token0} ${token0_symbol} (-)`;

	let price = is_token0_selected ? price_token0_in_token1 : price_token0_in_token1;

	return {
		price,
		text,
		sqrt_price_x96: sqrtPriceX96,
	};
}



function calculate_price(
	token0: IcpToken,
	token1: IcpToken,
	price: string,
	is_token_0_selected: boolean,
): MarketPrice {

	const Q96 = new BigNumber(2).pow(96);

	const token0_decimals = token0.decimals;
	const token1_decimals = token1.decimals;
	const token0_symbol = token0.symbol;
	const token1_symbol = token1.symbol;


	let price0_in_1: BigNumber;
	let price1_in_0: BigNumber;

	if (is_token_0_selected) {
		price0_in_1 = new BigNumber(price);
		price1_in_0 = new BigNumber(1).dividedBy(price);
	} else {
		price1_in_0 = new BigNumber(price);
		price0_in_1 = new BigNumber(1).dividedBy(price1_in_0);
	}

	// Adjust for decimals to compute sqrt_price_x96
	// P = price_token1_in_token0 * 10^(d0 - d1)
	const P = price1_in_0.multipliedBy(new BigNumber(10).pow(token0_decimals - token1_decimals));
	const sqrtPriceX96 = P.sqrt().multipliedBy(Q96).toString();

	// Format price to 6 decimal places for display
	const formatted_price0_in_1 = new BigNumber(price0_in_1).toFixed(6);
	const formatted_price1_in_0 = new BigNumber(price1_in_0).toFixed(6);


	const text = is_token_0_selected ? `1 ${token0_symbol} = ${formatted_price0_in_1} ${token1_symbol} (-)` : `1 ${token1_symbol} = ${formatted_price1_in_0} ${token0_symbol} (-)`;


	return {
		price,
		text,
		sqrt_price_x96: sqrtPriceX96,
	};
}
