

// Interfaz para definir la estructura de una comunidad
interface Community {
  CommunityId: string;
  CompanyCode: string;
  ProjectCode: string;
  CommunityName: string;
  PriceMin: number;
  PriceMax: number;
  PriceMinDisplayText: string | null;
  PriceMaxDisplayText: string | null;
  CityState: string;
  Address: string;
  Phone: string;
  BedroomsMin: string;
  BedroomsMax: string;
  BathroomsMin: string;
  BathroomsMax: string;
  SizeMin: string;
  SizeMax: string;
  Style: string;
  Status: string;
  // Agregar más propiedades según sea necesario
  [key: string]: any;
}

// Interfaz para los datos del JSON
interface CommunitiesData {
  communitiesData: Community[];
}

/**
 * Función auxiliar para eliminar comunidades duplicadas
 * @param communities - Array de comunidades
 * @returns Array de comunidades únicas basado en CommunityId, CompanyCode y ProjectCode
 */
function eliminarDuplicados(communities: Community[]): Community[] {
  const seen = new Set<string>();
  return communities.filter(comunidad => {
    const key = `${comunidad.CommunityId}-${comunidad.CompanyCode}-${comunidad.ProjectCode}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Filtra las comunidades basándose en un rango de precios y elimina duplicados
 * @param precioMinimo - Precio mínimo para filtrar
 * @param precioMaximo - Precio máximo para filtrar
 * @returns Array de comunidades únicas que cumplen con el criterio de precio
 */
export function filtrarComunidadesPorPrecio(
  precioMinimo: number,
  precioMaximo: number,
  communitiesData: CommunitiesData
): Community[] {
  const data: CommunitiesData = communitiesData;

  const comunidadesFiltradas = data.communitiesData.filter((comunidad: Community) => {
    // Verificar que la comunidad tenga precios válidos (no sean 0 o null)
    if (!comunidad.PriceMin || !comunidad.PriceMax) {
      return false;
    }

    // Filtrar comunidades donde el rango de precios se superpone con el rango solicitado
    return (
      comunidad.PriceMin <= precioMaximo &&
      comunidad.PriceMax >= precioMinimo
    );
  });

  // Eliminar duplicados antes de retornar
  return eliminarDuplicados(comunidadesFiltradas);
}

/**
 * Función alternativa que filtra por precio mínimo exacto y elimina duplicados
 * @param precioMinimo - Precio mínimo exacto
 * @param precioMaximo - Precio máximo exacto
 * @returns Array de comunidades únicas dentro del rango exacto
 */
export function filtrarComunidadesPorRangoExacto(
  precioMinimo: number,
  precioMaximo: number,
  communitiesData: CommunitiesData
): Community[] {
  const data: CommunitiesData = communitiesData;

  const comunidadesFiltradas = data.communitiesData.filter((comunidad: Community) => {
    if (!comunidad.PriceMin || !comunidad.PriceMax) {
      return false;
    }

    return (
      comunidad.PriceMin >= precioMinimo &&
      comunidad.PriceMax <= precioMaximo
    );
  });

  // Eliminar duplicados antes de retornar
  return eliminarDuplicados(comunidadesFiltradas);
}

// Ejemplo de uso:
// const comunidadesFiltradas = filtrarComunidadesPorPrecio(400000, 600000);
// console.log(comunidadesFiltradas);