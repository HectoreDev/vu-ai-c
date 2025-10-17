export interface IFTypeCommunity {
  objectType: "community";
  communityId: string;
  companyCode: string;
  projectCode: string;
  communityName: string;
  communityStatus: string;
  pageUrl: string;
  lat: number;
  lng: number;
  priceMin: number;
  priceMax: number;
  bedroomsMin: number;
  bedroomsMax: number;
  bathroomsMin: number;
  bathroomsMax: number;
  garagesMin: number;
  garagesMax: number;
  storiesMin: number;
  storiesMax: number;
  sizeMin: number;
  sizeMax: number;
  style: string;
  floorPlansCt: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: string;
  id: number;
  thumbnailImage: IFThumbnailImage;
  amenities: IFAmenity[];
}

interface IFAmenity {
  title: string;
}

interface IFThumbnailImage {
  Image: string;
}
