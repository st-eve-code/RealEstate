import { Timestamp } from "firebase/firestore";
import { RentingType } from "./types";

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
