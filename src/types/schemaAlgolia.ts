
/**
 * Types for communities, division, plans and lots
 * Algolia data parser for data client to optimize queries and search
 */


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

export interface DivisionsAlgolia {
  "uid": string,
  "name": string,
  "objectID": string // Algolia id
}

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
  "objectID": "1723341001"
}

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