import { handleStartSession } from "./start_session";
import { handleGetInterestFindHome } from "./getInterestFindHome";
import { handleGetName } from "./getName";
import { handleGetLocation } from "./getLocation";
import { getInterestRateType } from "./getInterestRateType";
import { handleGetBudget } from "./getBudget";
import { handleGetCustomizing } from "./getCustomizing";
import { handleGetRenting } from "./getRenting";
import { handleGetInterestedHome } from "./getInterestedHome";
import { handleSearchCommunities } from "./search_community";
import { handleGetMoveInReady } from "./getMoveInReady";
import { handleGetFloorplanBed } from "./getFloorplanBed";
import { handleGetFloorplanBath } from "./getFloorplanBath";
import { handleGetFloorplanSqft } from "./getFloorplanSqft";
import { handleGetFloorplanGarage } from "./getFloorplanGarage";
import { handleGetFloorplanLevel } from "./getFloorplanLevel";
import { handleGetAmenities } from "./getAmenities";

export const toolStartSession = handleStartSession;
export const toolGetInterestedFindHome = handleGetInterestFindHome; //
export const toolGetName = handleGetName; //
export const toolGetLocation = handleGetLocation;  //
export const toolGetInterestRate = getInterestRateType;  //
export const toolGetBudget = handleGetBudget; // 
export const toolGetCustomizing = handleGetCustomizing; //
export const toolGetRenting = handleGetRenting; //
export const toolGetFloorplanBed = handleGetFloorplanBed;
export const toolGetFloorplanBath = handleGetFloorplanBath;
export const toolGetFloorplanSqft = handleGetFloorplanSqft;
export const toolGetFloorplanGarage = handleGetFloorplanGarage;
export const toolGetFloorplanLevel = handleGetFloorplanLevel;
export const toolGetInterestingHome = handleGetInterestedHome; //
export const toolSearchComunities = handleSearchCommunities;
export const toolGetMoveInReady = handleGetMoveInReady; //
export const toolGetAmenities = handleGetAmenities; //
