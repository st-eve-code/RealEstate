/**
 * Processes an array of property strings against an array of key properties 
 * to standardize formats and combine data.
 * 
 * @param props The raw list of properties (e.g., ["2 Bedrooms", "Basement"]).
 * @param keyProps The list of keywords that need specific formatting (e.g., ["Bed", "Kitchen"]).
 * @returns An array of standardized strings.
 */
export function processProps(props: string[], keyProps: string[]): string[] {
    const savedProps: string[] = [];
    // A Set to keep track of props we've already processed so we don't duplicate them
    const processedIndices = new Set<number>();

    // Regex to match a number at the start of the string, optionally followed by a space
    const quantityRegex = /^(\d+)\s?/i;

    // 1. Process keyProps first to get the formatted "Quantity Key" strings
    keyProps.forEach(keyProp => {
        const lowerKeyProp = keyProp.toLowerCase();

        props.forEach((propString, index) => {
            const lowerProp = propString.toLowerCase();
            const match = lowerProp.match(quantityRegex);
            
            // Check if the prop string contains the keyProp *after* the initial quantity (if any)
            if (lowerProp.includes(lowerKeyProp)) {
                // If a quantity was found (e.g., "2"), extract it. Otherwise, assume "1".
                const quantity = match ? match[1] : '1';
                
                // Format the new standardized string
                savedProps.push(`${quantity} ${keyProp}`);
                processedIndices.add(index); // Mark this index as processed
            }
        });
    });

    // 2. Add any remaining original props that weren't captured by the keyProps logic
    props.forEach((propString, index) => {
        if (!processedIndices.has(index)) {
            savedProps.push(propString);
        }
    });

    // Use a Set to remove any potential duplicates that might arise from edge cases
    return Array.from(new Set(savedProps));
}


/**
 * Processes an array of property strings and organizes them into standardized strings
 * and a structured map of key properties and others.
 * 
 * @param props The raw list of properties (e.g., ["2 Bedrooms", "Basement"]).
 * @param keyProps The list of keywords that need specific formatting (e.g., ["Bed", "Kitchen"]).
 * @returns An object containing the formatted array and the structured data map.
 */
export default function processPropsStructured(props: string[], keyProps: string[]): { 
    array: string[], 
    keyPropsMap: { 
        others: string[], 
        [key: string]: number | string[] 
    } 
} {
    const savedProps: string[] = [];
    const processedIndices = new Set<number>();
    const keyPropsMap: { others: string[], [key: string]: number | string[] } = {
        others: []
    };
    
    // Initialize keyPropsMap with 0 quantity for all keys first
    keyProps.forEach(key => {
        keyPropsMap[key] = 0;
    });

    const quantityRegex = /^(\d+)\s?/i;

    // 1. Process keyProps first to get the formatted "Quantity Key" strings and populate the map
    keyProps.forEach(keyProp => {
        const lowerKeyProp = keyProp.toLowerCase();

        props.forEach((propString, index) => {
            const lowerProp = propString.toLowerCase();
            // Match returns an array, or null if no number found
            const match = lowerProp.match(quantityRegex);
            
            // Check if the prop string includes the keyProp keyword
            if (lowerProp.includes(lowerKeyProp)) {
                // If a number was found (e.g., "2 Bedrooms" matches quantity 2), use it. 
                // Otherwise (e.g., "A kitchen" matches null), assume 1.
                const quantity = match && match[1] ? parseInt(match[1], 10) : 1;
                
                // Format the new standardized string
                savedProps.push(`${quantity} ${keyProp}`);
                processedIndices.add(index); // Mark this index as processed
                
                // Update the map quantity
                if (typeof keyPropsMap[keyProp] === 'number') {
                     keyPropsMap[keyProp] = (keyPropsMap[keyProp] as number) + quantity;
                }
            }
        });
    });

    // 2. Add any remaining original props to the 'others' array and the main savedProps array
    props.forEach((propString, index) => {
        if (!processedIndices.has(index)) {
            savedProps.push(propString);
            (keyPropsMap.others as string[]).push(propString);
        }
    });

    // Use Set to remove duplicates in the main array, then return the structured object
    return {
        array: Array.from(new Set(savedProps)),
        keyPropsMap: keyPropsMap
    };
}