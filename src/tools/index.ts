import { handleStartSession } from "./../tools/start_session";
import { handleInterestedFindHome } from "./../tools/set_find_home_interest";
import { handleSetName } from "./../tools/set_name";
import { handleSetLocation } from "./../tools/set_location";

export const toolStartSession = handleStartSession;
export const toolInterestedFindHome = handleInterestedFindHome;
export const toolSetName = handleSetName;
export const toolSetLocation = handleSetLocation;
