import { getAmenitiesFromPricesAlgolia } from "./searchAlgolia";

export const getAmenitiesFromPrices = async (location: string, sessionId: string, priceMin: number, priceMax: number) => {
    console.log(`🔍 Buscando amenidades para ubicación: ${location}, rango: $${priceMin}-$${priceMax}, sesión: ${sessionId}`);

    const result = await getAmenitiesFromPricesAlgolia(location, sessionId, priceMin, priceMax);

    if (result.success && result.data) {
        console.log("✅ Amenidades encontradas:", JSON.stringify(result.data));
    } else {
        console.log("❌ Error buscando amenidades:", result.error);
    }

    return result;
}