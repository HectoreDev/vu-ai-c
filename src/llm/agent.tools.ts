import { SchemaType, type FunctionDeclaration } from "@google/generative-ai";

export const fdStartSession: FunctionDeclaration = {
  name: "start_session",
  description:
    "Create a new conversation session ID, initialize server state, and set the next step to 'get_name'. " +
    "After this, you SHOULD call get_name_render with the returned sessionId.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {},
  },
};

export const fdGetName: FunctionDeclaration = {
  name: "get_name",
  description:
    "Persist how the user wants to be addressed. If a name is known, send {name}; Creates a sessionId if omitted.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description: "Optional. If omitted, a new session will be created.",
      },
      name: {
        type: SchemaType.STRING,
        description:
          "The user's preferred name.",
      },
    },
  },
};

export const fdGetLocation: FunctionDeclaration = {
  name: "get_location",
  description:
    "Persist the user's preferred locations. Accepts 'locations' (array). If 'sessionId' is missing, returns ok:false and suggests asking the user's name to start a session.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description: "Required. If missing, the tool will respond with a suggestion to ask for the user's name.",
      },
      locations: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Array of city/state names, e.g., ['Orlando','Phoenix'].",
      },
     
    },
  },
};

export const fdInterestedFindHome: FunctionDeclaration = {
  name: "interesed_find_home",
  description:
    "Persist the user's motivations for finding a home. Accepts 'interest' or 'interests' (array or string). If 'sessionId' is missing, returns ok:false and suggests asking for the user's name to start a session.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description: "Required. If missing, the tool responds with a suggestion to capture the user's name.",
      },
      interest: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Array of interest tags.",
      }
    },
  },
};

export const FUNCTION_DECLARATIONS: FunctionDeclaration[] = [
  fdStartSession,
  fdGetName,
  fdGetLocation,
  fdInterestedFindHome
];
