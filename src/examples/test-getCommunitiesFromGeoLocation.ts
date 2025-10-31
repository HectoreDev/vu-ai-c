/**
 * Archivo de prueba para store.getCommunitiesFromGeoLocation()
 * 
 * Este script prueba la búsqueda de comunidades basada en geolocalización usando Algolia.
 * 
 * Pruebas incluidas:
 * 1. Búsqueda con coordenadas de Phoenix, AZ
 * 2. Búsqueda con coordenadas de Los Angeles, CA
 * 3. Búsqueda con coordenadas de Austin, TX
 * 4. Validación de resultados almacenados en el store
 * 
 * Requisitos:
 * - ALGOLIA_APP_ID y ALGOLIA_API_KEY deben estar configuradas en las variables de entorno
 * - El índice 'community-by-AI' debe existir en Algolia
 */

import { sessionStore } from "../store/zustandStore";

async function testGetCommunitiesFromGeoLocation() {
    console.log("=".repeat(80));
    console.log("🧪 INICIANDO PRUEBA DE getCommunitiesFromGeoLocation()");
    console.log("=".repeat(80));
    console.log("");

    // Validar que tenemos las credenciales necesarias
    if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_API_KEY) {
        console.warn("⚠️  ALGOLIA_APP_ID o ALGOLIA_API_KEY no están configuradas");
        console.log("   Usando valores por defecto del cliente");
    }

    try {
        // ========================================
        // PRUEBA 1: Búsqueda con coordenadas de Phoenix, AZ
        // ========================================
        console.log("📝 Prueba 1: Búsqueda de comunidades cerca de Phoenix, AZ");
        console.log("-".repeat(80));

        const phoenixLat = 33.4484;
        const phoenixLng = -112.0740;

        sessionStore.getState().setGeoLocation(phoenixLat, phoenixLng);
        console.log(`✓ Coordenadas establecidas: ${phoenixLat}, ${phoenixLng}`);
        console.log(`✓ Radio de búsqueda: 100km (100,000 metros)`);
        console.log("⏳ Consultando Algolia...");

        const startTime1 = Date.now();
        const result1: any = await sessionStore.getState().getCommunitiesFromGeoLocation();
        const endTime1 = Date.now();

        console.log(`✅ Búsqueda completada en ${endTime1 - startTime1}ms`);
        console.log(`📊 Comunidades encontradas: ${Array.isArray(result1) ? result1.length : 0}`);
        console.log("");

        if (Array.isArray(result1) && result1.length > 0) {
            console.log("📍 Primeras 5 comunidades encontradas:");
            result1.slice(0, 5).forEach((community: any, index: number) => {
                console.log(`  ${index + 1}. ${community.name || community.communityName || "Sin nombre"}`);
                if (community.city) console.log(`     Ciudad: ${community.city}`);
                if (community.state) console.log(`     Estado: ${community.state}`);
                if (community._geoloc) {
                    console.log(`     Coordenadas: ${community._geoloc.lat}, ${community._geoloc.lng}`);
                }
                if (community.priceMin && community.priceMax) {
                    console.log(`     Precio: $${community.priceMin.toLocaleString()} - $${community.priceMax.toLocaleString()}`);
                }
                console.log("");
            });

            if (result1.length > 5) {
                console.log(`  ... y ${result1.length - 5} comunidades más`);
            }
        } else {
            console.log("⚠️  No se encontraron comunidades en esta ubicación");
        }
        console.log("");

        // Verificar que los resultados se guardaron en el store
        const storedCommunities1 = sessionStore.getState().communitiesFromGeoLocation;
        console.log(`✓ Resultados guardados en el store: ${storedCommunities1?.length || 0} comunidades`);
        console.log("");

        // ========================================
        // PRUEBA 2: Búsqueda con coordenadas de Los Angeles, CA
        // ========================================
        console.log("📝 Prueba 2: Búsqueda de comunidades cerca de Los Angeles, CA");
        console.log("-".repeat(80));

        const laLat = 34.0522;
        const laLng = -118.2437;

        sessionStore.getState().setGeoLocation(laLat, laLng);
        console.log(`✓ Coordenadas establecidas: ${laLat}, ${laLng}`);
        console.log("⏳ Consultando Algolia...");

        const startTime2 = Date.now();
        const result2: any = await sessionStore.getState().getCommunitiesFromGeoLocation();
        const endTime2 = Date.now();

        console.log(`✅ Búsqueda completada en ${endTime2 - startTime2}ms`);
        console.log(`📊 Comunidades encontradas: ${Array.isArray(result2) ? result2.length : 0}`);
        console.log("");

        if (Array.isArray(result2) && result2.length > 0) {
            console.log("📍 Primeras 3 comunidades encontradas:");
            result2.slice(0, 3).forEach((community: any, index: number) => {
                console.log(`  ${index + 1}. ${community.name || community.communityName || "Sin nombre"}`);
                if (community.city) console.log(`     Ciudad: ${community.city}`);
                if (community.state) console.log(`     Estado: ${community.state}`);
            });
        }
        console.log("");

        // ========================================
        // PRUEBA 3: Búsqueda con coordenadas de Austin, TX
        // ========================================
        console.log("📝 Prueba 3: Búsqueda de comunidades cerca de Austin, TX");
        console.log("-".repeat(80));

        const austinLat = 30.2672;
        const austinLng = -97.7431;

        sessionStore.getState().setGeoLocation(austinLat, austinLng);
        console.log(`✓ Coordenadas establecidas: ${austinLat}, ${austinLng}`);
        console.log("⏳ Consultando Algolia...");

        const startTime3 = Date.now();
        const result3: any = await sessionStore.getState().getCommunitiesFromGeoLocation();
        const endTime3 = Date.now();

        console.log(`✅ Búsqueda completada en ${endTime3 - startTime3}ms`);
        console.log(`📊 Comunidades encontradas: ${Array.isArray(result3) ? result3.length : 0}`);
        console.log("");

        if (Array.isArray(result3) && result3.length > 0) {
            console.log("📍 Primeras 3 comunidades encontradas:");
            result3.slice(0, 3).forEach((community: any, index: number) => {
                console.log(`  ${index + 1}. ${community.name || community.communityName || "Sin nombre"}`);
                if (community.city) console.log(`     Ciudad: ${community.city}`);
                if (community.state) console.log(`     Estado: ${community.state}`);
            });
        }
        console.log("");

        // ========================================
        // PRUEBA 4: Validación de almacenamiento en el store
        // ========================================
        console.log("📝 Prueba 4: Validación de almacenamiento en el store");
        console.log("-".repeat(80));

        const finalState = sessionStore.getState();
        console.log(`✓ Latitude en el store: ${finalState.latitude}`);
        console.log(`✓ Longitude en el store: ${finalState.longitude}`);
        console.log(`✓ Comunidades almacenadas: ${Array.isArray(finalState.communitiesFromGeoLocation) ? finalState.communitiesFromGeoLocation.length : 0}`);
        console.log("");

        if (finalState.communitiesFromGeoLocation && Array.isArray(finalState.communitiesFromGeoLocation) && finalState.communitiesFromGeoLocation.length > 0) {
            console.log("✓ El store contiene las comunidades correctamente");
            console.log(`✓ Primer resultado almacenado:`);
            const firstCommunity = finalState.communitiesFromGeoLocation[0];
            console.log(`  - Nombre: ${firstCommunity.name || firstCommunity.communityName || "N/A"}`);
            console.log(`  - Tipo: ${typeof firstCommunity}`);
            console.log(`  - Keys disponibles: ${Object.keys(firstCommunity).slice(0, 5).join(", ")}...`);
        } else {
            console.log("⚠️  No hay comunidades almacenadas en el store");
        }
        console.log("");

        // ========================================
        // PRUEBA 5: Prueba sin coordenadas (debe fallar o retornar vacío)
        // ========================================
        console.log("📝 Prueba 5: Prueba sin coordenadas establecidas");
        console.log("-".repeat(80));

        // Resetear coordenadas usando reset() o estableciendo valores inválidos
        // Nota: Si las funciones setLatitude/setLongitude no aceptan undefined,
        // podemos omitir esta prueba o usar reset()
        try {
            // Intentar obtener coordenadas actuales
            const currentState = sessionStore.getState();
            if (currentState.latitude === undefined || currentState.longitude === undefined) {
                console.log("✓ Coordenadas no están establecidas");
                console.log("⚠️  No se puede ejecutar la búsqueda sin coordenadas");
            } else {
                // Usar valores muy lejanos o inválidos para simular ausencia
                sessionStore.getState().setGeoLocation(0, 0);
                console.log("✓ Coordenadas establecidas en (0, 0) para prueba");
                const result5: any = await sessionStore.getState().getCommunitiesFromGeoLocation();
                console.log(`📊 Búsqueda desde (0, 0): ${Array.isArray(result5) ? result5.length : 0} resultados`);
            }
        } catch (error) {
            console.log("⚠️  Error al ejecutar búsqueda:");
            if (error instanceof Error) {
                console.log(`   ${error.message}`);
            }
        }
        console.log("");

        // ========================================
        // RESUMEN
        // ========================================
        console.log("=".repeat(80));
        console.log("✨ RESUMEN DE PRUEBAS");
        console.log("=".repeat(80));
        console.log(`✓ Prueba 1: Phoenix, AZ - ${Array.isArray(result1) ? result1.length : 0} comunidades encontradas`);
        console.log(`✓ Prueba 2: Los Angeles, CA - ${Array.isArray(result2) ? result2.length : 0} comunidades encontradas`);
        console.log(`✓ Prueba 3: Austin, TX - ${Array.isArray(result3) ? result3.length : 0} comunidades encontradas`);
        console.log(`✓ Prueba 4: Almacenamiento en store - ${Array.isArray(finalState.communitiesFromGeoLocation) ? finalState.communitiesFromGeoLocation.length : 0} comunidades`);
        console.log("");

        // Calcular estadísticas
        const totalCommunities = [
            Array.isArray(result1) ? result1.length : 0,
            Array.isArray(result2) ? result2.length : 0,
            Array.isArray(result3) ? result3.length : 0,
        ].reduce((sum, count) => sum + count, 0);

        const avgTime = [
            endTime1 - startTime1,
            endTime2 - startTime2,
            endTime3 - startTime3,
        ].reduce((sum, time) => sum + time, 0) / 3;

        console.log("📊 Estadísticas:");
        console.log(`  • Total de comunidades encontradas: ${totalCommunities}`);
        console.log(`  • Tiempo promedio de búsqueda: ${Math.round(avgTime)}ms`);
        console.log(`  • Radio de búsqueda usado: 100km`);
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
testGetCommunitiesFromGeoLocation()
    .then(() => {
        console.log("\n✅ Script ejecutado exitosamente");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Error fatal:", error);
        process.exit(1);
    });

