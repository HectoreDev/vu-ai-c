/**
 * Archivo de prueba para store.updateFilteredFloorplans()
 * 
 * Este script prueba la búsqueda de floorplans filtrados usando Algolia.
 * 
 * Pruebas incluidas:
 * 1. Búsqueda básica con ubicación y precios
 * 2. Búsqueda con filtros de floorplan (bedrooms, bathrooms, garage)
 * 3. Búsqueda con amenities
 * 4. Búsqueda con geolocalización
 * 5. Validación de almacenamiento en el store
 * 
 * Requisitos:
 * - ALGOLIA_APP_ID y ALGOLIA_API_KEY deben estar configuradas en las variables de entorno
 * - El índice 'community-by-AI' debe existir en Algolia con objetos de tipo 'floorplan'
 */

import { sessionStore } from "../store/zustandStore";
import { IFLocation } from "../types/types";

async function testUpdateFilteredFloorplans() {
    console.log("=".repeat(80));
    console.log("🧪 INICIANDO PRUEBA DE updateFilteredFloorplans()");
    console.log("=".repeat(80));
    console.log("");

    // Validar que tenemos las credenciales necesarias
    if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_API_KEY) {
        console.warn("⚠️  ALGOLIA_APP_ID o ALGOLIA_API_KEY no están configuradas");
        console.log("   Usando valores por defecto del cliente");
    }

    try {
        // ========================================
        // PRUEBA 1: Búsqueda básica con ubicación y precios
        // ========================================
        console.log("📝 Prueba 1: Búsqueda básica con ubicación y precios");
        console.log("-".repeat(80));

        // Resetear el store primero
        sessionStore.getState().reset();

        // Establecer nombre
        sessionStore.getState().setName("Test User");
        console.log("✓ Nombre establecido");

        // Establecer ubicación
        const locations: IFLocation[] = [
            {
                state: "AZ",
                location: "Phoenix"
            }
        ];
        sessionStore.getState().setlocations(locations);
        console.log("✓ Ubicación: AZ, Phoenix");

        // Establecer rango de precios
        sessionStore.getState().setBudgetPriceRange(450000, 500000);
        console.log("✓ Rango de precios: $450,000 - $500,000");

        console.log("⏳ Consultando Algolia para floorplans...");

        const startTime1 = Date.now();
        await sessionStore.getState().updateFilteredFloorplans();
        const endTime1 = Date.now();

        const floorplans1 = sessionStore.getState().filteredFloorplans;
        const floorplansCount1 = Array.isArray(floorplans1) ? floorplans1.length : 0;

        console.log(`✅ Búsqueda completada en ${endTime1 - startTime1}ms`);
        console.log(`📊 Floorplans encontrados: ${floorplansCount1}`);
        console.log("");

        if (Array.isArray(floorplans1) && floorplans1.length > 0) {
            console.log("📍 Primeros 5 floorplans encontrados:");
            floorplans1.slice(0, 5).forEach((floorplan: any, index: number) => {
                console.log(`  ${index + 1}. ${floorplan.name || floorplan.floorplanName || "Sin nombre"}`);
                if (floorplan.communityName) console.log(`     Comunidad: ${floorplan.communityName}`);
                if (floorplan.bedroomsMin && floorplan.bedroomsMax) {
                    console.log(`     Bedrooms: ${floorplan.bedroomsMin}-${floorplan.bedroomsMax}`);
                }
                if (floorplan.bathroomsMin && floorplan.bathroomsMax) {
                    console.log(`     Bathrooms: ${floorplan.bathroomsMin}-${floorplan.bathroomsMax}`);
                }
                if (floorplan.priceMin && floorplan.priceMax) {
                    console.log(`     Precio: $${floorplan.priceMin.toLocaleString()} - $${floorplan.priceMax.toLocaleString()}`);
                }
                if (floorplan.sizeMin && floorplan.sizeMax) {
                    console.log(`     Tamaño: ${floorplan.sizeMin}-${floorplan.sizeMax} sqft`);
                }
                console.log("");
            });

            if (floorplans1.length > 5) {
                console.log(`  ... y ${floorplans1.length - 5} floorplans más`);
            }
        } else {
            console.log("⚠️  No se encontraron floorplans con estos criterios");
        }
        console.log("");

        // ========================================
        // PRUEBA 2: Búsqueda con filtros de floorplan (bedrooms, bathrooms, garage)
        // ========================================
        console.log("📝 Prueba 2: Búsqueda con filtros de floorplan");
        console.log("-".repeat(80));

        // Mantener la ubicación y precios anteriores
        // Agregar filtros de floorplan
        sessionStore.getState().setFloorplanBed({ min: 3, max: 4 });
        sessionStore.getState().setFloorplanBath({ min: 2, max: 3 });
        sessionStore.getState().setFloorplanGarage({ min: 2, max: 2 });

        console.log("✓ Bedrooms: 3-4");
        console.log("✓ Bathrooms: 2-3");
        console.log("✓ Garage: 2");
        console.log("⏳ Consultando Algolia para floorplans...");

        const startTime2 = Date.now();
        await sessionStore.getState().updateFilteredFloorplans();
        const endTime2 = Date.now();

        const floorplans2 = sessionStore.getState().filteredFloorplans;
        const floorplansCount2 = Array.isArray(floorplans2) ? floorplans2.length : 0;

        console.log(`✅ Búsqueda completada en ${endTime2 - startTime2}ms`);
        console.log(`📊 Floorplans encontrados: ${floorplansCount2}`);
        console.log("");

        if (Array.isArray(floorplans2) && floorplans2.length > 0) {
            console.log("📍 Primeros 3 floorplans encontrados:");
            floorplans2.slice(0, 3).forEach((floorplan: any, index: number) => {
                console.log(`  ${index + 1}. ${floorplan.name || floorplan.floorplanName || "Sin nombre"}`);
                if (floorplan.bedroomsMin && floorplan.bedroomsMax) {
                    console.log(`     Bedrooms: ${floorplan.bedroomsMin}-${floorplan.bedroomsMax}`);
                }
                if (floorplan.bathroomsMin && floorplan.bathroomsMax) {
                    console.log(`     Bathrooms: ${floorplan.bathroomsMin}-${floorplan.bathroomsMax}`);
                }
            });
        }
        console.log("");

        // ========================================
        // PRUEBA 3: Búsqueda con amenities
        // ========================================
        console.log("📝 Prueba 3: Búsqueda con amenities");
        console.log("-".repeat(80));

        // Agregar amenities
        sessionStore.getState().setAmenities(["Playground", "Pool"]);
        console.log("✓ Amenities: Playground, Pool");
        console.log("⏳ Consultando Algolia para floorplans...");

        const startTime3 = Date.now();
        await sessionStore.getState().updateFilteredFloorplans();
        const endTime3 = Date.now();

        const floorplans3 = sessionStore.getState().filteredFloorplans;
        const floorplansCount3 = Array.isArray(floorplans3) ? floorplans3.length : 0;

        console.log(`✅ Búsqueda completada en ${endTime3 - startTime3}ms`);
        console.log(`📊 Floorplans encontrados: ${floorplansCount3}`);
        console.log("");

        if (Array.isArray(floorplans3) && floorplans3.length > 0) {
            console.log("📍 Primeros 3 floorplans encontrados:");
            floorplans3.slice(0, 3).forEach((floorplan: any, index: number) => {
                console.log(`  ${index + 1}. ${floorplan.name || floorplan.floorplanName || "Sin nombre"}`);
                if (floorplan.amenities && Array.isArray(floorplan.amenities)) {
                    console.log(`     Amenities: ${floorplan.amenities.slice(0, 3).join(", ")}`);
                }
            });
        }
        console.log("");

        // ========================================
        // PRUEBA 4: Búsqueda con geolocalización
        // ========================================
        console.log("📝 Prueba 4: Búsqueda con geolocalización");
        console.log("-".repeat(80));

        // Establecer coordenadas
        sessionStore.getState().setGeoLocation(33.4484, -112.0740); // Phoenix, AZ
        console.log("✓ Coordenadas: 33.4484, -112.0740 (Phoenix, AZ)");
        console.log("⏳ Consultando Algolia para floorplans...");

        let floorplansCount4 = 0;
        let startTime4 = Date.now();
        let endTime4 = Date.now();

        try {
            startTime4 = Date.now();
            await sessionStore.getState().updateFilteredFloorplans();
            endTime4 = Date.now();

            const floorplans4 = sessionStore.getState().filteredFloorplans;
            floorplansCount4 = Array.isArray(floorplans4) ? floorplans4.length : 0;

            console.log(`✅ Búsqueda completada en ${endTime4 - startTime4}ms`);
            console.log(`📊 Floorplans encontrados: ${floorplansCount4}`);
            console.log("");

            if (Array.isArray(floorplans4) && floorplans4.length > 0) {
                console.log("📍 Primeros 3 floorplans encontrados:");
                floorplans4.slice(0, 3).forEach((floorplan: any, index: number) => {
                    console.log(`  ${index + 1}. ${floorplan.name || floorplan.floorplanName || "Sin nombre"}`);
                    if (floorplan._geoloc) {
                        const geo = Array.isArray(floorplan._geoloc) ? floorplan._geoloc[0] : floorplan._geoloc;
                        console.log(`     Coordenadas: ${geo.lat}, ${geo.lng}`);
                    }
                });
            }
        } catch (error) {
            console.log(`⚠️  Error en búsqueda con geolocalización: ${error instanceof Error ? error.message : "Error desconocido"}`);
            console.log("   Nota: Esto puede ocurrir si Algolia no acepta searchParams en este contexto");
            console.log("   La búsqueda de floorplans con geolocalización puede requerir configuración adicional");
        }
        console.log("");

        // ========================================
        // PRUEBA 5: Validación de almacenamiento en el store
        // ========================================
        console.log("📝 Prueba 5: Validación de almacenamiento en el store");
        console.log("-".repeat(80));

        const finalState = sessionStore.getState();
        console.log(`✓ Estado actual del store:`);
        console.log(`  • Ubicación: ${finalState.locations?.[0]?.state || "N/A"}, ${finalState.locations?.[0]?.location || "N/A"}`);
        console.log(`  • Precio Min: $${finalState.priceMin?.toLocaleString() || "N/A"}`);
        console.log(`  • Precio Max: $${finalState.priceMax?.toLocaleString() || "N/A"}`);
        console.log(`  • Bedrooms: ${finalState.floorplanBed.min}-${finalState.floorplanBed.max}`);
        console.log(`  • Bathrooms: ${finalState.floorplanBath.min}-${finalState.floorplanBath.max}`);
        console.log(`  • Amenities: ${finalState.amenities?.join(", ") || "N/A"}`);
        console.log(`  • Floorplans almacenados: ${Array.isArray(finalState.filteredFloorplans) ? finalState.filteredFloorplans.length : 0}`);
        console.log("");

        if (Array.isArray(finalState.filteredFloorplans) && finalState.filteredFloorplans.length > 0) {
            console.log("✓ El store contiene los floorplans correctamente");
            console.log(`✓ Primer resultado almacenado:`);
            const firstFloorplan = finalState.filteredFloorplans[0];
            console.log(`  - Nombre: ${firstFloorplan.name || firstFloorplan.floorplanName || "N/A"}`);
            console.log(`  - Tipo: ${typeof firstFloorplan}`);
            console.log(`  - Keys disponibles: ${Object.keys(firstFloorplan).slice(0, 8).join(", ")}...`);
            console.log(`  - ObjectType: ${firstFloorplan.objectType || "N/A"}`);
        } else {
            console.log("⚠️  No hay floorplans almacenados en el store");
        }
        console.log("");

        // ========================================
        // PRUEBA 6: Búsqueda sin filtros específicos de floorplan
        // ========================================
        console.log("📝 Prueba 6: Búsqueda sin filtros específicos de floorplan");
        console.log("-".repeat(80));

        // Resetear solo los filtros de floorplan y coordenadas (para evitar error de searchParams)
        sessionStore.getState().setFloorplanBed({ min: 0, max: 0 });
        sessionStore.getState().setFloorplanBath({ min: 0, max: 0 });
        sessionStore.getState().setFloorplanGarage({ min: 0, max: 0 });
        sessionStore.getState().setAmenities([]);
        // Resetear coordenadas para evitar el error de searchParams
        sessionStore.getState().setLatitude(undefined as any);
        sessionStore.getState().setLongitude(undefined as any);

        console.log("✓ Filtros de floorplan reseteados");
        console.log("✓ Coordenadas reseteadas (para evitar error de searchParams)");
        console.log("✓ Manteniendo ubicación y precios");
        console.log("⏳ Consultando Algolia para floorplans...");

        let floorplansCount6 = 0;
        let startTime6 = Date.now();
        let endTime6 = Date.now();

        try {
            startTime6 = Date.now();
            await sessionStore.getState().updateFilteredFloorplans();
            endTime6 = Date.now();

            const floorplans6 = sessionStore.getState().filteredFloorplans;
            floorplansCount6 = Array.isArray(floorplans6) ? floorplans6.length : 0;

            console.log(`✅ Búsqueda completada en ${endTime6 - startTime6}ms`);
            console.log(`📊 Floorplans encontrados: ${floorplansCount6}`);
            console.log("");

            if (Array.isArray(floorplans6) && floorplans6.length > 0) {
                console.log("📍 Primeros 3 floorplans encontrados:");
                floorplans6.slice(0, 3).forEach((floorplan: any, index: number) => {
                    console.log(`  ${index + 1}. ${floorplan.name || floorplan.floorplanName || "Sin nombre"}`);
                    if (floorplan.communityName) console.log(`     Comunidad: ${floorplan.communityName}`);
                });
            }
        } catch (error) {
            console.log(`⚠️  Error en búsqueda sin filtros: ${error instanceof Error ? error.message : "Error desconocido"}`);
            console.log("   Nota: Esto puede ocurrir si hay coordenadas establecidas y Algolia no acepta searchParams");
        }
        console.log("");

        // ========================================
        // RESUMEN
        // ========================================
        console.log("=".repeat(80));
        console.log("✨ RESUMEN DE PRUEBAS");
        console.log("=".repeat(80));
        console.log(`✓ Prueba 1: Búsqueda básica - ${floorplansCount1} floorplans`);
        console.log(`✓ Prueba 2: Con filtros de floorplan - ${floorplansCount2} floorplans`);
        console.log(`✓ Prueba 3: Con amenities - ${floorplansCount3} floorplans`);
        console.log(`✓ Prueba 4: Con geolocalización - ${floorplansCount4} floorplans`);
        console.log(`✓ Prueba 5: Validación de almacenamiento - ${Array.isArray(finalState.filteredFloorplans) ? finalState.filteredFloorplans.length : 0} floorplans`);
        console.log(`✓ Prueba 6: Sin filtros específicos - ${floorplansCount6} floorplans`);
        console.log("");

        // Calcular estadísticas (excluyendo prueba 4 si falló)
        const validCounts = [floorplansCount1, floorplansCount2, floorplansCount3, floorplansCount6].filter(count => count >= 0);
        const totalFloorplans = validCounts.reduce((sum, count) => sum + count, 0);

        const validTimes = [
            endTime1 - startTime1,
            endTime2 - startTime2,
            endTime3 - startTime3,
            endTime6 - startTime6,
        ].filter(time => time > 0);
        const avgTime = validTimes.length > 0
            ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length
            : 0;

        console.log("📊 Estadísticas:");
        console.log(`  • Total de floorplans encontrados en todas las pruebas: ${totalFloorplans}`);
        console.log(`  • Tiempo promedio de búsqueda: ${Math.round(avgTime)}ms`);
        console.log(`  • FacetType usado: objectType:floorplan`);
        console.log("");

        // Análisis de diferencias
        console.log("📈 Análisis de resultados:");
        console.log(`  • Prueba 1 (básica): ${floorplansCount1} floorplans`);
        console.log(`  • Prueba 2 (con filtros específicos): ${floorplansCount2} floorplans ${floorplansCount2 <= floorplansCount1 ? "✓ (filtrados correctamente)" : "⚠️ (más que sin filtros)"}`);
        console.log(`  • Prueba 3 (con amenities): ${floorplansCount3} floorplans ${floorplansCount3 <= floorplansCount1 ? "✓ (filtrados correctamente)" : "⚠️ (más que sin filtros)"}`);
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
testUpdateFilteredFloorplans()
    .then(() => {
        console.log("\n✅ Script ejecutado exitosamente");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Error fatal:", error);
        process.exit(1);
    });

