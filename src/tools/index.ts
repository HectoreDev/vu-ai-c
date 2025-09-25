import { handleStartSession } from "./../tools/start_session";
import { handleInterestedFindHome } from "./../tools/set_find_home_interest";
import { handleSetName } from "./../tools/set_name";
import { handleSetLocation } from "./../tools/set_location";
import { handleGetInterestRate } from "./../tools/set_interest_rate";
import { handleSetBudget } from "./../tools/set_budget";
import { handleCustomizing } from "./../tools/set_customizing";

export const toolStartSession = handleStartSession;
export const toolInterestedFindHome = handleInterestedFindHome;
export const toolSetName = handleSetName;
export const toolSetLocation = handleSetLocation;
export const toolSetInterestRate = handleGetInterestRate;
export const toolSetBudget = handleSetBudget;
export const toolSetCustomizing = handleCustomizing;
