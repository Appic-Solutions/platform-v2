// The flow of a new twin token create is as follow

// 1st: Find the base token information from the appic helper contract
// 2nd: Approve icp spending for lsm canister
// 3rd: request a new twin token through lsm
// 4th: wait until the twin token is created(this step should be called on a minute interval basis)
