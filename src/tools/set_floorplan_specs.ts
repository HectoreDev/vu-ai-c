// src/mcp/tools/setFloorplanSpecs.ts
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { FloorplanSpecs } from "../types/types";

// ---------- parsing helpers ----------
const parseNumberish = (v?: unknown): number | undefined => {
  if (v == null) return undefined;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const s = String(v).trim().toLowerCase();
  if (!s) return undefined;
  const raw = s.replace(/[, ]+/g, "");
  // "1.6k" -> 1600
  if (raw.endsWith("k")) {
    const n = parseFloat(raw.slice(0, -1));
    return Number.isFinite(n) ? n * 1_000 : undefined;
  }
  if (raw.endsWith("m")) {
    const n = parseFloat(raw.slice(0, -1));
    return Number.isFinite(n) ? n * 1_000_000 : undefined;
  }
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : undefined;
};

const Numberish = z.union([z.number(), z.string()]).transform(parseNumberish);

const FloorLoose = z
  .object({
    sqft: Numberish.optional(),
    sqft_min: Numberish.optional(),
    sqft_max: Numberish.optional(),
    bed: Numberish.optional(),
    bedrooms: Numberish.optional(),
    bed_min: Numberish.optional(),
    bed_max: Numberish.optional(),
    bath: Numberish.optional(),
    baths: Numberish.optional(),
    bath_min: Numberish.optional(),
    bath_max: Numberish.optional(),
    garage: Numberish.optional(),
    garages: Numberish.optional(),
    garage_min: Numberish.optional(),
    garage_max: Numberish.optional(),
  })
  .partial();

const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
  sqft: Numberish.optional(),
  sqft_min: Numberish.optional(),
  sqft_max: Numberish.optional(),
  bed: Numberish.optional(),
  bedrooms: Numberish.optional(),
  bed_min: Numberish.optional(),
  bed_max: Numberish.optional(),
  bath: Numberish.optional(),
  baths: Numberish.optional(),
  bath_min: Numberish.optional(),
  bath_max: Numberish.optional(),
  garage: Numberish.optional(),
  garages: Numberish.optional(),
  garage_min: Numberish.optional(),
  garage_max: Numberish.optional(),
  floorplanSpecs: FloorLoose.optional(),
});

type Range = { min: number; max: number } | undefined;

const toRange = (single?: number, min?: number, max?: number): Range => {
  if (typeof single === "number" && Number.isFinite(single)) {
    return { min: single, max: single };
  }

  if (
    typeof min === "number" &&
    Number.isFinite(min) &&
    (typeof max !== "number" || !Number.isFinite(max))
  ) {
    return { min, max: min };
  }
  if (
    typeof max === "number" &&
    Number.isFinite(max) &&
    (typeof min !== "number" || !Number.isFinite(min))
  ) {
    return { min: max, max };
  }

  if (
    typeof min === "number" &&
    Number.isFinite(min) &&
    typeof max === "number" &&
    Number.isFinite(max)
  ) {
    return { min, max };
  }

  return undefined;
};

const normalizeAndValidate = (input: z.infer<typeof ArgsSchema>) => {
  const g = input.floorplanSpecs ?? {};

  const sqftSingle = input.sqft ?? g.sqft;
  const sqftMin = input.sqft_min ?? g.sqft_min;
  const sqftMax = input.sqft_max ?? g.sqft_max;

  const bedSingle = input.bed ?? input.bedrooms ?? g.bed ?? g.bedrooms;
  const bedMin = input.bed_min ?? g.bed_min;
  const bedMax = input.bed_max ?? g.bed_max;

  const bathSingle = input.bath ?? input.baths ?? g.bath ?? g.baths;
  const bathMin = input.bath_min ?? g.bath_min;
  const bathMax = input.bath_max ?? g.bath_max;

  const garageSingle = input.garage ?? input.garages ?? g.garage ?? g.garages;
  const garageMin = input.garage_min ?? g.garage_min;
  const garageMax = input.garage_max ?? g.garage_max;

  const isPositive = (n?: number) => (n == null ? true : n >= 0);
  if (
    ![
      sqftSingle,
      sqftMin,
      sqftMax,
      bedSingle,
      bedMin,
      bedMax,
      bathSingle,
      bathMin,
      bathMax,
      garageSingle,
      garageMin,
      garageMax,
    ].every(isPositive)
  ) {
    return {
      error: "INVALID_VALUE",
      message: "All provided floorplan numbers must be >= 0.",
    };
  }

  const roundIf = (n?: number) =>
    typeof n === "number" ? Math.round(n) : undefined;

  const bedroomRange: Range = toRange(
    roundIf(bedSingle),
    roundIf(bedMin),
    roundIf(bedMax)
  );
  const bathroomRange: Range = toRange(
    roundIf(bathSingle),
    roundIf(bathMin),
    roundIf(bathMax)
  );
  const garageRange: Range = toRange(
    roundIf(garageSingle),
    roundIf(garageMin),
    roundIf(garageMax)
  );
  const sqftRange: Range = toRange(sqftSingle, sqftMin, sqftMax);

  return {
    floorplanPatch: {
      sqft: sqftRange,
      beds: bedroomRange,
      baths: bathroomRange,
      garage: garageRange,
    } as FloorplanSpecs,
  };
};

type Args = z.infer<typeof ArgsSchema>;

export const handleSetFloorplanSpecs = async (rawArgs: Args) => {
  // Session required
  const pre = z
    .object({ sessionId: z.string().trim().min(1).optional() })
    .safeParse(rawArgs);
  if (!pre.success || !pre.data.sessionId) {
    return {
      ok: false,
      error: "MISSING_SESSION",
      message: "Missing sessionId. Ask for the user's name to start a session.",
      suggest: {
        nextTool: "get_name_render",
        reason: "Capture the user's name to create or resume a session.",
      },
    };
  }

  const parsed = ArgsSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.data.sessionId,
      issues: parsed.error.issues,
      message: "Invalid set_floorplan_specs arguments.",
    };
  }

  const { sessionId } = parsed.data;

  const norm = normalizeAndValidate(parsed.data);
  if ("error" in norm) {
    return { ok: false, error: norm.error, sessionId, message: norm.message };
  }

  const { floorplanPatch } = norm;

  // Persist in store (set null for missing, as requested)
  const store = useSessionStore();

  store.setFloorplanSpecs(floorplanPatch);

  return {
    ok: true,
    sessionId,
    saved: { floorplanSpecs: floorplanPatch },
    suggest: {
      nextTool: "home_interest_render",
      reason: "Floorplan specs saved; proceed to capture home must-haves.",
    },
  };
};
