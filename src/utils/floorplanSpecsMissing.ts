import { FloorplanSpecs } from "../types/types";



export const floorplanSpecsMissing = (floorplanSpecs: FloorplanSpecs) => {
  const missing: string[] = [];

  for (const key of Object.keys(floorplanSpecs) as (keyof FloorplanSpecs)[]) {
    const range = floorplanSpecs[key];

    if (!range || (range.min == null && range.max == null)) {
      missing.push(key);
    }
  }

  return missing;
}