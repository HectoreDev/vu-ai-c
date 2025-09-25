import { getMinMaxPricesFromAlgolia } from "./searchAlgolia";

export const getMinMaxPrices = async (location: string, sessionId: string) => {
    console.log(`🔍 Buscando precios min/max para ubicación: ${location}, sesión: ${sessionId}`);

    const result = await getMinMaxPricesFromAlgolia(location, sessionId);

    if (result.success && result.data) {
        console.log("✅ Precios encontrados:", JSON.stringify(result.data));
    } else {
        console.log("❌ Error buscando precios:", result.error);
    }

    return result;
}