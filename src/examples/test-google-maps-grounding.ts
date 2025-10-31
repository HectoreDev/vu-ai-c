/**
 * Archivo de prueba para store.searchWithGoogleMaps()
 * 
 * Este script prueba la integración con Google Maps Grounding usando Gemini API.
 * 
 * Pruebas incluidas:
 * 1. Búsqueda con coordenadas explícitas
 * 2. Búsqueda usando coordenadas del store
 * 3. Búsqueda sin coordenadas
 * 4. Extracción de metadatos de grounding
 * 
 * Requisitos:
 * - GEMINI_API_KEY debe estar configurada en las variables de entorno
 * - El modelo debe ser compatible con Google Maps Grounding:
 *   - gemini-2.5-flash (recomendado)
 *   - gemini-2.5-flash-lite
 *   - gemini-2.5-pro
 *   - gemini-2.0-flash
 */

import { sessionStore } from "../store/zustandStore";

async function testGoogleMapsGrounding() {
    console.log("=".repeat(80));
    console.log("🧪 INICIANDO PRUEBA DE Google Maps Grounding");
    console.log("=".repeat(80));
    console.log("");

    // Validar que tenemos API key
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ Error: GEMINI_API_KEY no está configurada en las variables de entorno");
        process.exit(1);
    }

    try {
        // ========================================
        // PRUEBA 1: Búsqueda con coordenadas explícitas
        // ========================================
        console.log("📝 Prueba 1: Búsqueda con coordenadas explícitas (Los Angeles)");
        console.log("-".repeat(80));

        const query1 = "What are the best Italian restaurants within a 15-minute walk from here?";
        const coordinates1 = {
            latitude: 34.050481,
            longitude: -118.248526,
        };

        console.log(`Query: "${query1}"`);
        console.log(`Coordenadas: ${coordinates1.latitude}, ${coordinates1.longitude}`);
        console.log("⏳ Consultando Gemini API con Google Maps Grounding...");

        const startTime1 = Date.now();
        const result1 = await sessionStore.getState().searchWithGoogleMaps(query1, {
            model: "gemini-2.5-flash",
            latitude: coordinates1.latitude,
            longitude: coordinates1.longitude,
        });
        const endTime1 = Date.now();

        console.log(`✅ Respuesta recibida en ${endTime1 - startTime1}ms`);
        console.log("\n📄 Respuesta generada:");
        console.log(result1.text);
        console.log("");

        if (result1.groundingMetadata?.groundingChunks) {
            console.log("📍 Fuentes de Google Maps encontradas:");
            result1.groundingMetadata.groundingChunks.forEach((chunk, index) => {
                if (chunk.maps) {
                    console.log(`  ${index + 1}. ${chunk.maps.title || "Sin título"}`);
                    console.log(`     URI: ${chunk.maps.uri || "N/A"}`);
                    console.log(`     Place ID: ${chunk.maps.placeId || "N/A"}`);
                    if (chunk.maps.googleMapsWidgetContextToken) {
                        console.log(`     Widget Token: ${chunk.maps.googleMapsWidgetContextToken.substring(0, 50)}...`);
                    }
                }
            });
        } else {
            console.log("ℹ️  No se encontraron metadatos de grounding");
        }
        console.log("");

        // ========================================
        // PRUEBA 2: Búsqueda usando coordenadas del store
        // ========================================
        console.log("📝 Prueba 2: Búsqueda usando coordenadas del store");
        console.log("-".repeat(80));

        // Establecer coordenadas en el store (Austin, TX)
        sessionStore.getState().setGeoLocation(30.2672, -97.7431);
        console.log("✓ Coordenadas establecidas en el store: 30.2672, -97.7431 (Austin, TX)");

        const query2 = "Where are the best coffee shops near me?";
        console.log(`Query: "${query2}"`);
        console.log("⏳ Consultando Gemini API con Google Maps Grounding...");

        const startTime2 = Date.now();
        const result2 = await sessionStore.getState().searchWithGoogleMaps(query2, {
            model: "gemini-2.5-flash",
        });
        const endTime2 = Date.now();

        console.log(`✅ Respuesta recibida en ${endTime2 - startTime2}ms`);
        console.log("\n📄 Respuesta generada:");
        console.log(result2.text);
        console.log("");

        if (result2.groundingMetadata?.groundingChunks) {
            console.log(`📍 Fuentes de Google Maps encontradas: ${result2.groundingMetadata.groundingChunks.length}`);
            result2.groundingMetadata.groundingChunks.slice(0, 3).forEach((chunk, index) => {
                if (chunk.maps) {
                    console.log(`  ${index + 1}. ${chunk.maps.title || "Sin título"}`);
                }
            });
            if (result2.groundingMetadata.groundingChunks.length > 3) {
                console.log(`  ... y ${result2.groundingMetadata.groundingChunks.length - 3} más`);
            }
        }
        console.log("");

        // ========================================
        // PRUEBA 3: Búsqueda sin coordenadas (solo texto descriptivo)
        // ========================================
        console.log("📝 Prueba 3: Búsqueda sin coordenadas (solo texto descriptivo)");
        console.log("-".repeat(80));

        const query3 = "What are the top museums in San Francisco?";
        console.log(`Query: "${query3}"`);
        console.log("⏳ Consultando Gemini API con Google Maps Grounding...");

        const startTime3 = Date.now();
        const result3 = await sessionStore.getState().searchWithGoogleMaps(query3, {
            model: "gemini-2.5-flash",
        });
        const endTime3 = Date.now();

        console.log(`✅ Respuesta recibida en ${endTime3 - startTime3}ms`);
        console.log("\n📄 Respuesta generada:");
        console.log(result3.text);
        console.log("");

        if (result3.groundingMetadata?.groundingChunks) {
            console.log(`📍 Fuentes de Google Maps encontradas: ${result3.groundingMetadata.groundingChunks.length}`);
            result3.groundingMetadata.groundingChunks.slice(0, 3).forEach((chunk, index) => {
                if (chunk.maps) {
                    console.log(`  ${index + 1}. ${chunk.maps.title || "Sin título"}`);
                }
            });
            if (result3.groundingMetadata.groundingChunks.length > 3) {
                console.log(`  ... y ${result3.groundingMetadata.groundingChunks.length - 3} más`);
            }
        }
        console.log("");

        // ========================================
        // PRUEBA 4: Búsqueda relacionada con comunidades residenciales
        // ========================================
        console.log("📝 Prueba 4: Búsqueda relacionada con comunidades residenciales");
        console.log("-".repeat(80));

        const query4 = "What are the best schools near this location?";
        const coordinates4 = {
            latitude: 33.389400,
            longitude: -112.591818,
        };

        console.log(`Query: "${query4}"`);
        console.log(`Coordenadas: ${coordinates4.latitude}, ${coordinates4.longitude}`);
        console.log("⏳ Consultando Gemini API con Google Maps Grounding...");

        const startTime4 = Date.now();
        const result4 = await sessionStore.getState().searchWithGoogleMaps(query4, {
            model: "gemini-2.5-flash",
            latitude: coordinates4.latitude,
            longitude: coordinates4.longitude,
        });
        const endTime4 = Date.now();

        console.log(`✅ Respuesta recibida en ${endTime4 - startTime4}ms`);
        console.log("\n📄 Respuesta generada:");
        console.log(result4.text);
        console.log("");

        if (result4.groundingMetadata?.groundingChunks) {
            console.log(`📍 Fuentes de Google Maps encontradas: ${result4.groundingMetadata.groundingChunks.length}`);
            result4.groundingMetadata.groundingChunks.forEach((chunk, index) => {
                if (chunk.maps) {
                    console.log(`  ${index + 1}. ${chunk.maps.title || "Sin título"}`);
                    if (chunk.maps.uri) {
                        console.log(`     ${chunk.maps.uri}`);
                    }
                }
            });
        }
        console.log("");

        // ========================================
        // RESUMEN
        // ========================================
        console.log("=".repeat(80));
        console.log("✨ RESUMEN DE PRUEBAS");
        console.log("=".repeat(80));
        console.log(`✓ Prueba 1: Búsqueda con coordenadas explícitas - ${result1.groundingMetadata?.groundingChunks?.length || 0} fuentes`);
        console.log(`✓ Prueba 2: Búsqueda usando coordenadas del store - ${result2.groundingMetadata?.groundingChunks?.length || 0} fuentes`);
        console.log(`✓ Prueba 3: Búsqueda sin coordenadas - ${result3.groundingMetadata?.groundingChunks?.length || 0} fuentes`);
        console.log(`✓ Prueba 4: Búsqueda relacionada con comunidades - ${result4.groundingMetadata?.groundingChunks?.length || 0} fuentes`);
        console.log("");
        console.log("✅ Todas las pruebas completadas exitosamente");
        console.log("=".repeat(80));

    } catch (error) {
        console.error("\n❌ Error durante las pruebas:");
        if (error instanceof Error) {
            console.error(`  Mensaje: ${error.message}`);
            console.error(`  Stack: ${error.stack}`);
        } else {
            console.error(error);
        }
        throw error;
    }
}

// Ejecutar las pruebas
console.log("\n");
testGoogleMapsGrounding()
    .then(() => {
        console.log("\n✅ Script ejecutado exitosamente");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Error fatal:", error);
        process.exit(1);
    });

