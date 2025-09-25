import * as fs from 'fs';
import * as path from 'path';
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { baseURL, divisions, getDivisionByName, getTodayDate, getPathCommunities, getPathDivision } from "../tools/utilities";
import { extractRegionDataForMCP, downloadDataCommunity } from '../tools/extract-region-data';


import {
    RegionMapData,
    LoadCommunitiesForMCPParams,
    LoadCommunitiesForMCPResult
} from '../types/regionMapData.types';
import { filtrarComunidadesPorPrecio } from '../tools/filterCommunities'; 
import { IFAlgoliaSearchProps, makeLLMAlgoliaRequest, AlgoliaSearchResult, AlgoliaCommunityResult } from '../tools/algoliaSearch';


let communitiesCache: any = null;
let siteplansCache: any = null; 

function loadCommunities(): any[] {
    if (!communitiesCache) {
        try {
            const communitiesPath = path.join(__dirname, '../tools/communities.json');
            console.log('🔄 Loading communities data...');
            const data = fs.readFileSync(communitiesPath, 'utf-8');
            const rawData = JSON.parse(data);

            // Filtrar solo comunidades válidas para reducir memoria
            communitiesCache = (rawData as any[]).filter((community: any) =>
                community.communityDoc &&
                community.communityDoc.uid &&
                community.communityDoc.uid !== "" &&
                community.communityDoc.status === "active" &&
                community.communityDoc.name
            );

            console.log(`✅ Communities data loaded successfully (${communitiesCache.length} valid communities)`);
        } catch (error) {
            console.error('❌ Error loading communities data:', error);
            communitiesCache = [];
        }
    }
    return communitiesCache;
}

function loadSiteplans(): any[] {
    if (!siteplansCache) {
        try {
            const siteplansPath = path.join(__dirname, '../tools/siteplans.json');
            console.log('🔄 Loading siteplans data...');
            const data = fs.readFileSync(siteplansPath, 'utf-8');
            const rawData = JSON.parse(data);

            // Filtrar solo siteplans válidos para reducir memoria
            siteplansCache = (rawData as any[]).filter((siteplan: any) =>
                siteplan.uid &&
                siteplan.communityUIDs &&
                siteplan.status === "active" &&
                Array.isArray(siteplan.communityUIDs) &&
                siteplan.communityUIDs.length > 0
            );

            console.log(`✅ Siteplans data loaded successfully (${siteplansCache.length} valid siteplans)`);
        } catch (error) {
            console.error('❌ Error loading siteplans data:', error);
            siteplansCache = [];
        }
    }
    return siteplansCache;
}

async function loadCommunitiesForMCP(params: LoadCommunitiesForMCPParams): Promise<LoadCommunitiesForMCPResult> {
    let nameCommunity = params.divisionName.split('/')[1];
    const divisionPath = getPathDivision(params.divisionName);
    //const communitiesPath = params.isCommunity === false ? path.join(__dirname, `../../data/divisions/${getTodayDate()}/${params.divisionName}.json`) : path.join(__dirname, `../../data/communities/${getTodayDate()}/${nameCommunity}.json`);
    console.log('🔍 communitiesPath:', divisionPath);
    let regionData: RegionMapData;

    try {

        if (fs.existsSync(divisionPath)) {
            console.log('📁 Loading communities data from local file...');
            const fileContent = fs.readFileSync(divisionPath, 'utf-8');
            regionData = JSON.parse(fileContent);
        } else {
            console.log('⬇ Downloading data...');
            const jsonString = await extractRegionDataForMCP(params.baseUrl, params.divisionName);
            regionData = JSON.parse(jsonString);
        }

        console.log('🔍 Region data loaded:', regionData.region?.RegionName);
        console.log(`✅ Communities data loaded successfully - Communities: ${regionData.communitiesData?.length || 0}, FloorPlans: ${regionData.floorPlansData?.length || 0}`);

        return {
            success: true,
            data: regionData,
            filePath: divisionPath
        };

    } catch (error) {
        console.error('❌ Error loading communities data:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

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

export async function executeGetNameTool(args: any) {
    // Verificar sesión usando el nuevo sistema
    const sessionId = args.data?.sessionId || args.data?.token || args.data?.id;
    const validation = validateSession(sessionId);

    if (!validation.valid) {
        return {
            success: false,
            error: validation.error || "Sesión inválida"
        };
    }

    // Actualizar sesión con el nombre del usuario
    const updateResult = updateSession(sessionId, {
        name: args.data.name
    });

    if (!updateResult.success) {
        return {
            success: false,
            error: updateResult.error || "Error actualizando sesión"
        };
    }

    return {
        success: true,
        data: {
            name: args.data.name,
            sessionId: sessionId,
            valid: true,
            session: updateResult.session
        }
    };
}

export async function executeGetLocationTool(args: any) {

    const result = {
        success: true,
        data: {
            args
        }
    };

    console.log('✅ executeGetLocationTool - Resultado final:', JSON.stringify(result, null, 2));
    return result;
}

export const executeGetMinMaxPricesTool = async (args: any) => {

    const sessionId = args.data?.sessionId || args.data?.token || args.data?.id;
    const validation = validateSession(sessionId);

    if (!validation.valid) {
        return {
            success: false,
            error: validation.error || "Sesión inválida"
        };
    }

    let location = args.data?.location?.toLowerCase();
    if (!location) {
        return {
            success: false,
            error: "No se proporcionó ubicación y no hay ubicación guardada en la sesión"
        };
    }

    const divisionObj = getDivisionByName(location);

    const dataSearch: IFAlgoliaSearchProps = {
        uid: sessionId,
        name: divisionObj.id,
        location: location
    }

    const resultRequest: AlgoliaSearchResult | null = await makeLLMAlgoliaRequest(dataSearch);
    if (!resultRequest) {
        return {
            success: false,
            error: "División no encontrada"
        };
    }
    console.log("division", JSON.stringify(resultRequest))
    const division: AlgoliaCommunityResult = resultRequest[0]
    
    const minPrice = division.PriceMin || 0;
    const maxPrice = division.PriceMax || 0;
    
    return {
        success: true,
        data: {
            name: args.data.name,
            location: location,
            priceMin: minPrice,
            priceMax: maxPrice
        }
    };
}
 
export const executeGetAmenitiesFromPricesTool = async (args: any) => {
    const sessionId = args.data?.sessionId || args.data?.token || args.data?.id;
    const validation = validateSession(sessionId);

    if (!validation.valid) {
        return {
            success: false,
            error: validation.error || "Sesión inválida"
        };
    }

    let location = args.data?.location?.toLowerCase();
    if (!location) {
        return {
            success: false,
            error: "No se proporcionó ubicación y no hay ubicación guardada en la sesión"
        };
    }
 
     const dataSearch: IFAlgoliaSearchProps = {
        uid: sessionId,
        name: validation.session?.name,
        location: location,
        priceMin: args.data?.priceMin,
        priceMax: args.data?.priceMax
    }

    const resultRequest: AlgoliaSearchResult | null = await makeLLMAlgoliaRequest(dataSearch);
    if (!resultRequest) {
        return {
            success: false,
            error: "División no encontrada"
        };
    }
    console.log("amenities", JSON.stringify(resultRequest))
    const amenitiesResult: AlgoliaCommunityResult = resultRequest[0]
    const arrAmenities: string[] = [];
     
    if (amenitiesResult.amenities) {
        arrAmenities.push(...amenitiesResult.amenities);
    }
    return {
        success: true,
        data: {
            name: args.data.name,
            location: location,
            amenities: arrAmenities
        }
    };
 
}

export async function executeGetCommunitiesTool(args: any) {
    console.log('🔍 executeGetCommunitiesTool - Datos recibidos:', JSON.stringify(args, null, 2));

    // Verificar sesión usando el nuevo sistema
    const sessionId = args.data?.sessionId || args.data?.token || args.data?.id;
    const validation = validateSession(sessionId);

    if (!validation.valid) {
        return {
            success: false,
            error: validation.error || "Sesión inválida"
        };
    }

    // Obtener ubicación: primero de args.data.location, luego de la sesión
    let location = args.data?.location?.toLowerCase();

    // Si no se proporciona ubicación, obtenerla de la sesión
    if (!location) {
        const session = getSessionInfo(sessionId);
        if (session && session.location) {
            location = session.location.toLowerCase();
            console.log('🔍 Ubicación obtenida de la sesión:', location);
        }
    } else {
        console.log('🔍 Ubicación proporcionada en args.data:', location);
    }

    console.log('🔍 Buscando location:', location);

    if (!location) {
        return {
            success: false,
            error: "No se proporcionó ubicación y no hay ubicación guardada en la sesión"
        };
    }

    //const division = Object.keys(divisions).find(key => (divisions as any)[key] === location);
    const division = getDivisionByName(location);
    console.log('🔍 division encontrada:', division);


    if (!division) {
        console.log('❌ No se encontró división para location:', location);
        // Mostrar ubicaciones disponibles para ayudar al debugging
        const availableLocations = Object.values(divisions);
        console.log('📍 Ubicaciones disponibles:', availableLocations);
        return {
            success: false,
            error: `No se encontró división para la ubicación: ${location}. Ubicaciones disponibles: ${availableLocations.join(', ')}`
        };
    }

    //const communitiesF = loadCommunitiesForMCP(division.name);
    const communities = loadCommunities();
    const communitiesF = (communities as any[]).filter((community: { communityDoc: { divisionUID: string | undefined; status: string; }; }) => community.communityDoc.divisionUID === division.id);
    console.log('🔍 communities:', communitiesF.length);


    // Formatear las comunidades de manera legible
    const formattedCommunities = communitiesF
        .map((community: { communityDoc: { name: any; }; }) => community.communityDoc.name)
        .join('\n\n');
    console.log('🔍 formattedCommunities:', formattedCommunities);

    const result = {
        success: true,
        data: {
            communities: formattedCommunities,
            communitiesArray: communitiesF.map((c: { communityDoc: { name: any; uid: any; }; }) => {
                return {
                    name: c.communityDoc.name,
                    uid: c.communityDoc.uid
                }
            }),
            location: validation.session?.location || args.data?.location || 'ubicación solicitada',
            sessionId: sessionId,
            session: validation.session,
            message: "Comunidades encontradas correctamente"
        }
    };

    console.log('✅ executeFindCommunitiesTool - Resultado final:', JSON.stringify(result));
    return result;
}

export async function executeGetCommunityInfoTool(args: any) {
    // Verificar sesión usando el nuevo sistema
    const sessionId = args.data?.sessionId || args.data?.token || args.data?.id;
    const validation = validateSession(sessionId);

    if (!validation.valid) {
        return {
            success: false,
            error: validation.error || "Sesión inválida"
        };
    }

    console.log('🔍 get-community-info args:', JSON.stringify(args, null, 2));

    let selectedCommunity = null;
    const communityName = args.data?.communityName;
    const communityUID = args.data?.communityUID;

    // Buscar por ID si se proporciona
    const communities = loadCommunities();
    if (communityUID) {
        selectedCommunity = (communities as any[]).find((community: { communityDoc: { uid: string | undefined; }; }) =>
            community.communityDoc.uid === communityUID && community.communityDoc.uid !== ""
        );
    }
    console.log('🔍 selectedCommunity-from-uid:', selectedCommunity);
    // Buscar por nombre si no se encontró por ID
    if (!selectedCommunity && communityName) {
        selectedCommunity = (communities as any[]).find((community: {
            communityDoc: {
                name: any; uid: string | undefined;
            };
        }) => {
            return community.communityDoc.name === communityName
        });
    }
    console.log('🔍 selectedCommunity-from-name:', selectedCommunity);
    if (!selectedCommunity) {
        return {
            success: false,
            error: `No se encontró información para la comunidad: ${communityName || communityUID}`,
            data: {
                sessionId: sessionId,
                session: validation.session,
                availableCommunities: (communities as any[])
                    .filter((c: { communityDoc: { uid: string | undefined; }; }) => c.communityDoc.uid !== "")
                    .map((c: { communityDoc: { name: any; uid: any; }; }) => {
                        const nameMatch = c.communityDoc.name;
                        return {
                            name: nameMatch ? nameMatch[1].trim() : "Nombre no disponible",
                            id: c.communityDoc.uid
                        };
                    })
            }
        };
    }

    // Extraer información detallada de la comunidad
    const nameMatch = selectedCommunity.communityDoc.name;
    const communityDetails = {
        name: nameMatch,
        uid: selectedCommunity.communityDoc.uid,
        floorplan: selectedCommunity.communityDoc.floorplan,
    };
    console.log('🔍 communityDetails:', communityDetails);
    /*   // Extraer amenidades del texto
      const amenityMatches = selectedCommunity.name.match(/\*\s\*\*(.*?):\*\*(.*?)(?=\n|\*|$)/g);
      if (amenityMatches) {
          communityDetails.amenities = amenityMatches.map(amenity => {
              const match = amenity.match(/\*\s\*\*(.*?):\*\*(.*)/);
              return {
                  feature: match ? match[1].trim() : "",
                  description: match ? match[2].trim() : ""
              };
          });
      } */

    console.log('✅ Comunidad encontrada:', communityDetails.name, 'UID:', communityDetails.uid);

    return {
        success: true,
        data: {
            sessionId: sessionId,
            session: validation.session,
            communityRequested: communityName || communityUID,
            community: communityDetails,
            message: `Información detallada de ${communityDetails.name} obtenida exitosamente`
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

export const executeSiteplansTool = async (args: any) => {
    const sessionId = args.data?.sessionId || args.data?.token || args.data?.id;
    const validation = validateSession(sessionId);

    if (!validation.valid) {
        return {
            success: false,
            error: validation.error || "Sesión inválida"
        };
    }

    const communities = loadCommunities();
    const community = (communities as any[]).find((community: { communityDoc: { uid: string | undefined; }; }) => community.communityDoc.uid === args.data.communityUID);
    if (!community) {
        return {
            success: false,
            error: "Comunidad no encontrada"
        };
    }

    const siteplans = loadSiteplans();
    const siteplanFind = (siteplans as any[]).filter((siteplan: { communityUIDs: any[]; }) =>
        siteplan.communityUIDs.includes(community.communityDoc.uid)
    );
    if (!siteplanFind || siteplanFind.length === 0) {
        return {
            success: false,
            error: "Planos de sitio no encontrados"
        };
    }

    return {
        success: true,
        data: {
            siteplans: siteplanFind
        }
    };
}

export const executeGetFloorplansTool = async (args: any) => {
    const sessionId = args.data?.sessionId || args.data?.token || args.data?.id;
    const validation = validateSession(sessionId);

    if (!validation.valid) {
        return {
            success: false,
            error: validation.error || "Sesión inválida"
        };
    }

    const communities = loadCommunities();
    const community = (communities as any[]).find((community: { communityDoc: { uid: string | undefined; }; }) => community.communityDoc.uid === args.data.communityUID);
    if (!community) {
        return {
            success: false,
            error: "Comunidad no encontrada"
        };
    }

    const floorplans = community.floorplan;

    if (!floorplans) {
        return {
            success: false,
            error: "Planos de piso no encontrados"
        };
    }

    return {
        success: true,
        data: {
            floorplans: floorplans
        }
    };
}

