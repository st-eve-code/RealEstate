import handler from '../internal-firebase';
import { Unit, SortConfig } from '../types';

// We define the standard sort configuration we want for the user's main feed:
const FEED_SORT_CONFIG: SortConfig[] = [
    { field: 'createdAt', direction: 'desc' }, // Newest items first
];


/**
 * Fetches a page of *unseen* units for a specific user, handling pagination internally.
 * Uses the robust handler with compound cursors.
 * 
 * @param seenUnitIds A Set of IDs the user has already seen.
 * @param cursor A Record<string, any> | null representing the last visible doc's data for pagination.
 * @param pageSize How many *new* units to return.
 */
export async function fetchUnseenUnitsForUser(
    seenUnitIds: Set<string>, 
    cursor: Record<string, any> | null = null, 
    pageSize: number = 10
): Promise<{ 
    units: Unit[], 
    nextCursor: Record<string, any> | null, 
    hasMore: boolean 
}> {
  
    let accumulatedUnseenUnits: Unit[] = [];
    let currentCursor = cursor;
    let attempts = 0;
    const MAX_ATTEMPTS = 5; // Prevents infinite loops if everything is seen

    while (accumulatedUnseenUnits.length < pageSize && attempts < MAX_ATTEMPTS) {
        
        // Fetch a larger batch internally to filter efficiently
        const batchSize = pageSize /* * 2 */; 

        // Call the generic handler
        const { results, nextCursor, error } = await handler<Unit>({
            pageSize: batchSize,
            lastVisibleDocData: currentCursor,
            table: "units",
            sortConfig: FEED_SORT_CONFIG // Use our predefined sort
        });

        if (error || !results || results.length === 0) {
            // Stop if there's an error or no more data in Firestore
            break;
        }

        // Filter the fetched batch against the user's seen IDs in memory
        const unseenInBatch = results.filter(unit => !seenUnitIds.has(unit.id));
        accumulatedUnseenUnits.push(...unseenInBatch);
        
        // Update the cursor for the next iteration if needed
        currentCursor = nextCursor;
        
        // If the 'nextCursor' is null, we've exhausted the database
        if (!currentCursor) {
            break;
        }

        attempts++;
    }

    // Return the required page size of units and the last cursor used
    return {
        units: accumulatedUnseenUnits.slice(0, pageSize),
        nextCursor: currentCursor,
        hasMore: !!currentCursor // True if there might be more data
    };
}


async function loadUserFeed() {
    // Assume this function returns string[] of seen IDs
    const userSeenIdsArray = await fetchUserSeenHistoryFromFirebase(); 
    const seenIdsSet = new Set(userSeenIdsArray);

    // Pass 'null' for the initial cursor
    const feedResult = await fetchUnseenUnitsForUser(seenIdsSet, null, 15);
    
    // Pass feedResult.nextCursor back into the function for the next page load
}

function fetchUserSeenHistoryFromFirebase(): string[] {
    throw new Error('Function not implemented.');
}
