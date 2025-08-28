export function checkSession(data: any) {
    if (!data || !data.id || data.id !== 58) {
        throw new Error("Sesión no válida o id de sesión faltante");
    }
} 