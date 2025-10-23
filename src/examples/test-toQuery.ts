/**
 * Archivo de prueba para store.toQuery()
 * 
 * Este script:
 * 1. Asigna valores al store
 * 2. Genera la consulta usando toQuery()
 * 3. Ejecuta la búsqueda con queryDocument
 * 4. Muestra los resultados por consola
 */

import { sessionStore } from "../store/zustandStore";
import { queryDocument } from "../search/search";
import { IFLocation } from "../types/types";

async function testToQuery() {
    console.log("=".repeat(80));
    console.log("🧪 INICIANDO PRUEBA DE store.toQuery()");
    console.log("=".repeat(80));
    console.log("");

    // ========================================
    // 1. ASIGNAR VALORES AL STORE
    // ========================================
    console.log("📝 Paso 1: Asignando valores al store...");
    console.log("-".repeat(80));

    // Establecer nombre
    const nameResult = sessionStore.getState().setName("Juan Pérez");
    console.log("✓ Nombre:", nameResult.success ? "Juan Pérez" : "Error");

    // Establecer ubicación
    const locations: IFLocation[] = [
        {
            state: "AZ",
            location: "Phoenix"
        }
    ];
    const locationResult = sessionStore.getState().setlocations(locations);
    console.log("✓ Ubicación:", locationResult.success ? "AZ, Phoenix" : "Error");

    // Establecer coordenadas (Austin, TX)
    /*   sessionStore.getState().setGeoLocation(33.389400, -112.591818);
      console.log("✓ Coordenadas:", "33.389400, -112.591818"); */

    // Establecer rango de precios
    const priceResult = sessionStore.getState().setBudgetPriceRange(440000, 500000);
    console.log("✓ Rango de precios:", "$400,000 - $500,000", "Error");

    // Establecer amenidades
    /*  const amenitiesResult = sessionStore.getState().setAmenities([
         "Playground"
     ]);
     console.log("✓ Amenidades:", amenitiesResult.success ? "Playground" : "Error"); */

    // Establecer especificaciones de floorplan - bedrooms
    sessionStore.getState().setFloorplanBed({ min: 2, max: 3 });
    console.log("✓ Bedrooms:", "3");

    // Establecer especificaciones de floorplan - bathrooms
    sessionStore.getState().setFloorplanBath({ min: 2, max: 3 });
    console.log("✓ Bathrooms:", "2");

    // Establecer especificaciones de floorplan - garage
    sessionStore.getState().setFloorplanGarage({ min: 2, max: 2 });
    console.log("✓ Garage:", "2");

    // Establecer especificaciones de floorplan - sqft
    /* sessionStore.getState().setFloorplanSqft({ min: 1500, max: 3000 });
    console.log("✓ Square feet:", "1,500-3,000"); */

    // Establecer intereses
    /*  sessionStore.getState().setHomeInterest(["Family-friendly", "Modern design"]);
     console.log("✓ Intereses:", "Family-friendly, Modern design"); */

    // Establecer tipo de interés
    /* sessionStore.getState().setInterestRateType("conventional_30");
    console.log("✓ Tipo de interés:", "conventional_30"); */

    // Establecer customizing
    /*    sessionStore.getState().setCustomizing(true);
       console.log("✓ Customizing:", "Sí"); */

    // Establecer move in ready
    /*  sessionStore.getState().setMoveInReady(false);
     console.log("✓ Move in ready:", "No");
  */
    console.log("");

    // ========================================
    // 2. MOSTRAR ESTADO ACTUAL DEL STORE
    // ========================================
    console.log("📊 Paso 2: Estado actual del store");
    console.log("-".repeat(80));
    const currentState = sessionStore.getState();
    console.log(JSON.stringify({
        name: currentState.name,
        locations: currentState.locations,
        latitude: currentState.latitude,
        longitude: currentState.longitude,
        priceMin: currentState.priceMin,
        priceMax: currentState.priceMax,
        amenities: currentState.amenities,
        floorplanBed: currentState.floorplanBed,
        floorplanBath: currentState.floorplanBath,
        floorplanGarage: currentState.floorplanGarage,
        floorplanSqft: currentState.floorplanSqft,
        homeInterest: currentState.homeInterest,
        interestRateType: currentState.interestRateType,
        customizing: currentState.customizing,
        moveInReady: currentState.moveInReady
    }, null, 2));
    console.log("");

    // ========================================
    // 3. GENERAR CONSULTA CON toQuery()
    // ========================================
    console.log("🔍 Paso 3: Generando consulta con toQuery()");
    console.log("-".repeat(80));

    const queryArgs = sessionStore.getState().toQuery();

    console.log("Query generada:");
    console.log(JSON.stringify(queryArgs, null, 2));
    console.log("");
    console.log(`  • facetType: ${queryArgs.facetType}`);
    console.log("Detalles de la consulta:");
    console.log(`  • query: "${queryArgs.query}"`);
    console.log(`  • filters: ${queryArgs.filters}`);
    console.log(`  • numericFilters (${queryArgs.numericFilters?.length || 0} filtros):`);
    if (queryArgs.numericFilters) {
        queryArgs.numericFilters.forEach((filter, index) => {
            console.log(`    ${index + 1}. ${filter}`);
        });
    }
    if (queryArgs.searchParams) {
        console.log(`  • searchParams:`);
        console.log(`    - aroundLatLng: ${queryArgs.searchParams.aroundLatLng}`);
        console.log(`    - aroundRadius: ${queryArgs.searchParams.aroundRadius}`);
    }
    console.log("");

    // ========================================
    // 4. EJECUTAR LA BÚSQUEDA
    // ========================================
    console.log("🚀 Paso 4: Ejecutando búsqueda con queryDocument");
    console.log("-".repeat(80));

    try {
        console.log("⏳ Consultando Algolia...");
        const startTime = Date.now();

        const results = await queryDocument(queryArgs);

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`✅ Búsqueda completada en ${duration}ms`);
        console.log("");

        // ========================================
        // 5. MOSTRAR RESULTADOS
        // ========================================
        console.log("📋 Paso 5: Resultados de la búsqueda");
        console.log("-".repeat(80));

        if (!results || results.length === 0) {
            console.log("⚠️  No se encontraron resultados");
        } else {
            console.log(`Total de resultados: ${results.length}`);
            console.log("");

            results.forEach((result, index) => {
                console.log(`Resultado #${index + 1}:`);
                console.log(JSON.stringify(result, null, 2));
                console.log("");
            });

            // Mostrar estadísticas si están disponibles
            if (results[0]) {
                const firstResult = results[0];
                console.log("📊 Estadísticas del primer resultado:");
                if ('nbHits' in firstResult) {
                    console.log(`  • Total hits: ${(firstResult as any).nbHits}`);
                }
                if ('processingTimeMS' in firstResult) {
                    console.log(`  • Tiempo de procesamiento: ${(firstResult as any).processingTimeMS}ms`);
                }
                if ('nbPages' in firstResult) {
                    console.log(`  • Total páginas: ${(firstResult as any).nbPages}`);
                }
                if ('hitsPerPage' in firstResult) {
                    console.log(`  • Hits por página: ${(firstResult as any).hitsPerPage}`);
                }
            }
        }

    } catch (error) {
        console.error("❌ Error durante la búsqueda:");
        if (error instanceof Error) {
            console.error(`  Mensaje: ${error.message}`);
            console.error(`  Stack: ${error.stack}`);
        } else {
            console.error(error);
        }
    }

    console.log("");
    console.log("=".repeat(80));
    console.log("✨ PRUEBA COMPLETADA");
    console.log("=".repeat(80));
}

// Ejecutar la prueba
console.log("\n");
testToQuery()
    .then(() => {
        console.log("\n✅ Script ejecutado exitosamente");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Error fatal:", error);
        process.exit(1);
    });

