// Sistema de gestión de sesiones
interface SessionData {
	id: string;
	userId?: string;
	name?: string;
	location?: string;
	priceMin?: number;
	priceMax?: number;
	amenities?: string[];
	createdAt: Date;
	expiresAt: Date;
	isActive: boolean;
}

// Almacén temporal de sesiones activas
const activeSessions = new Map<string, SessionData>();
// Utilidades de sesión
export function generateSessionToken(): string {
	return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createSession(userData?: any): SessionData {
	const sessionId = generateSessionToken();
	const now = new Date();
	const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas

	const session: SessionData = {
		id: sessionId,
		userId: userData?.userId,
		name: userData?.name,
		createdAt: now,
		expiresAt: expiresAt,
		isActive: true
	};

	activeSessions.set(sessionId, session);
	return session;
}

export function validateSession(sessionId: string): { valid: boolean; session?: SessionData; error?: string } {
	if (!sessionId) {
		return { valid: false, error: "ID de sesión requerido" };
	}

	const session = activeSessions.get(sessionId);
	if (!session) {
		return { valid: false, error: "Sesión no encontrada" };
	}

	if (!session.isActive) {
		return { valid: false, error: "Sesión inactiva" };
	}

	if (new Date() > session.expiresAt) {
		session.isActive = false;
		activeSessions.delete(sessionId);
		return { valid: false, error: "Sesión expirada" };
	}

	return { valid: true, session };
}

export function updateSession(sessionId: string, updateData: Partial<SessionData>): { success: boolean; session?: SessionData; error?: string } {
	const validation = validateSession(sessionId);
	if (!validation.valid) {
		return { success: false, error: validation.error };
	}

	const session = validation.session!;
	Object.assign(session, updateData, { id: sessionId }); // Preservar el ID
	activeSessions.set(sessionId, session);

	return { success: true, session };
}

export function invalidateSession(sessionId: string): boolean {
	const session = activeSessions.get(sessionId);
	if (session) {
		session.isActive = false;
		activeSessions.delete(sessionId);
		return true;
	}
	return false;
}

export function getSessionInfo(sessionId: string): SessionData | null {
	return activeSessions.get(sessionId) || null;
}

export function getAllActiveSessions(): SessionData[] {
	return Array.from(activeSessions.values()).filter(session => session.isActive);
}

export function cleanExpiredSessions(): number {
	const now = new Date();
	let cleaned = 0;

	for (const [sessionId, session] of activeSessions.entries()) {
		if (!session.isActive || now > session.expiresAt) {
			activeSessions.delete(sessionId);
			cleaned++;
		}
	}

	return cleaned;
}
// Limpieza automática cada 30 minutos
setInterval(() => {
	const cleaned = cleanExpiredSessions();
	if (cleaned > 0) {
		console.log(`🧹 Limpiadas ${cleaned} sesiones expiradas`);
	}
}, 30 * 60 * 1000);

export async function executeSessionTool(args: any) {
	const session = createSession(args.data);
	return {
		success: true,
		data: {
			sessionId: session.id,
			message: "Sesión iniciada correctamente",
			nextStep: "Ahora necesito que me proporciones tu nombre.",
			expiresAt: session.expiresAt.toISOString()
		}
	};
}

export async function executeCheckSessionTool(args: any) {
	// Verificar sesión usando el nuevo sistema
	const sessionId = args.data?.sessionId || args.data?.token || args.data?.id;
	const validation = validateSession(sessionId);

	if (!validation.valid) {
		return {
			success: false,
			error: validation.error || "Sesión inválida",
			valid: false
		};
	}

	return {
		success: true,
		valid: true,
		sessionId: sessionId,
		session: validation.session,
		message: "Sesión válida y activa"
	};
}

