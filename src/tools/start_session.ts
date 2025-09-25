import { useSessionStore } from "./../store/zustandStore";

export const handleStartSession = async () => {
  const sessionId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const store = useSessionStore();
  store.setSessionId({ sessionId } as any);

  return {
    ok: true,
    sessionId,
    step: "get_name",
    state: store,
    suggest: {
      nextTool: "get_name",
      reason: "Ask the user how they want to be addressed.",
    },
  };
};
