'use client';
import { IdentityKitAuthType } from '@nfid/identitykit';
import { IdentityKitProvider } from '@nfid/identitykit/react';
import { NFIDW, InternetIdentity, Stoic, OISY } from '@nfid/identitykit';

import { wagmiAdapter, projectId } from '@/lib/configs/wagmi';
import { createAppKit } from '@reown/appkit/react';
import { mainnet, arbitrum, avalanche, base, optimism, polygon, bsc } from '@reown/appkit/networks';
import { WagmiProvider, type Config } from 'wagmi';

if (!projectId) {
	throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
	name: 'Appicdao',
	description: 'Appic crosschain swap on icp',
	url: 'http://app.appicdao.com', // origin must match your domain & subdomain
	icons: ['https://assets.reown.com/reown-profile-pic.png'],
	debug: true,
};

// Create the modal
createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: [mainnet, arbitrum, avalanche, base, optimism, polygon, bsc],
	defaultNetwork: mainnet,

	metadata: metadata,
	features: {
		analytics: true, // Optional - defaults to your Cloud configuration
	},
});

const IdentityKitCustomSignerAuthType = {
	[NFIDW.id]: IdentityKitAuthType.DELEGATION,
	['Plug']: IdentityKitAuthType.DELEGATION,
	[OISY.id]: IdentityKitAuthType.ACCOUNTS, // does not support icrc34_delegation
	[InternetIdentity.id]: IdentityKitAuthType.DELEGATION, // does not support icrc27_accounts
	[Stoic.id]: IdentityKitAuthType.DELEGATION, // does not support icrc27_accounts
};

// const targets = process.env.NODE_ENV == "production" ? ["4ati2-naaaa-aaaad-qg6la-cai", "2ztvj-yaaaa-aaaap-ahiza-cai"] : [];


export const WalletWrapper = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
			<IdentityKitProvider
				authType={IdentityKitCustomSignerAuthType}
				signers={[OISY, NFIDW, InternetIdentity, Stoic]}
				signerClientOptions={{ targets: ["2ztvj-yaaaa-aaaap-ahiza-cai"] }}
			>
				{children}
			</IdentityKitProvider>
		</WagmiProvider>
	);
};
