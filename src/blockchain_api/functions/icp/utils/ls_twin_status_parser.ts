import { CandidErc20TwinLedgerSuiteStatus } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';

export const parse_new_twin_request_status = (request_status: CandidErc20TwinLedgerSuiteStatus): twinLsRequest => {
  if ('PendingApproval' in request_status) return 'PendingApproval';
  else if ('Created' in request_status) return 'Created';
  else if ('Installed' in request_status) return 'Installed';
  else return 'PendingApproval';
};

export type twinLsRequest = 'PendingApproval' | 'Created' | 'Installed';
