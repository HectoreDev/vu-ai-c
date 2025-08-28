# 🚀 VU AI API - MCP Tools & Routes Mapping

## 📋 Overview
Esta tabla muestra la relación entre las **MCP Tools** (Model Context Protocol) y las **REST API Routes** disponibles en la aplicación. El sistema ahora incluye gestión avanzada de sesiones con tokens y validación de seguridad.

## 🛠️ MCP Tools & REST API Mapping

| MCP Tool Name | Tool Function | Description | REST Endpoint | HTTP Method | Session Required | Status |
|---------------|---------------|-------------|---------------|-------------|------------------|---------|
| `init` | `executeInitTool` | Inicializa el flujo de la aplicación | ❌ No disponible | - | ❌ | 🔄 Tool only |
| `session-start` | `executeSessionTool` | Crea nueva sesión y devuelve token único | `/start-session` | POST | ❌ | ✅ Activo |
| `get-name` | `executeGetNameTool` | Solicita nombre al usuario con validación de sesión | `/get-name` | POST | ✅ | ✅ Activo |
| `get-location` | `executeGetLocationTool` | Obtiene ubicación de búsqueda con validación | `/get-location` | POST | ✅ | ✅ Activo |
| `get-communities` | `executeGetCommunitiesTool` | Encuentra comunidades con datos de sesión | `/get-communities` | POST | ✅ | ✅ Activo |
| `get-community-info` | `executeGetCommunityInfoTool` | Información específica de comunidad | `/get-community-info` | POST | ✅ | ✅ Activo |
| `check-session` | `executeCheckSessionTool` | Verifica validez de sesión activa | ❌ No disponible | - | ✅ | 🔄 Tool only |

## 🔐 Session Management System

### 🎫 Token-Based Authentication
- **Token Format**: `sess_{timestamp}_{random9chars}` (ej: `sess_1704123456_abc123def`)
- **Expiration**: 24 horas desde creación
- **Validation**: Verificación automática en cada tool que lo requiera
- **Cleanup**: Limpieza automática cada 30 minutos

### 📊 Session Data Structure
```typescript
interface SessionData {
    id: string;           // Token único de sesión
    userId?: string;      // ID del usuario (opcional)
    name?: string;        // Nombre recolectado
    location?: string;    // Ubicación recolectada
    createdAt: Date;      // Fecha de creación
    expiresAt: Date;      // Fecha de expiración
    isActive: boolean;    // Estado activo/inactivo
}
```

## 🔧 API Usage Examples

### 🆕 1. Create Session
```bash
curl -X POST http://localhost:3000/start-session \
  -H "Content-Type: application/json" \
  -d '{"data": {}}'

# Response:
{
  "success": true,
  "data": {
    "sessionId": "sess_1704123456_abc123def",
    "message": "Sesión iniciada correctamente",
    "nextStep": "Ahora necesito que me proporciones tu nombre.",
    "expiresAt": "2024-01-02T15:30:00.000Z",
    "token": "sess_1704123456_abc123def"
  }
}
```

### 👤 2. Submit Name (with Session)
```bash
curl -X POST http://localhost:3000/get-name \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "sessionId": "sess_1704123456_abc123def",
      "name": "Juan Pérez"
    }
  }'

# Response:
{
  "success": true,
  "data": {
    "name": "Juan Pérez",
    "sessionId": "sess_1704123456_abc123def",
    "valid": true,
    "session": { /* session data */ }
  }
}
```

### 📍 3. Submit Location
```bash
curl -X POST http://localhost:3000/get-location \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "sessionId": "sess_1704123456_abc123def",
      "location": "Madrid, España"
    }
  }'
```

### 🤖 4. Gemini Chat (with Automatic Session Management)
```bash
curl -X POST http://localhost:3000/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, quiero buscar una casa",
    "sessionId": 12345
  }'
```

## 🎯 Tool Execution Flow

### 📋 Sequential Tool Chain with Session Validation
1. **session-start** → Genera token de sesión único (`sess_xxx`)
2. **get-name** → Recolecta nombre + valida sesión → actualiza session.name
3. **get-location** → Recolecta ubicación + valida sesión → actualiza session.location  
4. **get-communities** → Busca usando session.location + valida sesión
5. **get-community-info** → Obtiene detalles + valida sesión
6. **check-session** → Valida estado actual de sesión (herramienta auxiliar)

### 🔄 Session State Management
- **Step 0**: Inicialización (`session-start`) - Sin validación requerida
- **Step 1**: Recolección de nombre (`get-name`) - **Requiere token válido**
- **Step 2**: Recolección de ubicación (`get-location`) - **Requiere token válido**
- **Step 3**: Búsqueda de comunidades (`get-communities`) - **Requiere token válido**
- **Step 4**: Información de comunidad (`get-community-info`) - **Requiere token válido**
- **Step 5**: Proceso completado

### ⚠️ Error Handling
```json
// Session inválida o expirada
{
  "success": false,
  "error": "Sesión expirada"
}

// Token faltante
{
  "success": false, 
  "error": "ID de sesión requerido"
}

// Sesión no encontrada
{
  "success": false,
  "error": "Sesión no encontrada"
}
```

## 🔧 Utility Functions Available

### 📚 Session Management Functions
- `generateSessionToken()`: Genera token único
- `createSession(userData?)`: Crea nueva sesión
- `validateSession(sessionId)`: Valida sesión existente  
- `updateSession(sessionId, data)`: Actualiza datos de sesión
- `invalidateSession(sessionId)`: Invalida sesión específica
- `getSessionInfo(sessionId)`: Obtiene información de sesión
- `getAllActiveSessions()`: Lista todas las sesiones activas
- `cleanExpiredSessions()`: Limpia sesiones expiradas

### 🔍 Input Schema Requirements

#### Tools que requieren `sessionId`:
- `get-name`: `{ sessionId, name }`
- `get-location`: `{ sessionId, location }`  
- `get-communities`: `{ sessionId }`
- `get-community-info`: `{ sessionId, communityName? }`
- `check-session`: `{ sessionId }`

#### Compatible field names:
- `sessionId` (preferido)
- `token` (alternativo)
- `id` (compatibilidad hacia atrás)

## 🛡️ Security Features

### 🔒 Session Security
- ✅ Tokens únicos e impredecibles
- ✅ Expiración automática (24h)
- ✅ Validación obligatoria en tools sensibles
- ✅ Limpieza automática de sesiones expiradas
- ✅ Estado centralizado y controlado

### 🔄 Session Lifecycle
1. **Created**: `createSession()` → `isActive: true`
2. **Active**: Validación exitosa → datos actualizados
3. **Expired**: `expiresAt` < now → `isActive: false`  
4. **Cleaned**: Eliminada del almacén cada 30min

## 🔧 Schema for managment data between MCP and LLM

Get communities from Algolia with data from LLM. This data is getter when tool `get-community-info` is called. We can get filter info in this call for range of price or beds, for status or amenities.

```javascript
// Name of index to access in Algolia is communities-gemini

export interface CommunitiesAlgolia {
  "CommunityId": string,
  "CompanyCode": string,
  "ProjectCode": string,
  "CommunityName": string,
  "CommunityStatus": string,
  "PriceMin": number,
  "PriceMax": number,
  "StateAbbreviation": string,
  "BedroomsMin": number,
  "BedroomsMax": number,
  "hasExtraData": boolean,
  "amenities": string[],
  "objectID": string // Algolia id
}

Example:

{
  "CommunityId": "03005107",
  "CompanyCode": "3005",
  "ProjectCode": "107",
  "CommunityName": "Turnberry",
  "CommunityStatus": "Move-In Ready Homes Available ",
  "PriceMin": 484990,
  "PriceMax": 557990,
  "StateAbbreviation": "CO",
  "BedroomsMin": "2",
  "BedroomsMax": "7",
  "hasExtraData": true,
  "amenities": [
    "Community playground",
    "Turnberry Elementary School",
    "Bison Ridge Recreation Center",
    "Denver International Airport",
    "Walking paths"
  ],
  "objectID": "3556344002"
}
```

```javascript
// Name of index to access in Algolia is divisions
export interface DivisionsAlgolia {
  "uid": string,
  "name": string,
  "objectID": string // Algolia id
}

Example:

{
  "uid": "aoHe9LFKIK7Rr3HcpUEE",
  "name": "Texas Master Plans",
  "objectID": "fddece13080f6_dashboard_generated_id"
}
```

When a community was selected, we can filter Lots for get relevant information for user like size of terrain, cost, orientation or plans to build in this lot. This api run if `get-siteplans` tool was trigged. Siteplans has all lots, but we can filter Lots by status for get only available lots. Lots has id for get Plans to select elevation.

```javascript
// Name of index to access in Algolia is lots-gemini
export interface LotsAlgolia {
  "lotUID": string,
  "address": string | null,
  "segmentUID": string,
  "uid": string,
  "collectionUID": string,
  "status": string,
  "reservationCost": number,
  "needPlan": boolean,
  "plansArray": string[],
  "objectID": string // Algolia ID
}

Example:

{
  "lotUID": "88ebd83d-aee8-48e9-853d-705256815649",
  "address": null,
  "segmentUID": "seg-4080",
  "uid": "jZxmQ7aIJT8kZW7bZ9Xw",
  "collectionUID": "91c44e14-1cc1-4da8-aa73-c9dae95d9248",
  "reservationCost": 100,
  "status": "available",
  "needPlan": true,
  "plansArray": [
    "JNm3DxkgsidjeMs63s4R",
    "gdQuVDUF7YmqhJfSg4VQ"
  ],
  "objectID": "7168461000" // Algolia ID
}

```

Now user can choice differents plans according his selection or AI recommendation. In this moment `get-floorplans` tool filtered plan by `uid`.

```javascript
// Name of index to access in Algolia is floorplans-gemini
export interface PlanAlgolia {
  "uid": string,
  "name": string,
  "status": string
}


export interface FloorplansAlgolia {
  "divisionUID": string,
  "uid": string,
  "name": string,
  "floorplan": PlanAlgolia[],
  "objectID": string // Algolia ID
}

Example:
{
  "divisionUID": "CrZyut94kZh8IKlyhW1h",
  "uid": "wiNqcqrq3cIgODLhEnIn",
  "name": "Sungold in Tracy",
  "floorplan": [
    {
      "uid": "pwn4k15b2WzxTh790oC6",
      "name": "Residence 1",
      "status": "active"
    },
    {
      "uid": "o9QGotUTb7xecVGCmdQK",
      "name": "Residence 2",
      "status": "active"
    }
  ],
  "objectID": "1723291001" // Algolia ID
}

```

### Work in progress

If user selected a plan but this want to see silimar options. We have a trained model including photos of plans. This option has a percentage of precision and is linked by community. Getting better results if it's the same community but this can recommend similar plans in another community, in this case we can add more options in the search.

Note: Call to recommendation it's diffent to filter and search. For more details visit https://www.algolia.com/doc/rest-api/recommend/#tag/recommendations 

```javascript
// Name of index to access in Algolia is images-house
export interface ImagesRecommended {
  "uid": string,
  "name": string,
  "imageSrc": string,
  "uidPlan": string,
  "communityUid": string,
  "hasBasement": boolean,
  "hasPool": boolean,
  "material": string,
  "objectID": string // Algolia ID
}

Example:

{
  "uid": "2088b4d7-e3f3-4338-a7ce-57b355138583",
  "name": "Exterior T",
  "imageSrc": "https://firebasestorage.googleapis.com/v0/b/taylor-morrison-vu.appspot.com/o/basegroup%2F6QP5GahAXuejC6Q4n307%2FqMl7or5NaezSEibDF5J6%2Fassets%2Fa0785f64-e126-4151-b35d-7ca397901a5e.jpg?alt=media&token=75b22720-5eb6-4215-9cf6-8b38fb84058a",
  "uidPlan": "6QP5GahAXuejC6Q4n307",
  "communityUid": "Pss3pmwQY6a7X9JMbqdT",
  "hasBasement": true,
  "hasPool": false,
  "material": "brick",
  "objectID": "257409002"
}

```

---

*Last updated: $(date)*  
*API Version: 2.0.0 - Session Management Update*  
*Security Level: Token-Based Authentication* 
