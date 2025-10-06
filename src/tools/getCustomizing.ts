import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import {
  customizingSchema,
  validateCustomizing,
  ValidationResult,
} from "../schemas/store.schema";

type Args = z.infer<typeof customizingSchema>;

export const handleGetCustomizing = async (
  args: Args
): Promise<ValidationResult<Args>> => {
  
  const response = validateCustomizing(
    args.customizing,
    `User select customizing ${args.customizing}`
  );

  const { customizing } = response.data;

  const store = useSessionStore();

  store.setCustomizing(customizing);

  return response;
};
