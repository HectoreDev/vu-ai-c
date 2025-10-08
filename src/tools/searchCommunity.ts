// src/mcp/tools/searchCommunities.ts
import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";

// ⚠️ Usa tu wrapper real (NO importa Algolia aquí)
// import { queryCommunities } from "../../search/community.search";
import { parseNum } from "../utils/parseNum";
import { validateSession } from "../utils/validateSession";
import { searchAlgolia } from "../functions/searchAlgolia";
import { ValidationResult } from "../schemas/store.schema";
// Se asume firma: queryCommunities({ markets: string[], budgetMin: number, budgetMax: number, limit?: number })
//   -> Promise<{ hits: Array<{ communityUID: string; name: string; market?: string; divisionUID?: string; price_min?: number; price_max?: number }> }>

const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
});

type HitOption = {
  value: string;
  name: string;
  divisionUID?: string;
  communityUID: string;
  price_min?: number;
  price_max?: number;
};


type Args = z.infer<typeof undefined>;

export const handleSearchCommunities = async (): Promise<ValidationResult<any>> => {

  const {
    locations,
    priceMin,
    priceMax,
    sessionId
  } = useSessionStore.getState();

  if(!sessionId || !locations){
   return {
      success: false,
      code: 400,
      data: null,
      history: [],
      error: '',
      message: ''
    }
  }

  const response = await searchAlgolia({
    location: locations,
    priceMin,
    priceMax
  });

  return {
    success: true,
    code: 200,
    data: response.data,
    history: [],
    error: null,
    message: `Comunities search`,
  }
  
};
