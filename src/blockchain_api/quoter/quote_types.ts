export interface Route {
	protocol: string;
	fee: string;
	sell_token: string;
	buy_token: string;
	pool_address: string;
}

export interface QswapData {
	commands: number[];
	commandData: string[];
	deadline: number;
}

