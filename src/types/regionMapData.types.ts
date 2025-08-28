/**
 * Types para la función loadCommunitiesForMCP
 * Basado en la estructura del JSON en data/divisions/2025-08-19/new-homes-phoenix.json
 */

export interface ThumbnailImage {
    Image: string;
    Caption: string;
    AlternateText: string;
    ImageId: string;
}

export interface CommunityData {
    CommunityId: string;
    CompanyCode: string;
    ProjectCode: string;
    CommunityName: string;
    CommunityStatus: string;
    CommunityLocationHref: string;
    PageUrl: string;
    Lat: string;
    Lng: string;
    UseLatLongDirections: boolean;
    GMBMapLink: string;
    GetDirections: string | null;
    PriceMin: number;
    PriceMax: number;
    PriceMinDisplayText: string;
    PriceMaxDisplayText: string;
    BedroomsMin: string;
    BedroomsMax: string;
    BathroomsMin: string;
    BathroomsMax: string;
    GaragesMin: string;
    GaragesMax: string;
    StoriesMin: string;
    StoriesMax: string;
    SizeMin: string;
    SizeMax: string;
    Style: string;
    FloorPlansCt: string;
    Url: string;
    CityState: string;
    Address: string;
    City: string;
    StateAbbreviation: string;
    ZIP: string;
    Phone: string;
    FormattedPhone: string;
    SizeRange: string;
    Status: string;
    StatusLink: string | null;
    PricingMessage: string;
    PricingLink: string | null;
    PricingHtml: string;
    PricingDisclosureHtml: string;
    LocationInfo: string | null;
    SolarDisclosureLink: boolean;
    CommunityLocationHtml: string;
    CommunityHoursHtml: string;
    SmsPhoneNumber: string;
    FormattedSmsPhoneNumber: string;
    IsRequestATour: boolean;
    UseJTILMessaging: boolean;
    ComingSoon: boolean;
    Id: number;
    MonthlyPaymentInfo: any | null;
    HideRegionMapPin: boolean;
    HidePersonalizedHomesTab: boolean;
    FullAddressHtml: string;
    ThumbnailImage: ThumbnailImage;
    BedroomsDisplayText: string;
    BathroomsDisplayText: string;
    GaragesDisplayText: string;
    StoriesDisplayText: string;
    IsRegionCommunity: boolean;
    Prices: number[];
    Sizes: number[];
    DisplayAboveMapPins: boolean;
}

export interface FloorPlanData {
    SpecialCopy: string | null;
    DisplayMonthlyPaymentCalculator: boolean;
    RegionName: string | null;
    StateAbbreviation: string;
    StateName: string | null;
    CityName: string;
    BannerText: string | null;
    PricedFrom: string;
    MonthlyPaymentInfo: any | null;
    Stories: string;
    ESCUpdatedOn: string;
    PricingHtml: string;
    PricingDisclosureHtml: string;
    HomesitePremiumHtml: string;
    CommunitySolarDisclosureLink: boolean;
    InteractiveViewVisible: boolean;
    CommunityStatus: string;
    CommunityPriceStatus: string;
    CommunityPriceStatusLink: string;
    // Agregar más propiedades según sea necesario
    [key: string]: any;
}

export interface StudioDetail {
    StudioTitle: string;
    Address: string;
    City: string;
    State: string;
    Zipcode: string;
    GMBMapLinkURL: string | null;
    Latitude: string;
    Longitude: string;
    Phone: string | null;
    RegionDesignStudioPageId: string | null;
}

export interface DesignStudio {
    StudioID: string;
    StudioName: string;
    StudioDetails: StudioDetail[];
    Phone: string;
    Latitude: string;
    Longitude: string;
    HoursText: string;
    UseLatLongDirections: boolean;
    Directions: string | null;
    ManagerName: string;
    ManagerEmail: string;
    ManagerTitle: string;
    ManagerImageUrl: {
        Image: string;
        [key: string]: any;
    };
    // Agregar más propiedades según sea necesario
    [key: string]: any;
}

export interface Region {
    RegionId: string;
    RegionName: string;
    Lat: string;
    Lng: string;
    CompanyCode: string;
    DefaultZoomLevel: number;
    PriceMin: number;
    PriceMax: number;
    BedroomsMin: number;
    BedroomsMax: number;
    BathroomsMin: number;
    BathroomsMax: number;
    GaragesMin: number;
    GaragesMax: number;
    StoriesMin: number;
    StoriesMax: number;
    SizeMin: number;
    SizeMax: number;
    [key: string]: any;
}

export interface SearchFilters {
    BedroomsMin: number;
    PriceMin: number;
    PriceMax: number;
}

export interface RegionMapData {
    communitiesData: CommunityData[];
    floorPlansData: FloorPlanData[];
    designStudio: DesignStudio[];
    isLogged: string;
    wishedCommunities: string;
    wishedFloorPlans: string;
    region: Region;
    searchFilters: SearchFilters;
}

export interface LoadCommunitiesForMCPParams {
    baseUrl: string;
    divisionName: string;
    isCommunity: boolean;
}

export interface LoadCommunitiesForMCPResult {
    success: boolean;
    data?: RegionMapData;
    error?: string;
    filePath?: string;
}
