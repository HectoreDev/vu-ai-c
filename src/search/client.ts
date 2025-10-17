import { algoliasearch } from "algoliasearch";

interface IFClientConfig {
  applicationID: string;
  apiKey: string;
}

const clientConfig: IFClientConfig = {
  applicationID: process.env.ALGOLIA_APP_ID || "",
  apiKey: process.env.ALGOLIA_API_KEY || "",
};

export const client = algoliasearch(
  clientConfig.applicationID,
  clientConfig.apiKey,
);
