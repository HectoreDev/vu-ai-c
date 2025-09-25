// DEPRECATED: Use UnifiedSessionData from SessionService instead
export interface SessionState {
    step: number; // 0: session-start, 1: get-name, 2: get-location, 3: get-min-max-prices, 4: get-amenities-from-prices, 5: get-communities, 6: get-community-info, 7: completed
    name?: string;
    locations?: string[];
    priceMin?: number;
    priceMax?: number;
    amenities?: string;
    communities?: string;
    community?: string;
    lastToolUsed?: string;
    sessionId?: string;
    mcpSessionId?: string; // Token de sesión del sistema MCP
    welcome?: string | null;
    nameSpecs?: string | null;
    interest?: string[];
    markets?: string[];
    budgetProduct?: string | null;
    budgetType?: string | null;
    budget?: number | undefined;
    customizing?: string | null;
    moveInReady?: string | null;
    renting?: string | null;
    floorplanSpecs?: string | undefined;
    homeInterest?: string[];
}

// Nuevos tipos que reemplazan SessionState
export interface ConversationFlowState {
    step: number;
    lastToolUsed?: string;
    communities?: string;
    community?: string;
}

export interface MCPSessionData {
    id: string;
    userId?: string;
    name?: string;
    locations?: string[];
    priceMin?: number;
    priceMax?: number;
    amenities?: string[];
    createdAt: Date;
    expiresAt: Date;
    isActive: boolean;
}

export interface UnifiedSessionData {
    mcpSession: MCPSessionData;
    flowState: ConversationFlowState;
}

export interface ChatResponse {
    success: boolean;
    response?: string;
    error?: string;
    sessionId?: string;
    toolsUsed?: string[];
    sessionState?: {
        step: number;
        completed: boolean;
        nextAction: string;
        sessionEnded?: boolean;
    };
    // Campos específicos según el tool usado
    text?: string;
    priceMin?: number;
    priceMax?: number;
    location?: string;
    amenities?: string[];
    communities?: Array<{
        uid: string;
        name: string;
    }>;
    community?: any;
}

export interface FunctionCallResult {
    name: string;
    args: any;
}

export interface ToolResult {
    success: boolean;
    data?: any;
    error?: string;
}

export interface PromptContext {
    message: string;
    sessionState: SessionState;
    availableData: string;
    contextInfo: string;
    nextAction: string;
    shouldUseFunction: boolean;
}
