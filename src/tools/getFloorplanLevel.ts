import { validateFloorplanLevel, ValidationResult } from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";

export const handleGetFloorplanLevel = async (
  args: any
): Promise<ValidationResult<any>> => {

  const { level_min, level_max } = args.data;

  const response = validateFloorplanLevel({
    level_min,
    level_max,
  },
    `User select number levels ${level_min}, ${level_max}`
  );

  const store = sessionStore.getState();

  store.setFloorplanLevel({
    min: response.data.level_min,
    max: response.data.level_max,
  });

  return response;
};
