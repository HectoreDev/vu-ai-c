import { algoliasearch } from "algoliasearch";

interface IFClientConfig {
  applicationID: string;
  apiKey: string;
}

const clientConfig: IFClientConfig = {
  applicationID: process.env.ALGOLIA_APP_ID || "5WEGK1QY4E",
  apiKey: process.env.ALGOLIA_API_KEY || "41716df1c4ed609036405ed46647e5df",
};

// Validar que tenemos las credenciales necesarias
if (!clientConfig.applicationID || !clientConfig.apiKey) {
  throw new Error("Algolia credentials are missing. Please check your environment variables.");
}

export const client = algoliasearch(
  clientConfig.applicationID,
  clientConfig.apiKey,
);
