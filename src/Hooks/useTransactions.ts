'use client'

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction } from '@/lib/types';

interface UseTransactionsResult {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch user transactions from Firestore
 * @param uid - User ID to fetch transactions for
 * @param realtime - Whether to use real-time updates (default: false)
 * @returns Object containing transactions, loading state, error, and refetch function
 */
export function useTransactions(uid: string | undefined, realtime: boolean = false): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!uid) {
      setLoading(false);
      setError('No user ID provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Reference to user's Transactions subcollection
      const transactionsRef = collection(db, 'users', uid, 'Transactions');
      
      // Query transactions ordered by creation date (newest first)
      const q = query(transactionsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      
      const fetchedTransactions: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        fetchedTransactions.push({
          id: doc.id,
          ...doc.data()
        } as Transaction);
      });

      setTransactions(fetchedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    if (realtime) {
      // Set up real-time listener
      const transactionsRef = collection(db, 'users', uid, 'Transactions');
      const q = query(transactionsRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedTransactions: Transaction[] = [];
          querySnapshot.forEach((doc) => {
            fetchedTransactions.push({
              id: doc.id,
              ...doc.data()
            } as Transaction);
          });

          setTransactions(fetchedTransactions);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error in transaction listener:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      // Fetch once
      fetchTransactions();
    }
  }, [uid, realtime]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions
  };
}
