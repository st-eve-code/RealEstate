import { OrderByDirection, Timestamp, WhereFilterOp } from 'firebase/firestore';
import { LucideIcon } from 'lucide-react';

export type AccountRole = "user" | "landlord" | "admin" | "ceo"

export type RentingType = 'hostel' | 'apartment' | 'studio';

export type VerificationStatus = "pending" | "verified" | "rejected"

export type SubscriptionStatus = "active" | "expired" | "pending"

export type SubscriptionPlanLabel = "daily" | "monthly" | "yearly"

/**
 * Payment Method for Momo
 */
export interface PaymentMOMO {
    id: string,
    uid: string,
    operator: "MTN"|"Orange",
    phoneNumber: string,
    createdAt: Timestamp,
    updatedAt?: Timestamp,
    paymentType: 'momo'
}

/**
 * Payment Method for Card
 */
export interface PaymentCard {
    id: string,
    uid: string,
    cardOwner: string,
    cardNumber: string,
    expDate: string,
    cvv: string,
    createdAt: Timestamp,
    updatedAt?: Timestamp
    paymentType: 'card'
}

/**
 * Payment Transaction but not used again for this project
 * @deprecated no need as only subscription payments are needed for this project
 */
export interface Payment{
    id: string,
    name: string,
    plan: SubscriptionPlanLabel,
    amount: number,
    type: 'payment'
}

/**
 * Subscription Transaction, containing subscription details like expiry date, subscription plan details and payment details
 */
export interface Subscription {
    id: string,
    name: string,
    description: string,
    plan: SubscriptionPlanLabel,
    amount: number,
    accType?: "tenant"|"landlord",
    type: 'subscription',
    features?: string[]
    tax?: number // 0.25 = 25%, 0.1 = 10%
    constraints: {
        viewLimits?: number,
        postConstraints?: number,
        duration: number // milliseconds
    }
}

/**
 * Transaction, containing subscription details and payment details
 * In firebase, it is stored in the users/uid/Transactions collection
 */
export interface Transaction {
    id: string,
    uid: string,
    subscription: Subscription | Payment,
    payment: PaymentMOMO | PaymentCard,
    paid: number,
    createdAt: Timestamp,
    expiresAt: Timestamp,
    updatedAt?: Timestamp,

    state?: 'active'|'expired'|'banned'|'terminate'|'refund',
}


/**
 * landlord details like documents among other things
 */
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

/**
 * In firebase also includes Transactions subcollection, Favorites subcollection, Payment Methods subcollection
 */
export interface User {
    uid: string,
    fullName?: string,
    displayName: string,
    email: string,
    role: UserRole | LandLordRole | AdminRole,
    lastLogin: Timestamp,
    createdAt: Timestamp,

    dateOfBirth?: string,
    updatedAt?: Timestamp,
    numberOfProperties?: number,
    phoneNumber?: string,
    imageUrl?: string,
    liked?: string[],
    saved?: string[],

    fA2: boolean,
    inAppNotification: string[],
    emailSubscription: string[],

    loadedUnits: Unit[],

    subscription?: Transaction | Omit<Transaction, "uid">, // subscription made IDs
    autoRenewal?: boolean,
    fcmToken?: string,
    deviceInfo?: {
        currentDeviceToken?: string,
        deviceType?: string,
        deviceModel?: string,
        deviceOS?: string,
        deviceOSVersion?: string,
        deviceOSBuild?: string,
        deviceOSBuildVersion?: string,
        deviceOSBuildVersionCode?: string,
        deviceOSBuildVersionName?: string,
    }

}

/**
 * Subscription Plan, containing plan details like name, price, duration and features. 
 * This is used to display the plan details to the user for them to subscribe to and to
 * in firebase, it is stored in the plans collection
 */
export interface Plan {
    id: number;
    name: string;
    price: number;
    duration: number;
    features: string[];
}

export interface GeoLocate{
    lat: number,
    lon: number
}


/**
 * Unit properties
 * @description on firebase have collections: likes, views, reviews
 * in firebase, it is stored in the units collection
 */
export interface Unit {
    id: string,
    building: {id: string, name: string},
    name: string,
    description: string,
    price: number,
    period?: string,
    currency: string,
    location: string,

    available: boolean,
    type: RentingType,
    imageUrl: string[] // images 
    floor?:number, // floor number
    
    rooms: string[] // kitchen, bedroom, indoor toilet
    rating: {
        value: number, // sum of all rates
        total: number, // number of voters
        reviews?: number // counts
    },
    // reviews: {user: string, star: number, comment?: string}[] // read 
    features?: string[] // Wifi, water
    tags: string[] // apartment, street, in-door toilet (in general additional search params)
    views: number, // number of times the unit has been viewed
}


/**
 * Unit View, containing view details like user, unit and timestamp
 * to be able to track unit views per time range for analytics
 * in firebase, stored in units/id/UnitViews subcollection
 */
export interface UnitView {
    id: string, // this id
    uid: string, // user that viewed the unit
    unit: string, // unit that was viewed
    createdAt: Timestamp, 
}

/**
 * Unit Review, containing review details like rating, comment, author and timestamp
 * in firebase, it is stored in the units/id/reviews subcollection
 */
export interface UnitReview{
    id: string, // this id
    uid: string, // user that sent review
    unit: string,
    rating: number, // stars
    author: string,
    title: string,
    comment: string // comment
    createdAt: Timestamp,
    updatedAt: Timestamp,
}

/**
 * To be touched later
 * @todo unsure of what this is for
 */
export interface Property {
    id: number;
    buildingId: number; // FK to building.id
    unitId: number; // FK to unit.id
    tenantId?: number; // FK to tenant.userId
    rentAmount: number;
}

/**
 * To be touched later
 * @todo unsure of what this is for
 */
export interface UserRent {
    buildingId: string,
    roomId: string,
    type: RentingType,
    createdAt: Timestamp,
    updatedAt?: Timestamp
}


/**
 * 
 */
export interface SortConfig {
    field: string;
    direction: OrderByDirection; // 'asc' or 'desc'
}

export interface HandlerParams {
    pageSize?: number;
    // Cursors are now dynamic based on the sort fields
    lastVisibleDocData?: Record<string, any> | null; 
    regex?: string;
    table: string;
    // New dynamic sort parameter
    sortConfig: SortConfig[]; 
}

export interface HandlerResult<T> {
    results: T[];
    nextCursor: Record<string, any> | null; 
    error?: string;
}

export interface Activity {
    id: string,
    uid: string,
    name: string,
    description: string,
    createdAt: Timestamp,
    location: {
        geo?: GeoLocate,
        ip?: string
    },
    type: 'login-attempt' | 'login' | 'search' | 'support' | 'feedback',
    subjectId?: string
}

export interface FirestoreResult {
    success: boolean;
    message?: string;
    error?: unknown;
}

export interface FirestoreSingleResult<T> {
    data: T | null;
    success: boolean;
    message?: string;
    error?: unknown;
}

export interface FirestoreListResult<T> {
    data: T[];
    success: boolean;
    message?: string;
    error?: unknown;
}

export interface FirestoreConstraint {
    field: string;
    operator: WhereFilterOp;
    value: any;
}

export interface FirestoreListResult2<T> {
    data: (T & { id: string, refPath: string })[]; // Add id and full path to results
    success: boolean;
    message?: string;
    error?: unknown;
}
  

export type AmenityType = {
    icon: LucideIcon;
    label: string;
    color: string;
};

/* OUTDAtED HANDLER PARAM TYPE */

export interface HandlerParams {
    pageSize?: number;
    lastCreatedAt?: Date | null; // Use Date type for consistency
    regex?: string;
    table: string;
}
