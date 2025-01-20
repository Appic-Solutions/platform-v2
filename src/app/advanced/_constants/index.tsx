import { NewTwinMetadata } from "@/blockchain_api/functions/icp/new_twin_token";
import { getChainName } from "@/common/helpers/utils";

export const Step2Data = (newTwinMeta: NewTwinMetadata | undefined) => [
    {
        title: 'Original Token Name:',
        value: newTwinMeta?.evm_base_token.name,
    },
    {
        title: 'Original Token Symbol:',
        value: newTwinMeta?.evm_base_token.symbol,
    },
    {
        title: 'Original Blockchain:',
        value: getChainName(newTwinMeta?.evm_base_token.chain_id),
    },
    {
        title: 'Twin Token Name:',
        value: newTwinMeta?.icp_twin_token.name,
    },
    {
        title: 'Twin Token Symbol:',
        value: newTwinMeta?.icp_twin_token.symbol,
    },
    {
        title: 'Twin Token Blockchain:',
        value: `${getChainName(newTwinMeta?.icp_twin_token.chain_id)}`,
    },
    {
        title: 'Twin Token Creation Fee:',
        value: `${newTwinMeta?.human_readable_creation_fee} ICP`,
    },
];