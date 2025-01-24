import { NewTwinMetadata } from "@/blockchain_api/functions/icp/new_twin_token";
import { getChainName } from "@/common/helpers/utils";
import { ModalStepDataReturn } from "../_types";

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


export const ModalStepData = new Map<number, ModalStepDataReturn>([
    [
        2,
        {
            title: "Step 1",
            pending: "Please approve the transaction",
            successfull: "Approved successfully",
            failed: "Failed to approve transaction",
        },
    ],
    [
        3,
        {
            title: "Step 2",
            pending: "Sending transaction request to the network",
            successfull: "Sent Successfully",
            failed: "Failed to send transaction",
        },
    ],
    [
        4,
        {
            title: "Step 3",
            pending: "Waiting for new twin token verification",
            successfull: "Verified successfully",
            failed: "Failed to create new twin token",
        },
    ],
]);