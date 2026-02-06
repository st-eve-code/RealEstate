import { AmenityType } from "../types";

// Function to find the matched amenities
export default function getMatchedFeatures(features: string[], amenities: AmenityType[]): AmenityType[] {
    // 1. Create a simplified, identifiable list of keywords from amenities
    const amenityKeywords = amenities.map(a => a.label.split('|')[0].trim().toLowerCase());

    const matchedAmenities: Set<AmenityType> = new Set();

    features.forEach(featureString => {
        const lowerCaseFeature = featureString.toLowerCase();

        // 2. Iterate through keywords to find a match in the current feature string
        for (const [index, keyword] of amenityKeywords.entries()) {
            if (lowerCaseFeature.includes(keyword)) {
                // 3. If a match is found, add the full amenity object to a Set
                // A Set prevents duplicate amenities if multiple feature strings match the same amenity
                matchedAmenities.add(amenities[index]);
                // Break the inner loop once a match is found for this feature string
                break; 
            }
        }
    });

    // Convert the Set back to an array
    return Array.from(matchedAmenities);
}