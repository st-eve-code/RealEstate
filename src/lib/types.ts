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
    user: {
        id: string,
        name: string
    },
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
    user: {
        id: string,
        name: string
    },
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
    },
    createdAt: Timestamp,
    expiresAt: Timestamp, 
    updatedAt?: Timestamp,
    createdBy: {
        id: string,
        name: string
    }
}

/**
 * Transaction, containing subscription details and payment details
 * In firebase, it is stored in the users/uid/Transactions collection
 */
export interface Transaction {
    id: string,
    user: {
        id: string,
        name: string
    }
    subscription: Subscription,
    payment: PaymentMOMO | PaymentCard,
    paid: number,
    createdAt: Timestamp,
    expiresAt: Timestamp,
    updatedAt?: Timestamp,

    state?: 'active'|'expired'|'banned'|'terminate'|'refund',
}


/**
 * We cant display analytic data like monthly revenue with the current method of Transaction sub collection 
 * as it will involve iterating through all users which is time consuming, so this will help fetch data
 * in firebase it is stored in AnalyticsTransactions collection
 */
export interface AnalyticTransaction {
    id: string,
    user: {
        id: string,
        name: string
    },
    transactionId: string, // linking back to the /user/uid/Transaction document 
    paid: number,
    createdAt: Timestamp,
    expiresAt: Timestamp
}


/**
 * landlord details like documents among other things
 */
export interface LandLord {
    verified: string,
    licenseNumber?: string,
    documents: string[],
    complaints?: number
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
    points: number,

    fA2: boolean,
    inAppNotification: string[],
    emailSubscription: string[],
    permissions?: {
        shareContactInfo: boolean,
        sharePhoto: boolean,
    },
    privacyPolicy: string, // privacy policy accepted by the user


    loadedUnits: Unit[],

    subscription?: Transaction | Omit<Transaction, "uid">, // subscription made IDs
    autoRenewal?: boolean, // for payment subscriptions
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
    },

    /* subContraints?: {
        viewed: number,
        limit: number,
        updatedAt: Timestamp
        resetAt: Timestamp
    } */

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
    duration: number; // in milliseconds
    features: string[];
    points: number,
    createdAt: Timestamp,
    updatedAt?: Timestamp,
    createdBy: {
        id: string,
        name: string
    }
}

export interface GeoLocate{
    lat: number,
    lon: number
}


/**
 * Unit properties, in this project this sure is like a room(for apartments and studio) or the whole house for homes
 * the thing here is the system is not set to make each room for an apartment seperately cause it will be time consuming
 * and we know not all studio in an building is the same, so landlords are adviced to split the rooms in buildings based on properties
 * @example a building with 3 12 building but 3 distinct rooms will have the landlord create 3 units and with "totalnumber" property defining how many rooms and 
 * "instock" number available  but dont think this is necessary as available and state property help regulate the visibility state
 * 
 * @description on firebase have collections: likes, views, reviews
 * in firebase, it is stored in the units collection
 */
export interface Unit {
    id: string,
    building: {id: string, name: string}, // not necessary
    caretaker: {id: string, name: string, email: string, phoneNumber?: string},
    name: string,
    description: string,
    payment: {
        price: number, // amount to be paid
        period?: string, // yearly, monthly, weekly, daily
        currency: string,  // XAF, USD, EUR, etc.
        tax?: number, // 0.25 = 25%, 0.1 = 10%
    }
    totalnumber: number,

    // visible: boolean, // this is deprecated, works the same way as status property where being archived is false and approved is true
    available: boolean,
    remark?: { // incase an info like limited room left needs to be displayed or something like a notice on the unit's page
        type: "basic" | 'info' | 'warning' | 'danger',
        text: string
    }
    type: RentingType,
    videoUrl?: string,
    images: {
        category: string
        urls: string[]
        videoUrls?: string[]
    }[],
    location: {
        country: string
        city: string
        address: string
    },
    rooms: {
        bedrooms: number
        bathrooms: number
        parlors: number
        kitchens: number
    },
    props?: {[index: string]: number}, // properties like 2 bed, 2 tables, etc
    rating: {
        value: number, // sum of all rates
        total: number, // number of voters
        reviews?: number // counts
    }, // rating obtained by taking value/total

    amenities: string[] // Wifi, water
    extraAmenities: string[] // Wifi, water but with extra cost
    houseRules: string
    tags: string[] // apartment, street, in-door toilet (in general additional search params)
    views: number, // number of times the unit has been viewed

    
    // status of unit during listing process (approval or rejection), rejected means the unit is not suitable for listing, the unit is still available for editing. archived means the unit is no longer available for listing, deleted means the unit is deleted from the system (not the db, just not available for editing anymore).
    status: "pending" | "approved" | "rejected" | "archived" | "deleted", // cant archive unless approved
    statusProperty?: { // can be very helpful during rejection for caretaker to edit details or get more context when needed
        createdAt: Timestamp,
        createdBy: {
            uid: string,
            name: string
        },
        reason?: string
    }
    isVerified: boolean,
    createdAt: Timestamp,
    updatedAt?: Timestamp,

    reportCount: number, 
}

/**
 * Listing , containing listing details like status, reason, reviewed by and reviewed at
 * in firebase, it is stored in the units/id/Listing subcollection
 * This is used to track the status of a listing and the reason for the status and also how many times the listing unit has been reviewed
 */
export interface Listing {
    id: string,
    unit: {
        id: string,
        name: string
    },
    landlord: {
        id: string,
        name: string
    },
    status: 'pending' | 'approved' | 'rejected' | 'archived',
    createdAt: Timestamp,
    updatedAt?: Timestamp,
    reason?: string,
    reviewedBy?: {id: string, name: string},
    reviewedAt?: Timestamp,
    reviewedReason?: string,
}

/**
 * Reports are used to report a unit or a landlord for a reason,
 * this (UnitReport) is used to track the reports on unit and the reason for the report
 * in firebase, it is stored in the units/id/Reports subcollection
 * each time a report is made, the unit's count is incremented and the report is stored in the subcollection
 */
export interface UnitReport {
    id: string,
    unit: {
        id: string,
        name: string,
    },
    user: {
        id: string,
        name: string
    },
    landlord: {
        id: string,
        name: string
    }
    about?: string,
    report: string,
    createdAt: Timestamp,
    updatedAt?: Timestamp,
}

/**
 * when a listing is created and needs to be reviewed by the admin, this is used
 * we cant use the one store as unit subcollection cause finding all pending listings will be time consuming as we'll have to iterate through all units
 * in firebase, it is stored in the listings collection, 
 * yeah, so basically an anchor for the listing status, which triggers for attention when the listing is pending and only be done
 * 
 * @deprecated to be honest, this is useless, having a house status as pending , is already need to be reviewed, no need for some long ass collection again
 */
export interface ListingCollection {
    id: string,
    listingId: string,
    unit: {
        id: string,
        name: string,
    },
    landlord: {
        id: string,
        name: string
    },


    status: 'pending' | 'approved' | 'rejected' | 'archived' | 'deleted', // not even necessary, cause when reviewed no attention needed hence delete document
    count: number,
    createdAt: Timestamp,
    updatedAt?: Timestamp,
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
    user: { // user that sent review
        id: string,
        name: string 
    },
    unit: string,
    rating: number, // stars
    title: string,
    comment: string // comment
    createdAt: Timestamp,
    updatedAt: Timestamp,
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

/**
 * a collection with Activity
 */
export interface Activity {
    id: string,
    user: {
        id: string,
        name: string
    },
    title: string,
    context: string,
    featured: {
        type: 'user.creation' | 'user.action' | 'user.delete' | 'property.update' | 'payment' | 'support' | 'admin.action' // for the filtering
        badge: string, // for the badge
        primary?: string // the blue text beside time ago, it's mostly the subject
    },
    color: string, // the color of the badge

    createdAt: Timestamp,
    location: {
        geo?: GeoLocate,
        ip?: string
    },
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

// ============================================
// ADMIN SETTINGS TYPES
// ============================================

/**
 * General Settings for the platform
 * Stored in Firestore at: settings/general
 */
export interface GeneralSettings {
    siteName: string;
    siteUrl: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
    companyName: string;
    companyPhone: string;
    companyAddress: string;
    currency: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    updatedAt?: Timestamp;
    updatedBy?: {
        uid: string;
        name: string;
    };
}

/**
 * Payment Settings for the platform
 * Stored in Firestore at: settings/payment
 */
export interface PaymentSettings {
    currency: string;
    paymentMethods: {
        momo: boolean;
        orangeMoney: boolean;
        paypal: boolean;
        stripe: boolean;
    };
    momoApiKey?: string;
    orangeApiKey?: string;
    paypalClientId?: string;
    stripePublicKey?: string;
    stripeSecretKey?: string;
    commissionRate: number;
    taxRate: number;
    enableAutoRefund: boolean;
    updatedAt?: Timestamp;
    updatedBy?: {
        uid: string;
        name: string;
    };
}

/**
 * Notification Settings for the platform
 * Stored in Firestore at: settings/notification
 */
export interface NotificationSettings {
    enablePushNotifications: boolean;
    enableEmailNotifications: boolean;
    enableSmsNotifications: boolean;
    notifyOnNewProperty: boolean;
    notifyOnNewUser: boolean;
    notifyOnSubscription: boolean;
    notifyOnTransaction: boolean;
    notifyOnReport: boolean;
    dailyReportEmail: string;
    updatedAt?: Timestamp;
    updatedBy?: {
        uid: string;
        name: string;
    };
}

/**
 * Security Settings for the platform
 * Stored in Firestore at: settings/security
 */
export interface SecuritySettings {
    enableTwoFactor: boolean;
    sessionTimeout: number; // in minutes
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
    enableCaptcha: boolean;
    enableAuditLog: boolean;
    ipWhitelist: string[];
    updatedAt?: Timestamp;
    updatedBy?: {
        uid: string;
        name: string;
    };
}

/**
 * Combined Settings interface
 * Used for fetching all settings at once
 */
export interface PlatformSettings {
    general: GeneralSettings;
    payment: PaymentSettings;
    notification: NotificationSettings;
    security: SecuritySettings;
}
