import { sessionStore } from "../store/zustandStore";
import { tPrompts, tSuggestions } from "../controllers/i18n";

const sessionIdSuggest = `Requiere sessionId. Si no está presente, continua con la tool y sugiere preguntar el nombre del usuario.`;

export const prompts = {
  systemInstructions: `
[ROLE]
Eres un asesor de ventas inmobiliarias digital. Ayudas a encontrar comunidades y floorplans según presupuesto, ubicación y preferencias. Sé útil, cordial y conciso. No inventes datos.

[SCOPE]
Si el usuario pide algo fuera del ámbito inmobiliario (recetas, programación, tareas, noticias), rechaza cortésmente y redirige al proceso de compra de casa.

[TONE & STYLE]
- Cercano, profesional, amigable, positivo.
- Frases breves (1–2 líneas).
- 1–2 emojis por respuesta.
- Usa el nombre del usuario si lo tenemos; si no, “amigo”.
  `,
  getNamePrompt: `Obten el nombre del usuario si lo ha agregado y solo regresa el nombre`,
  getLocationsPrompt: `Lee el mensaje del usuario y genera los args para getLocations en el formato:
{ "locations": [ { "state": "...", "location": "...", "zip": "..." } ] }

Reglas:
- state es OBLIGATORIO. location y zip son opcionales.
- Si el usuario dice: "busco casa en Phoenix", devuelve [{"state":"AZ","location":"Phoenix"}].
- Si da un ZIP (5 dígitos) que pertenezca a una ciudad, incluye: [{"state":"AZ","location":"Phoenix","zip":"85001"}].
- Si solo menciona el estado ("Arizona"), devuelve [{"state":"AZ"}].
- No adivines: si una ciudad es ambigua (p.ej. Springfield), NO llames a la tool y pide una aclaración al usuario (ciudad + estado).
- No inventes zip. Usa zip SOLO si el usuario lo dio explícitamente.
- Usa nombres canónicos de estados en su abreviacion comun (p.ej., "AZ", "CL"; etc.).

Ejemplos:
"busco en phoenix" → locations:[{"state":"AZ","location":"Phoenix"}]
"en 85001" (ZIP Phoenix) → locations:[{"state":"AZ","location":"Phoenix","zip":"85001"}]
"solo arizona" → locations:[{"state":"AZ"}]
"casa en springfield" → NO llames a la tool; pide aclaración del estado.
`,
  getBudgetPrompt: `Establece el presupuesto del usuario SOLO con priceMin y priceMax. Si el usuario proporciona un precio único, úsalo para ambos campos. Reglas: priceMax ≥ priceMin. no aceptes numeros con sufijos k/m (p. ej., '550k', '1.2m').`,
  getAmenitiesPrompt: `Si el usuario busca una casa, es imprescindible preguntar por las amenidades, si detecta algunas amenidad, agregue una lista de ellas como array`,
  getInterestFindHomePrompt: `Conserva las motivaciones del usuario para buscar una vivienda. Acepta "interests" (array o string).`,
  getInterestRateTypePrompt: `Conservar el producto de financiación seleccionado: 'fha_30', 'conventional_30' o null si se rechaza. Acepta string 'interestRateType'.`,
  getCustomizingPrompt: `Persistir si el usuario está interesado en casas personalizables. Acepta {customizing:boolean} o {customizing} como valor booleano de texto libre.`,
  getMoveInReadyPrompt: `Indique si desea incluir viviendas listas para mudanza rápida. Acepta {moveInReady:boolean} o texto que devuelve un valor booleano.`,
  getRentingPrompt: `Indique si desea incluir viviendas disponibles para alquiler. Acepta {renting:boolean} o texto que devuelve un valor booleano.`,
  getInterestedHomePrompt: `Indique que intereses debe de tener la casa que esta buscando por ejemplo un solo nivel, sin escaleras, solo lo que sea de una casa etc, agregar en un array.`,
  getFloorplanBedPrompt: `Indique cuantos cuartos esta buscando solo indicar en numeros enteros y agregar el bed_min y bed_min ya si se obtiene un solo input se genera como bed_min y bed_min, y obtener min y max se pone 3-4, 3 or 4, etc,`,
  getFloorplanSqftPrompt: `Indique cuantos metros cuadrados esta buscando solo indicar en numeros enteros y agregar el sqft_min y sqft_max ya si se obtiene un solo input se genera como sqft_min y sqft_max, y obtener sqft_min y sqft_max se pone 1200-2000, 1000 a 2000, etc, `,
  getFloorplanBathPrompt: `Indique cuántos baños está buscando. Solo se aceptan números enteros (ej. 2, 3) o medios baños en incrementos de 
  .5 (ej. 2.5, 3 1/2). Si se obtiene un solo valor, se debe asignar tanto a bath_min como a bath_max. Si se obtiene un rango, se puede indicar con guion o con "or" (ej. 3-4, 3 or 4). No se permiten decimales diferentes a .5 (ej. 2.3 o 2.65).`,
  getFloorplanGaragePrompt: `Indique cuantos garage esta buscando solo indicar en numeros enteros y agregar el garage_min y garage_max ya si se obtiene un solo input se genera como garage_min y garage_max, y obtener min y max se pone 3-4, 3 or 4, etc,`,
  getFloorplanLevelPrompt: `Indique cuantos niveles o pisos esta buscando solo indicar en numeros enteros y agregar el level_min y level_max ya si se obtiene un solo input se genera como level_min y level_max, y obtener min y max se pone 1-2, 1 a 2, etc.`,
  searchCommunityPrompt: `Esta tool siempre va despues de la tool getLocations, si ya tenemos locations claras.`,
};

export const propertiesPrompts = {
  nameDescription: `Retorna el nombre que ha brindado el usuario`,
  locationsDescription: `"Lista de ubicaciones normalizadas. 'state' es requerido; 'location' (ciudad) y 'ZIP' (ZIP) son opcionales.`,
  locationDescription: `Cuidad (optional).`,
  stateDescription: `Estado (US). Requerido.`,
  zipDescription: `Zip code (optional, 5 dígitos).`,
  priceMinDescription: `Precio mínimo del rango. Si el usuario dio un solo precio, repítelo aquí y en priceMax.`,
  priceMaxDescription: `Precio máximo del rango. Debe ser mayor o igual a priceMin.`,
  amenitiesDescription: `tiene que venir en un array las amenidades`,
  sessionIdDescription: `Obligatorio. Si falta, la herramienta responde con una sugerencia para capturar el nombre del usuario.`,
  interestsFindHomeDescription: `texto libre que describe las motivaciones del usuario para buscar una vivienda.`,
  interestRateType: `exto libre como 'FHA', 'Convencional', 'no', 'omitir', valor: 'fha_30' | 'convencional_30' | 'null' (para borrar explícitamente)`,
  customizingDescription: `verdadero si está interesado, falso en caso contrario. Texto libre como 'sí', 'no', 'hoy no'.`,
  moveInReadyDescription: `verdadero para incluir mudanzas rápidas, falso para excluir y texto libre como 'sí, incluir', 'no, ahora no' convertir en booleano.`,
  rentingDescription: `verdadero para incluir alquileres, falso para excluir, Texto libre como 'sí, incluir alquileres' o 'no, ahora no' convertir a booleano.`,
  homeInterestDescription: `agrega los intereses de casa en un arreglo si vienen con comas o cualquier simbolo de separacion se agrega en un array.`,
  bedMinDescription: `bed_min del rango. Si el usuario dio un solo valor, repítelo aquí y en bed_max.`,
  bedMaxDescription: `bed_max del rango. Debe ser mayor o igual a bed_min.`,
  bathMinDescription: `bath_min del rango. Si el usuario dio un solo valor, repítelo aquí y en bath_max.`,
  bathMaxDescription: `bath_max del rango. Debe ser mayor o igual a bath_min.`,
  sqftMinDescription: `sqft_min del rango. Si el usuario dio un solo valor, repítelo aquí y en sqft_max.`,
  sqftMaxDescription: `sqft_max del rango. Debe ser mayor o igual a sqft_min.`,
  garageMinDescription: `garage_min del rango. Si el usuario dio un solo valor, repítelo aquí y en garage_max.`,
  garageMaxDescription: `garage_max del rango. Debe ser mayor o igual a garage_min.`,
  levelMinDescription: `level_min del rango. Si el usuario dio un solo valor, repítelo aquí y en level_min.`,
  levelMaxDescription: `level_max del rango. Debe ser mayor o igual a level_max.`,
};

export const suggestionPrompts = {
  suggestionName: "Solicita al usuario su nombre",
  suggestionLocation: "Solicita al usuario la ciudad o ciudades de interés.",
  suggestionBudget: "Solicita al usuario su presupuesto o rango de precios ",
  suggestionAnemities: "Solicita al usuario las amenidades que desea",
  suggestionInterestFindHome:
    "Solicita al usuario porque esta buscando casa o porque esta interesado en comprar una casa casa ejemplo: cambio de trabajo, inversion, etc",
  suggestionCustomizing:
    "Solicita al usuario si está interesado en personalización de la casa",
  suggestionMoveInReady:
    "Solicita al usuario si necesita una casa lista para mudarse",
  suggestionFloorplanBed:
    "Solicita al usuario el número de habitaciones deseado",
  suggestionFloorplanBath: "Solicita al usuario el número de baños deseado",
  suggestionFloorplanGarage: "Solicita al usuario el número de garajes deseado",
  suggestionFloorplanLevel: "Solicita al usuario el número de niveles deseado",
  suggestionRenting: "Solicita al usuario si esta interesado en rentar",
  suggestionFloorplanSqft:
    "Solicita al usuario los pies cuadrados (sqft) deseados",
  suggestionHomeInterest:
    "Solicita al usuario que intereses debe de tener la casa que esta buscando por ejemplo un solo nivel, sin escaleras, solo lo que sea de una casa etc",
  suggestionInterestRateType:
    "Solicita al usuario la tasa de interés de su preferencia dentro de estas opciones: FHA 30-Year Fixed Rate, Conventional 30-Year Fixed Rate o si no tiene preferencia",
  suggestionSearhCommunity: "o solicita si quiere que busque comunidades",
  suggestionComplete:
    "Toda la información está completa. Puedes mostrar resultados o buscar información específica de comunidades",
  suggestionPerfectMatch:
    "- Se te ha brindado información acerca de un lote con el precio perfecto, específica que ese loto coincide perfectamente con su búsqueda y suguiere que puedes mostrarle más información acerca de ese lote, los planes y la comunidad. Y después dale la opción de que puede buscar por más comunidades, pero esto después de que le haz dejado en claro que coincide con sus preferencias de ubicación y presupuesto",
};

export const createHandleError = (error: unknown, nameTool: string) => {
  const state = sessionStore.getState();
  const lng = state.lang;

  const message = (error as Error).message ?? "Unknown error";

  const header = tPrompts("errorHeader", lng);
  const occurred = tPrompts("errorOccurred", lng, { tool: nameTool, message });
  const tellUser = tPrompts("errorTellUser", lng);
  const stopTools = tPrompts("errorStopTools", lng);

  const systemInstruction =
    `${header}\n` + `- ${occurred}\n` + `- ${tellUser}\n` + `- ${stopTools}`;

  return {
    isError: true,
    message: `Error executing tool: ${message}`,
    systemInstruction,
  };
};

// export const createHandleError = (error: unknown, nameTool: string) => {
//   const errorPrompt = `
//   INSTRUCCIONES (NO MOSTRAR):
//    - Ocurrió un error al ejecutar la herramienta ${nameTool}: ${
//     (error as Error).message
//   }
//    - Por favor, informa al usuario que hubo un problema técnico y que estamos trabajando para solucionarlo.
//    - No intentes ejecutar más herramientas hasta que el problema se haya resuelto.
//   `;

//   return {
//     isError: true,
//     message: "Error executing tool: " + (error as Error).message,
//     systemInstruction: errorPrompt,
//   };
// };

export const createSuggestPrompt = () => {
  const { communities, filteredLots, lang } = sessionStore.getState();

  const suggestion = sessionStore.getState().suggest();

  if (!suggestion || !suggestion.suggestion) {
    return "";
  }

  const suggestLine = `- [Suggest] ${suggestion.suggestion}`;

  const hasCommunitiesLine =
    Array.isArray(communities) && communities.length > 0
      ? tSuggestions("suggestHasCommunities", lang)
      : "";

  const hasPerfectMatchLine =
    filteredLots && filteredLots.length > 0
      ? tSuggestions("suggestionPerfectMatch", lang)
      : "";

  const header = tSuggestions("suggestHeader", lang);
  const askOnlyField = tSuggestions("suggestAskOnlyField", lang);
  const noInvent = tSuggestions("suggestNoInvent", lang);
  const outputBlock = tSuggestions("suggestOutputBlock", lang);
  const dataContract = tSuggestions("suggestDataContract", lang);
  const restrictions = tSuggestions("suggestRestrictions", lang);
  const endSection = tSuggestions("suggestEndSection", lang);

  return [
    header,
    "",
    askOnlyField,
    noInvent,
    suggestLine,
    hasPerfectMatchLine || hasCommunitiesLine,
    "",
    outputBlock,
    dataContract,
    "",
    restrictions,
    "",
    endSection,
  ].join("\n");
};

// export const createSuggestPrompt = () => {
//   const { communities, priceMin, filteredLots } = sessionStore.getState();
//   const suggestion = sessionStore.getState().suggest();

//   const suggest =
//     suggestion.suggestion && `- [Suggest] ${suggestion.suggestion}`;

//   const hasCommunities =
//     Array.isArray(communities) && communities.length > 0
//       ? `- Puedes sugerir datos especificos de las comunidades sin inventar, pero siempre tienes que preguntar el [Suggest]`
//       : "";

//   const hasPerfectMatch = filteredLots && filteredLots.length > 0 ? suggestionPrompts.suggestionPerfectMatch : '';

//   console.log('filteredLots', filteredLots ,hasPerfectMatch)

//   if (!suggest) {
//     return ``;
//   }

//   return `
//  INSTRUCCIONES (NO MOSTRAR):

//  - Pregunta SOLO por ese dato, tono cordial y por su nombre o amigo.
//  - PROHIBIDO inventar, solo formular pregunta que este asociada con el suggest.
//  ${suggest}
//  ${hasPerfectMatch ? hasPerfectMatch : hasCommunities}
//  [OUTPUT — FORMATO OBLIGATORIO]
// Debes responder **exclusivamente** con un **JSON válido** (sin Markdown, sin backticks, sin fences) con esta estructura de **array de 3 elementos exactos**:
// [
//   "<comentario>",
//   "<pregunta>",
//   {
//   <data para ui pregunta o datos>
//   }
// ]

// [DATA CONTRACT]
// - En "data.budget" incluye SIEMPRE:
//   { "priceMin": <number>, "priceMax": <number> }
// - NUNCA formatees moneda ni agregues símbolos; SOLO números.
// - Si recibes contexto de lotes (lotsContext:true), incluye "data.prefill.lots" con la información del lote y dile que puedes mostrarle más información sobre ese lote específico:
// - Si recibes contexto de comunidades (communitiesContext:true), incluye "data.prefill.communities" con un arreglo de hasta 3 objetos:
//   { "id": string, "name": string, "city": string, "state": string, "priceMin": number, "priceMax": number }
// - Si no hay contexto de comunidades o lotes, omite "data.prefill".

// RESTRICCIONES DURO/DURO:
// - PROHIBIDO usar cualquier bloque de código, backticks o Markdown.
// - PROHIBIDO incluir tool_code, print(), o pseudo-código.
// - PROHIBIDO añadir campos fuera de lo descrito.
// - Si no estás 100% seguro de los datos, pregunta primero.

// [FIN DE MENSAJE]
// Siempre termina el arreglo con la marca textual [END] como cuarto elemento fuera del JSON. Ejemplo:
// [
//   "Listo, amigo 😄",
//   "¿Te gustaría que busque comunidades ahora?",
//   { data }
// ]
// [END]
//   `;
// };

// [TOOLS & STATE]
// - Para **leer o guardar información** SIEMPRE utiliza las tools disponibles.
// - No inventes datos ni asumas estado; si falta 'sessionId', inicia flujo pidiendo nombre (o usa la tool definida para ello).
// - Tras cada tool exitosa, suguiere el paso siguiente que te sugerira la respuesta de la tool.

// INSTRUCCIONES (NO MOSTRAR):

// - Pregunta SOLO por ese dato, tono cordial y por su nombre o amigo.
// - PROHIBIDO inventar, solo formular pregunta que este asociada con el suggest.
// ${nextTool}
// ${suggest}
// ${hasCommunities}

// Solo respondes sobre temas inmobiliarios: presupuesto, tasa/producto, ubicaciones/mercados, especificaciones de floorplan (recámaras/baños/garage/sqft), “quick move-in”, renta, etc, siempre preguntar datos faltantes sin inventar.

// [PERSONALIZACIÓN]
// - Si hay nombre en sesión, úsalo con naturalidad (“¡Excelente, (nommbre usuario)!”).
// - Si no, refiérete a la persona como “amigo”.

// [INTERACCIÓN / MODO LIBRE]
// - Si el usuario escribe libremente (ej.: “hola, soy Eduardo y busco casa en Orlando”), extrae lo relevante (nombre, localizacion, etc.) y usa las tools para **persistir** esos datos.
