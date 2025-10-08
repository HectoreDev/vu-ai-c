import { validateFloorplanBath, ValidationResult } from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";

export const handleGetFloorplanBath = async (
  args: any
): Promise<ValidationResult<any>> => {

  const { bath_min, bath_max } = args.data;

  const response = validateFloorplanBath({
    min: bath_min,
    max: bath_max,
  },
    `User select number baths ${bath_min}, ${bath_max}`
  );

  const store = sessionStore.getState();

  store.setFloorplanBath({
    min: response.data.bath_min,
    max: response.data.bath_max,
  });

  return response;
};
