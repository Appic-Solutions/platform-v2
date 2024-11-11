import { HttpAgent } from "@dfinity/agent";
import { useEffect, useState } from "react";

const ICP_API_HOST = "https://icp-api.io/";

export const useUnAuthenticatedAgent = () => {
  const [unauthenticatedAgent, setUnauthenticatedAgent] = useState<HttpAgent | undefined>();

  useEffect(() => {
    HttpAgent.create({ host: ICP_API_HOST }).then(setUnauthenticatedAgent);
  }, []);
  return unauthenticatedAgent;
};
