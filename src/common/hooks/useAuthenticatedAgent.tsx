import { useAgent } from "@nfid/identitykit/react";

export const useAuthenticatedAgent = () => {
  // Use an authenticatedAgent when making authenticated calls.
  // A wallet approval pop-up will be displayed if necessary.
  const authenticatedAgent = useAgent();
  return authenticatedAgent;
};
