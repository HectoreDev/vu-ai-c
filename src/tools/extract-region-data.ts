#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { getPathCommunities, getPathDivision } from './utilities';
import * as zlib from 'zlib';

/**
 * Script para extraer regionMapData de una URL web y guardarlo en un archivo JSON
 * con el formato: ${DivisionName}DataKB.json
 * 
 * Uso:
 * node extract-region-data.js <baseUrl> <divisionName>
 * Ejemplo: node extract-region-data.js https://misitio.com phoenix
 */

// Interfaces para tipado
interface RegionData {
    region?: {
        RegionName: string;
    };
    communitiesData?: any[];
    floorPlansData?: any[];
    designStudio?: any[];
    [key: string]: any;
}

interface DownloadResult {
    success: boolean;
    data?: any;
    error?: string;
}

interface HttpResponse {
    statusCode?: number;
    statusMessage?: string;
    on: (event: string, callback: Function) => void;
}

/**
 * Función para obtener contenido HTML desde una URL
 */
/**
 * Función mejorada para obtener contenido HTML con descompresión automática
 */
// Agregar al inicio del archivo
import { Agent } from 'https';
import { Agent as HttpAgent } from 'http';

// Crear agentes con pool de conexiones
const httpsAgent = new Agent({
    keepAlive: true,
    keepAliveMsecs: 30000,
    maxSockets: 10,
    maxFreeSockets: 5,
    timeout: 30000
});

const httpAgent = new HttpAgent({
    keepAlive: true,
    keepAliveMsecs: 30000,
    maxSockets: 10,
    maxFreeSockets: 5,
    timeout: 30000
});

function fetchHtmlContent(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const httpModule = isHttps ? https : http;
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            timeout: 15000, // Timeout optimizado
            // En fetchHtmlContent, cambiar:
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; DataExtractor/1.0)',
                'Accept': 'application/json, text/html, */*',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive', // Cambiar de 'close' a 'keep-alive'
                'Cache-Control': 'no-cache',
                'Keep-Alive': 'timeout=30, max=100'
            }
        };

        const request = httpModule.request(options, (response) => {
            if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
                reject(new Error(`Error HTTP: ${response.statusCode} - ${response.statusMessage}`));
                return;
            }

            let data = '';
            let hasError = false;

            // 🔧 CLAVE: Detectar y manejar compresión automáticamente
            let stream;
            const encoding = response.headers['content-encoding'];
            
            console.log(`📄 Content-Encoding: ${encoding || 'none'}`);
            
            if (encoding === 'gzip') {
                stream = response.pipe(zlib.createGunzip());
                console.log('🗜️ Descomprimiendo contenido gzip...');
            } else if (encoding === 'deflate') {
                stream = response.pipe(zlib.createInflate());
                console.log('🗜️ Descomprimiendo contenido deflate...');
            }

            if (!stream) {
                stream = response;
            }
 
            stream.on('data', (chunk) => {
                if (!hasError) {
                    data += chunk.toString('utf8');
                    
                    // Límite de seguridad
                    if (data.length > 50 * 1024 * 1024) { // 50MB
                        hasError = true;
                        request.destroy();
                        reject(new Error('Respuesta demasiado grande'));
                    }
                }
            });

            stream.on('end', () => {
                if (!hasError) {
                    console.log(`📊 Contenido descomprimido: ${data.length} caracteres`);
                    
                    if (data.length === 0) {
                        reject(new Error('Contenido vacío recibido'));
                        return;
                    }

                    // Verificar que el contenido sea válido
                    const firstChars = data.substring(0, 100);
                    console.log(`🔍 Primeros caracteres: ${firstChars}`);
                    
                    resolve(data);
                }
            });

            stream.on('error', (error: Error) => {
                if (!hasError) {
                    hasError = true;
                    reject(new Error(`Error en descompresión: ${error.message}`));
                }
            });

            response.on('error', (error: Error) => {
                hasError = true;
                reject(new Error(`Error en respuesta: ${error.message}`));
            });

            response.on('aborted', () => {
                hasError = true;
                reject(new Error('Conexión abortada por el servidor'));
            });
        });

        request.on('error', (error: Error) => {
            reject(new Error(`Error de red: ${error.message}`));
        });

        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Timeout: La solicitud tardó más de 15 segundos'));
        });

        request.end();
    });
}

async function extractRegionMapData(baseUrl: string | null = null, divisionName: string | null = null): Promise<void> {
    try {
        let htmlContent: string;
        let outputFileName: string;

        // Determinar si usar URL web o archivo local
        if (baseUrl && divisionName) {
            // Modo web: construir URL y descargar contenido
            const fullUrl = `${baseUrl.replace(/\/$/, '')}/${divisionName}`;
            console.log(`🌐 Descargando datos desde: ${fullUrl}`);

            htmlContent = await fetchHtmlContent(fullUrl);
            console.log(`✅ Contenido descargado exitosamente (${htmlContent.length} caracteres)`);

        } else {
            // Modo local (backward compatibility)
            console.log(`📁 Leyendo archivo local: src/tools/testData.html`);
            const htmlPath = path.join(__dirname, 'src/tools/testData.html');
            htmlContent = fs.readFileSync(htmlPath, 'utf8');
        }

        // Buscar el inicio de la variable regionMapData
        const startPattern = /var\s+regionMapData\s*=\s*{/;
        const startMatch = htmlContent.match(startPattern);

        if (!startMatch) {
            throw new Error('No se encontró la variable regionMapData en el archivo');
        }

        const startIndex = startMatch.index! + startMatch[0].indexOf('{');

        // Encontrar el final de la variable (buscar el }; que cierra el objeto)
        let braceCount = 0;
        let endIndex = -1;
        let inString = false;
        let stringChar: string | null = null;
        let escaping = false;

        for (let i = startIndex; i < htmlContent.length; i++) {
            const char = htmlContent[i];
            const prevChar = i > 0 ? htmlContent[i - 1] : null;

            // Manejar escape characters
            if (escaping) {
                escaping = false;
                continue;
            }

            if (char === '\\') {
                escaping = true;
                continue;
            }

            // Manejar strings
            if (!inString && (char === '"' || char === "'")) {
                inString = true;
                stringChar = char;
                continue;
            }

            if (inString && char === stringChar) {
                inString = false;
                stringChar = null;
                continue;
            }

            // Solo contar llaves si no estamos dentro de un string
            if (!inString) {
                if (char === '{') {
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;

                    // Si llegamos a 0, hemos encontrado el cierre del objeto principal
                    if (braceCount === 0) {
                        // Verificar si el siguiente carácter no blanco es ';'
                        let nextIndex = i + 1;
                        while (nextIndex < htmlContent.length && /\s/.test(htmlContent[nextIndex])) {
                            nextIndex++;
                        }

                        if (nextIndex < htmlContent.length && htmlContent[nextIndex] === ';') {
                            endIndex = i;
                            break;
                        }
                    }
                }
            }
        }

        if (endIndex === -1) {
            throw new Error('No se pudo encontrar el final de la variable regionMapData');
        }

        // Extraer el contenido JSON
        const jsonString = htmlContent.substring(startIndex, endIndex + 1);

        // Parsear el JSON para validarlo y formatearlo
        let regionData: RegionData;
        try {
            regionData = JSON.parse(jsonString);
        } catch (parseError: any) {
            console.error('Error al parsear JSON:', parseError.message);
            console.log('Primeros 500 caracteres del JSON extraído:');
            console.log(jsonString.substring(0, 500));
            throw new Error('El JSON extraído no es válido');
        }

        // Obtener el nombre de la región para el archivo
        let regionName = 'Unknown';
        if (regionData.region && regionData.region.RegionName) {
            regionName = regionData.region.RegionName;
        } else if (divisionName) {
            // Si se proporcionó divisionName como parámetro, usarlo como fallback
            regionName = divisionName.charAt(0).toUpperCase() + divisionName.slice(1).toLowerCase();
        }
 
        const divisionPath = getPathDivision(regionName);

        // Guardar el archivo JSON formateado
        fs.writeFileSync(divisionPath, JSON.stringify(regionData, null, 2), 'utf8');

        console.log(`✅ Datos extraídos exitosamente!`);
        console.log(`📁 Archivo guardado como: ${divisionPath}`);
        console.log(`📊 Datos incluidos:`);
        console.log(`   - Región: ${regionData.region ? regionData.region.RegionName : regionName}`);
        console.log(`   - Comunidades: ${regionData.communitiesData ? regionData.communitiesData.length : 0}`);
        console.log(`   - Planes de piso: ${regionData.floorPlansData ? regionData.floorPlansData.length : 0}`);
        console.log(`   - Estudios de diseño: ${regionData.designStudio ? regionData.designStudio.length : 0}`);

        if (baseUrl) {
            console.log(`🌐 Fuente: ${baseUrl}/${divisionName}`);
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}


/**
 * Función para extraer datos de región y devolver la ruta del archivo generado
 * Diseñada para ser utilizada en mcp.tools.ts
 * @param baseUrl - URL base del sitio (ej: https://misitio.com)
 * @param divisionName - Nombre de la división/región (ej: phoenix, miami, dallas)
 * @returns Ruta completa del archivo JSON generado
 */
export async function extractRegionDataForMCP(baseUrl: string, divisionName: string): Promise<string> {
    try {
        let htmlContent: string;
        let regionData: RegionData | null = null;

        // Construir URL y descargar contenido
        const fullUrl = `${baseUrl.replace(/\/$/, '')}/${divisionName}`;
        console.log(`🌐 Descargando datos desde: ${fullUrl}`);

        htmlContent = await fetchHtmlContent(fullUrl);
        console.log(`✅ Contenido descargado exitosamente (${htmlContent.length} caracteres)`); 

        // Verificar si el contenido es JSON puro o HTML con JavaScript embebido
        const trimmedContent = htmlContent.trim();

        if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
            // Es JSON puro
            console.log('📄 Detectado JSON puro, parseando directamente...');
            try {
                regionData = JSON.parse(htmlContent);
            } catch (parseError: any) {
                console.error('Error al parsear JSON puro:', parseError.message);
                throw new Error('El JSON descargado no es válido');
            }
        } else {
            // Es HTML con JavaScript embebido, buscar regionMapData
            console.log('🌐 Detectado HTML, buscando variable regionMapData...');

            // Buscar el inicio de la variable regionMapData
            const startPattern = /var\s+regionMapData\s*=\s*{/;
            const startMatch = htmlContent.match(startPattern);

            if (!startMatch) {
                // Intentar con otros patrones comunes
                const alternativePatterns = [
                    /regionMapData\s*=\s*{/,
                    /window\.regionMapData\s*=\s*{/,
                    /const\s+regionMapData\s*=\s*{/,
                    /let\s+regionMapData\s*=\s*{/
                ];

                let foundPattern = false;
                for (const pattern of alternativePatterns) {
                    const match = htmlContent.match(pattern);
                    if (match) {
                        console.log(`✅ Encontrado patrón alternativo: ${pattern.source}`);
                        const startIndex = match.index! + match[0].indexOf('{');

                        // Extraer JSON usando el mismo algoritmo
                        const jsonString = extractJsonFromString(htmlContent, startIndex);
                        try {
                            regionData = JSON.parse(jsonString);
                            foundPattern = true;
                            break;
                        } catch (error) {
                            console.log(`❌ Error con patrón ${pattern.source}:`, error);
                            continue;
                        }
                    }
                }

                if (!foundPattern) {
                    // Debug: mostrar las primeras líneas del contenido
                    const firstLines = htmlContent.substring(0, Math.min(500, htmlContent.length));
                    console.error('❌ No se encontró la variable regionMapData. Primeras líneas del contenido:');
                    console.error(firstLines); 
                    throw new Error('No se encontró la variable regionMapData en el archivo');
                }
            } else {
                const startIndex = startMatch.index! + startMatch[0].indexOf('{');
                const jsonString = extractJsonFromString(htmlContent, startIndex);

                try {
                    regionData = JSON.parse(jsonString);
                } catch (parseError: any) {
                    console.error('Error al parsear JSON extraído:', parseError.message);
                    throw new Error('El JSON extraído no es válido');
                }
            }
        }

        // Verificar que regionData se haya asignado correctamente
        if (!regionData) {
            throw new Error('No se pudo extraer datos de la región');
        }

      const divisionPath = getPathDivision(divisionName);
      if (!divisionPath) {
        throw new Error('No se pudo obtener la ruta de la división');
      }

        // Guardar el archivo JSON formateado
        fs.writeFileSync(divisionPath, JSON.stringify(regionData, null, 2), 'utf8');

       
        console.log(`✅ Datos extraídos exitosamente para MCP!`);
        console.log(`📁 Archivo guardado como: ${divisionPath}`);
        console.log(`📊 Datos incluidos:`);
        console.log(`   - Región: ${regionData.region ? regionData.region.RegionName : divisionName}`);
        console.log(`   - Comunidades: ${regionData.communitiesData ? regionData.communitiesData.length : 0}`);
        console.log(`   - Planes de piso: ${regionData.floorPlansData ? regionData.floorPlansData.length : 0}`);
        console.log(`   - Estudios de diseño: ${regionData.designStudio ? regionData.designStudio.length : 0}`);
        console.log(`🌐 Fuente: ${fullUrl}`);

        // Devolver la ruta completa del archivo generado
        return JSON.stringify(regionData);

    } catch (error: any) {
        console.error('❌ Error en extractRegionDataForMCP:', error.message);
        throw error; // Re-lanzar el error para que sea manejado por el llamador
    }
}

// Función auxiliar para extraer JSON de una cadena de texto
function extractJsonFromString(content: string, startIndex: number): string {
    let braceCount = 0;
    let endIndex = -1;
    let inString = false;
    let stringChar: string | null = null;
    let escaping = false;

    for (let i = startIndex; i < content.length; i++) {
        const char = content[i];

        // Manejar escape characters
        if (escaping) {
            escaping = false;
            continue;
        }

        if (char === '\\') {
            escaping = true;
            continue;
        }

        // Manejar strings
        if (!inString && (char === '"' || char === "'")) {
            inString = true;
            stringChar = char;
            continue;
        }

        if (inString && char === stringChar) {
            inString = false;
            stringChar = null;
            continue;
        }

        // Solo contar llaves si no estamos dentro de un string
        if (!inString) {
            if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;

                // Si llegamos a 0, hemos encontrado el cierre del objeto principal
                if (braceCount === 0) {
                    // Verificar si el siguiente carácter no blanco es ';'
                    let nextIndex = i + 1;
                    while (nextIndex < content.length && /\s/.test(content[nextIndex])) {
                        nextIndex++;
                    }

                    if (nextIndex < content.length && content[nextIndex] === ';') {
                        endIndex = i;
                        break;
                    }
                }
            }
        }
    }

    if (endIndex === -1) {
        throw new Error('No se pudo encontrar el final de la variable regionMapData');
    }

    // Extraer el contenido JSON
    return content.substring(startIndex, endIndex + 1);
}

export async function downloadDataCommunity(baseUrl: string, community: string): Promise<DownloadResult> { 
    const outputPath = getPathCommunities(community);
    console.log("🐖 outputPath...", outputPath);

    let responseJSON: any;

    // Validación temprana de cache con verificación de integridad
    if (fs.existsSync(outputPath)) {
        try {
            const stats = fs.statSync(outputPath);
            const raw = fs.readFileSync(outputPath, { encoding: 'utf8' });
            
            // Verificar que el archivo no esté vacío y sea JSON válido
            if (raw.trim() && stats.size > 10) {
                responseJSON = JSON.parse(raw);
                
                // Verificar que el JSON tenga estructura válida
                if (responseJSON && typeof responseJSON === 'object' && responseJSON.status !== 404) {
                    console.log(`📁 Datos válidos cargados desde cache: ${outputPath}`);
                    return { success: true, data: responseJSON };
                }
            }
        } catch (error: any) {
            console.warn(`⚠️ Cache corrupto para ${outputPath}, redownloading:`, error.message);
            // Eliminar cache corrupto
            try {
                fs.unlinkSync(outputPath);
            } catch (unlinkError) {
                console.warn('No se pudo eliminar cache corrupto:', unlinkError);
            }
        }
    }

    // ...existing code ...
    if (!responseJSON) {
        // Implementar retry con backoff exponencial
        const maxRetries = 3;
        const baseDelay = 500;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const jsonCommunityURL = `${baseUrl}${community}?type=json`;
            console.log(`🌐 Intento ${attempt}/${maxRetries} - Descargando: ${jsonCommunityURL}`);
    
            try {
                const htmlContent = await fetchHtmlContent(jsonCommunityURL);
                
                // Validación temprana del contenido
                const trimmedContent = htmlContent.trim();
                if (!trimmedContent.startsWith('{') && !trimmedContent.startsWith('[')) {
                    throw new Error('Contenido recibido no es JSON válido');
                }
    
                responseJSON = JSON.parse(htmlContent);
                
                if (responseJSON.status === 404) {
                    return { success: false, error: 'Comunidad no encontrada (404)' };
                }
    
                // Guardar cache de forma asíncrona
                setImmediate(() => {
                    try {
                        fs.writeFileSync(outputPath, JSON.stringify(responseJSON, null, 2));
                        console.log(`💾 Cache guardado: ${outputPath}`);
                    } catch (writeError: any) {
                        console.warn(`⚠️ No se pudo guardar cache: ${writeError.message}`);
                    }
                });
    
                return { success: true, data: responseJSON };
    
            } catch (error: any) {
                const errorMessage = error.message.toLowerCase();
                const isNetworkError = errorMessage.includes('socket hang up') ||
                                     errorMessage.includes('connection reset') ||
                                     errorMessage.includes('econnreset') ||
                                     errorMessage.includes('timeout');
    
                console.error(`❌ Intento ${attempt} falló: ${error.message}`);
    
                if (attempt === maxRetries || !isNetworkError) {
                    return { success: false, error: `Error después de ${attempt} intentos: ${error.message}` };
                }
    
                // Backoff exponencial con jitter
                const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 200;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    return { success: false, error: 'Todos los intentos fallaron' };
}

// Función auxiliar con timeout personalizable
async function fetchHtmlContentWithTimeout(url: string, timeoutMs: number = 8000): Promise<string> {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const httpModule = isHttps ? https : http;
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            timeout: timeoutMs,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; DataExtractor/1.0)',
                'Accept': 'application/json, text/html, */*',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'close' // Forzar cierre de conexión
            }
        };

        const request = httpModule.request(options, (response) => {
            let data = '';
            let hasError = false;

            // Manejar compresión
            let stream = response;
            if (response.headers['content-encoding'] === 'gzip') {
                stream = response.pipe(require('zlib').createGunzip());
            } else if (response.headers['content-encoding'] === 'deflate') {
                stream = response.pipe(require('zlib').createInflate());
            }

            stream.on('data', (chunk) => {
                if (!hasError) {
                    data += chunk.toString('utf8');
                    
                    // Límite de tamaño para evitar memoria excesiva
                    if (data.length > 50 * 1024 * 1024) { // 50MB
                        hasError = true;
                        request.destroy();
                        reject(new Error('Respuesta demasiado grande'));
                    }
                }
            });

            stream.on('end', () => {
                if (!hasError) {
                    if (response.statusCode && response.statusCode >= 400) {
                        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                    } else {
                        resolve(data);
                    }
                }
            });

            stream.on('error', (error: Error) => {
                if (!hasError) {
                    hasError = true;
                    reject(new Error(`Error en stream: ${error.message}`));
                }
            });
        });

        request.on('error', (error: Error) => {
            reject(new Error(`Error de red: ${error.message}`));
        });

        request.on('timeout', () => {
            request.destroy();
            reject(new Error(`Timeout: La solicitud tardó más de ${timeoutMs/1000} segundos`));
        });

        request.end();
    });
}
