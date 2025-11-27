export type AccountRole = "user" | "landlord" | "admin" | "ceo"

export type RentingType = 'house' | 'apartment' | 'room' | 'hostel';

export type VerificationStatus = "pending" | "verified" | "rejected"

export type SubscriptionStatus = "active" | "expired" | "pending"

export type SubscriptionPlan = "monthly" | "yearly"


export interface Subscription {
    id: string,
    name: string,
    description?: string,
    features: string[],
    plan: SubscriptionPlan,
    amount: number
    accType?: "tenant"|"landlord",
    state: 'active'|'expired'|'banned'|'terminate'|'refund',
    type: 'subscription',
    limit: number
}

export interface Transaction {
    id: string,
    uid: string,
    subscription: Subscription,
    paid: number,
    createdAt: Date,
    updatedAt: Date,
    expiresAt?: Date,
}



export interface LandLord {
    licenseNumber: string,
    documents: string[]
}

export interface UserRole{
    role: "user"
}

export interface LandLordRole{
    role: "landlord",
    landlord?: LandLord
}

export interface AdminRole{
    role: "admin",
    permmision: string[]
}

export interface User {
    uid: string,
    fullName: string,
    displayName?: string,
    email: string,
    role: UserRole | LandLordRole | AdminRole,
    lastLogin: Date,
    createdAt: Date,

    phoneNumber?: string,
    dateOfBirth?: string,
    updatedAt?: Date,
    numberOfProperties?: number,
    imageUrl?: string,
    liked?: string[],

    fA2: boolean,
    inAppNotification: string[],
    emailSubscription: string[]

    subscription?: Transaction, // subscription made IDs
    survey: string[], // surveys completed

}

export interface Plan {
    id: number;
    name: string;
    price: number;
    duration: number;
    features: string[];
}

export interface GeoLoacate{
    lat: number,
    lon: number
}

export interface Building {
    id: string,
    landlordId: string,
    name: string,
    address: string,
    imageUrls: string[],
    map?: GeoLoacate,
    isVerified: VerificationStatus,
    vTrials?: number,
    priceRange?: number[]
}

export interface Unit {
    id: string,
    building: {id: string, name: string},
    name: string,
    description: string,
    price: number,
    location: string,

    available: boolean,
    type: RentingType,
    imageUrl?: string[] // images 
    floor?:number, // floor number
    
    likes: string[], // favorite the room (probably get alerted when free) 
    props: string[] // kitchen, bedroom, indoor toilet
    rating: {
        value: number, // sum of all rates
        total: number // number of voters
    },
    // reviews: {user: string, star: number, comment?: string}[] // read 
    features?: string[] // Wifi, water
    tags: string[] // apartment, street, in-door toilet (in general additional search params)
}

export interface UnitReview{
    id: string, // this id
    user: string, // user that sent review
    unit: string,
    rate: number, // stars
    message: string // comment
    createdAt: Date,
    updatedAt: Date,
}

export interface Property {
    id: number;
    buildingId: number; // FK to building.id
    unitId: number; // FK to unit.id
    tenantId?: number; // FK to tenant.userId
    rentAmount: number;
}

export interface UserRent {
    buildingId: string,
    roomId: string,
    type: RentingType,
    createdAt: Date,
    updatedAt?: Date
}

export interface HandlerParams {
    pageSize?: number;
    lastCreatedAt?: Date | null; // Use Date type for consistency
    regex?: string;
    table: string;
}

export interface HandlerResult<T> {
    results?: T[];
    nextCursor?: Date | null;
    error?: string;
}