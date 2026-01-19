/**
 * Plan Management Service
 * Handles CRUD operations for subscription plans in Firestore
 */

import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plan } from '@/lib/types';

export interface PlanFormData {
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  points: number;
  description?: string;
  accType?: 'tenant' | 'landlord';
  popular?: boolean;
}

/**
 * Fetch all plans from Firestore
 */
export async function fetchPlans(): Promise<Plan[]> {
  try {
    const plansRef = collection(db, 'plans');
    const q = query(plansRef, orderBy('price', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id as any,
      ...doc.data(),
    })) as Plan[];
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
}

/**
 * Fetch a single plan by ID
 */
export async function fetchPlanById(planId: string): Promise<Plan | null> {
  try {
    const planRef = doc(db, 'plans', planId);
    const planDoc = await getDoc(planRef);
    
    if (!planDoc.exists()) {
      return null;
    }
    
    return {
      id: planDoc.id as any,
      ...planDoc.data(),
    } as Plan;
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
}

/**
 * Create a new plan
 */
export async function createPlan(
  planData: PlanFormData, 
  userId: string, 
  userName: string
): Promise<string> {
  try {
    const plansRef = collection(db, 'plans');
    
    const newPlan = {
      ...planData,
      createdAt: Timestamp.now(),
      createdBy: {
        id: userId,
        name: userName,
      },
    };
    
    const docRef = await addDoc(plansRef, newPlan);
    return docRef.id;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
}

/**
 * Update an existing plan
 */
export async function updatePlan(
  planId: string, 
  planData: Partial<PlanFormData>
): Promise<void> {
  try {
    const planRef = doc(db, 'plans', planId);
    
    await updateDoc(planRef, {
      ...planData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    throw error;
  }
}

/**
 * Delete a plan
 */
export async function deletePlan(planId: string): Promise<void> {
  try {
    const planRef = doc(db, 'plans', planId);
    await deleteDoc(planRef);
  } catch (error) {
    console.error('Error deleting plan:', error);
    throw error;
  }
}

/**
 * Get plans by account type
 */
export async function fetchPlansByAccountType(accType: 'tenant' | 'landlord'): Promise<Plan[]> {
  try {
    const plansRef = collection(db, 'plans');
    const q = query(
      plansRef, 
      where('accType', '==', accType),
      orderBy('price', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id as any,
      ...doc.data(),
    })) as Plan[];
  } catch (error) {
    console.error('Error fetching plans by account type:', error);
    throw error;
  }
}

/**
 * Get plan statistics
 */
export async function getPlanStats() {
  try {
    const plans = await fetchPlans();
    
    // Get all users to calculate plan subscriptions
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map(doc => doc.data());
    
    // Calculate stats
    const totalPlans = plans.length;
    const activeSubscriptions = users.filter(user => 
      user.subscription && user.subscription.state === 'active'
    ).length;
    
    const totalRevenue = users.reduce((sum, user) => {
      if (user.subscription?.state === 'active') {
        return sum + (user.subscription.paid || 0);
      }
      return sum;
    }, 0);
    
    return {
      totalPlans,
      activeSubscriptions,
      totalRevenue,
      totalMembers: users.length,
    };
  } catch (error) {
    console.error('Error fetching plan stats:', error);
    throw error;
  }
}
